/* eslint-disable no-unused-vars */
const { createCanvas, Image } = require('canvas')
const draw = require('./draw')
const { Worker } = require('worker_threads')

// eslint-disable-next-line no-unused-vars
module.exports = async function (app) {
  let reloadMatrix = async () => {
    const fps = .5

    // Create Matrix Worker
    const matrixWorker = new Worker(__dirname + '/worker.js', {
      workerData: {
        config: app.get('matrixConfig')
      }
    })
    matrixWorker.on('message', (message) => {
      console.log(message)
    })
    matrixWorker.on('error', console.error)
    matrixWorker.on('exit', code => console.log('Worker exit: ', code))

    const width = app.get('matrixWidth') // TODO: get this from matrixWorker
    const height = app.get('matrixHeight') // TODO: get this from matrixWorker

    // setup canvas
    let canvas = createCanvas(width, height)
    let ctx = canvas.getContext('2d')

    // init layers
    const layers = (await app.service('layer').find({ paginate: false })).reduce((prev, layer) => {
      prev.push({
        cycle: 0,
        uri: null,
        changed: false,
        layer
      })
      return prev
    }, [])

    // keep layers updated
    setInterval(() => {
      layers.forEach(layer => {
        let prevUri = layer.uri
        layer.cycle += layer.layer.cps / fps // CPS = Cycle Per Seconds)
        layer.uri = draw(layer.layer, canvas.width, canvas.height, layer.cycle)
        if (prevUri != layer.uri) layer.changed = true
      })
    }, 1000/fps)

    // create img in memory service
    await app.service('image').create({ _id: 'current', uri: canvas.toDataURL()})

    // matrix loop
    setInterval(() => {
      update()
        .catch(console.error)
    }, 1000)

    const update = async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let changed = false
      layers.forEach(async layer => {
        if (layer.uri != null && layer.changed) {
          layer.changed = false
          changed = true
        }
      })

      layers.sort((l1, l2) => l1.layer.layer - l2.layer.layer)

      if (!changed) return
      for (let i = 0; i < layers.length; i++) {
        const img = new Image()
        await new Promise((resolve, reject) => {
          img.onload = () => {
            resolve()
          }
          img.src = layers[i].uri
        })
        ctx.drawImage(img, 0, 0)
      }

      console.log('draw!')
      await app.service('image').patch('current', { uri: canvas.toDataURL() })
      matrixWorker.postMessage({
        type: 'drawBuffer',
        buffer: canvasToBuffer(),
        width: canvas.width,
        height: canvas.height
      })
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
  reloadMatrix()
    .catch(err => console.error(err))
}
