const Template = require('./_Template')

module.exports = class ClockComponent extends Template {
  constructor (app, layer) {
    layer.color = layer.color == null ? { r: 255, g: 255, b: 255, a: 1 } : layer.color
    super(app, layer)

    this.interval = setInterval(() => this.updateCanvas(), 1000)
  }

  updateCanvas () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.strokeStyle = `rgba(${this.layer.color.r},${this.layer.color.g},${this.layer.color.b},${this.layer.color.a})`
    this.ctx.fillStyle = `rgba(${this.layer.color.r},${this.layer.color.g},${this.layer.color.b},${this.layer.color.a})`
    
    this.ctx.font = `lighter ${this.canvas.height}px sans-serif`
    this.ctx.textBaseline = 'middle'
    this.ctx.textAlign = 'center'
    let d = new Date()
    let txt = `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}`
    this.ctx.fillText(txt, this.canvas.width/2, this.canvas.height/2, this.canvas.width)
  }

  updateLayer (...a) {
    super.updateLayer(...a)
    this.updateCanvas()
  }

  destroy () {
    clearInterval(this.interval)
    super.destroy()
  }
}