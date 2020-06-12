const { LedMatrix } = require('rpi-led-matrix')
const { createCanvas } = require('canvas')

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  let config = app.get('matrixConfig')
  app.$matrix = new LedMatrix(
    {
      ...LedMatrix.defaultMatrixOptions(),
      ...config
    },
    LedMatrix.defaultRuntimeOptions()
  )
  app.$layerClass = []
  app.$canvas = createCanvas(app.$matrix.width(), app.$matrix.height())
  app.$ctx = app.$canvas.getContext('2d')

  // eslint-disable-next-line no-unused-vars
  app.$matrix.afterSync((mat, dt, t) => {
    setTimeout(() => update(), 1000)
  })
  app.$matrix.sync()
  const update = () => {
    console.time('Update')
    app.$ctx.clearRect(0, 0, app.$canvas.width, app.$canvas.height)
    app.$layerClass.forEach(layerClass => {
      layerClass.drawToCtx(app.$ctx)
    })
    
    app.$matrix.drawBuffer(canvasToBuffer(), app.$canvas.width, app.$canvas.height)
    
    app.service('current-image').update(0, {})
      .catch(err => console.error(err))
    app.$matrix.sync()
    console.timeEnd('Update')
  }

  const canvasToBuffer = () => {
    const width = app.$canvas.width
    const height = app.$canvas.height
    let buf = Buffer.alloc(width * height * 3)
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const data = app.$ctx.getImageData(x, y, 1, 1).data
        buf[x*y + 0] = data[0] * data[3]
        buf[x*y + 1] = data[1] * data[3]
        buf[x*y + 2] = data[2] * data[3]
      }
    }
    return buf
  }
}
