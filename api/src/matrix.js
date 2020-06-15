const { LedMatrix } = require('rpi-led-matrix')
const { createCanvas, Image } = require('canvas')
const components = require('./layerComponent')

// eslint-disable-next-line no-unused-vars
module.exports = async function (app) {
  let func = async () => {

    let config = app.get('matrixConfig')
    app.$matrix = new LedMatrix(
      {
        ...LedMatrix.defaultMatrixOptions(),
        ...config
      },
      LedMatrix.defaultRuntimeOptions()
    )
    app.$layerClass = []

    let layers = (await app.service('layer').find({})).data
    for (let i = 0; i < layers.length; i++) {
      if (components[layers[i].type] != undefined) {
        app.$layerClass[layers[i]._id] = new components[layers[i].type](app, layers[i])
      }
    }

    let canvas = createCanvas(app.$matrix.width(), app.$matrix.height())
    let ctx = canvas.getContext('2d')
    await app.service('image').create({ _id: 'current', uri: canvas.toDataURL()})
    await app.service('image').create({ _id: 'currentLayer', uri: canvas.toDataURL()})
    await app.service('image').create({ _id: 'top', uri: canvas.toDataURL()})

    let topImage = new Image
    topImage.src = canvas.toDataURL()
    app.service('image').on('patched', (message) => {
      if (message._id === 'top') {
        topImage.src = message.uri
      }
    })
    let currentLayerUri = null
    let currentUri = null
    let currentUpdate = false

    setInterval(() => {
      patchImages()
        .catch(err => console.error(err))
    }, 100)

    // eslint-disable-next-line no-unused-vars
    app.$matrix.afterSync((mat, dt, t) => {
      setTimeout(() => update(), 1)
    })
    app.$matrix.sync()

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const keys = Object.keys(app.$layerClass).sort((f, s) => (app.$layerClass[f].layer.layer > app.$layerClass[s].layer.layer) ? 1 : -1)
      for (let k = 0; k < keys.length; k++) {
        app.$layerClass[keys[k]].drawToCtx(ctx)
      }

      let newCurrentLayerUri = canvas.toDataURL()
      if (currentLayerUri !== newCurrentLayerUri) {
        currentLayerUri = newCurrentLayerUri
        currentUpdate = true
      }

      ctx.drawImage(topImage, 0, 0)

      let newCurrentUri = canvas.toDataURL()
      if (currentUri !== newCurrentUri) {
        currentUri = newCurrentUri
        currentUpdate = true
      }

      app.$matrix.drawBuffer(canvasToBuffer(), canvas.width, canvas.height)
      app.$matrix.sync()
    }

    const patchImages = async () => {
      if (currentUpdate) {
        currentUpdate = false
        await app.service('image').patch('currentLayer', { uri: currentLayerUri })
        await app.service('image').patch('current', { uri: currentUri })
      }
    }

    const canvasToBuffer = () => {
      const width = canvas.width
      const height = canvas.height
      let buf = Buffer.alloc(width * height * 3)
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const data = ctx.getImageData(x, y, 1, 1).data
          const t = (x+(y*width))*3
          buf[t + 0] = data[0] * data[3] / 255
          buf[t + 1] = data[1] * data[3] / 255
          buf[t + 2] = data[2] * data[3] / 255
        }
      }
      return buf
    }
  }
  func()
    .catch(err => console.error(err))
}
