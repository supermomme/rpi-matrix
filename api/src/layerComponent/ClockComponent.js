const Template = require('./_Template')

module.exports = class ClockComponent extends Template {
  constructor (app, layerId) {
    super(app, layerId)
    this.color = this.layer.color == null ? { r: 255, g: 255, b: 255, a: 1 } : this.layer.color

    this.interval = setInterval(() => this.updateCanvas(), 1000)
  }

  updateCanvas () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.strokeStyle = `rgb(${this.color.r},${this.color.g},${this.color.b})`
    this.ctx.fillStyle = `rgb(${this.color.r},${this.color.g},${this.color.b})`
    
    this.ctx.font = `lighter ${this.canvas.height}px sans-serif`
    this.ctx.textBaseline = 'middle'
    this.ctx.textAlign = 'center'
    let d = new Date()
    let txt = `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}`
    this.ctx.strokeText(txt, this.canvas.width/2, this.canvas.height/2, this.canvas.width)
  }

  destroy () {
    clearInterval(this.interval)
    super.destroy()
  }
}