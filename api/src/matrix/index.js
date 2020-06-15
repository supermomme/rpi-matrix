/* eslint-disable no-unused-vars */
const { createCanvas, Image } = require('canvas')
const componentClass = require('./layer/class')
const { Worker } = require('worker_threads')

// eslint-disable-next-line no-unused-vars
module.exports = async function (app) {
  let reloadMatrix = async () => {
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

    // init layers
    app.$layer = {}
    let layers = (await app.service('layer').find({})).data
    for (let i = 0; i < layers.length; i++) {
      // TODO: add worker threads for more fun :)
      // See: https://github.com/Automattic/node-canvas/issues/1394
      // const worker = new Worker(componentWorker[layers[i].type], {
      //   workerData: {
      //     ...layers[i]
      //   }
      // })
    
      // worker.on('message', (message) => {
      //   app.$layerWorker[layers[i]._id].uri = message
      //   console.log(message)
      // })
      // worker.on('error', console.error)
      // worker.on('exit', code => console.log('Worker exit: ', code))

      if (componentClass[layers[i].type] != undefined) {
        app.$layer[layers[i]._id] = {
          // worker,
          class: new componentClass[layers[i].type]({
            ...layers[i],
            outputWidth: width,
            outputHeight: height
          }),
          uri: null, // Mainly for future worker use
          changed: false
        }
      }
    }

    // keep layers updated
    setInterval(() => {
      for (const key in app.$layer) {
        const newUri = app.$layer[key].class.getDataURL()
        if (app.$layer[key].uri != newUri) {
          app.$layer[key].changed = true
          app.$layer[key].uri = newUri
        }
      }
    }, 100)


    // setup canvas
    let canvas = createCanvas(width, height)
    let ctx = canvas.getContext('2d')

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
      for (const key in app.$layer) {
        if (app.$layer[key].uri !== null) {
          if (app.$layer[key].changed) {
            app.$layer[key].changed = false
            changed = true
          }
          const img = new Image()
          await new Promise((resolve, reject) => {
            img.onload = () => {
              resolve()
            }
            img.src = app.$layer[key].uri
          })
          ctx.drawImage(img, 0, 0)
        }
      }
      if (changed) {
        console.log('change!')
        await app.service('image').patch('current', { uri: canvas.toDataURL() })
        matrixWorker.postMessage({
          type: 'drawBuffer',
          buffer: canvasToBuffer(),
          width: canvas.width,
          height: canvas.height
        })
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
  reloadMatrix()
    .catch(err => console.error(err))
}
