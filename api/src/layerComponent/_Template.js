/* eslint-disable no-unused-vars */
const { createCanvas } = require('canvas')

module.exports = class Template {
  constructor (app, layer) {
    console.log('new temp')
    this.app = app
    this.layerId = layer._id
    this.layer = layer

    // TODO: on patch
    this.app.service('layer').on('patched', (message, context) => {if (message._id === this.layerId) this.updateLayer(context.data)})

    this.canvas = createCanvas(this.layer.width, this.layer.height)
    this.ctx = this.canvas.getContext('2d')

    this.pullpushConfig()
      .catch(err => console.error(err))
  }

  async pullpushConfig () {
    this.layer = await this.app.service('layer').get(this.layerId)
    this.layer.height = this.layer.height == null ? this.app.$matrix.height() : this.layer.height
    this.layer.width = this.layer.width == null ? this.app.$matrix.width() : this.layer.width
    this.layer.x = this.layer.x == null ? 0 : this.layer.x
    this.layer.y = this.layer.y == null ? 0 : this.layer.y
    let { height, width, x, y } = this.layer
    await this.app.service('layer').patch(this.layerId, { height, width, x, y })
  }

  updateLayer (data) {
    for (const key in data) {
      this.layer[key] = data[key]
      if (key === 'width' || key === 'height') {        
        this.canvas = createCanvas(this.layer.width, this.layer.height)
        this.ctx = this.canvas.getContext('2d')
      }
    }
  }

  drawToCtx(matrixCtx) {
    matrixCtx.drawImage(this.canvas, this.layer.x, this.layer.y)
  }

  destroy () { }
}