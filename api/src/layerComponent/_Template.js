/* eslint-disable no-unused-vars */
const { createCanvas } = require('canvas')

module.exports = class Template {
  constructor (app, layerId) {
    this.app = app
    this.layerId = layerId
    this.layer = app.service('layer').get(layerId)
    this.height = this.layer.height == null ? app.$matrix.height() : this.layer.height
    this.width = this.layer.width == null ? app.$matrix.width() : this.layer.width
    this.posX = this.layer.x == null ? 0 : this.layer.x
    this.posY = this.layer.y == null ? 0 : this.layer.y

    this.canvas = createCanvas(this.width, this.height)
    this.ctx = this.canvas.getContext('2d')
  }

  drawToCtx(matrixCtx) {
    matrixCtx.drawImage(this.canvas, this.posX, this.posY)
  }

  destroy () { }
}