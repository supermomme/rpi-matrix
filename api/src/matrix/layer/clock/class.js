const { createCanvas } = require('canvas')

module.exports = class ClockComponent {
  constructor (config) {
    this.config = config
    this.canvas = createCanvas(this.config.width, this.config.height)
    this.ctx = this.canvas.getContext('2d')

    this.interval = setInterval(() => this.update(), 1000)
  }

  update () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.strokeStyle = `rgba(${this.config.color.r},${this.config.color.g},${this.config.color.b},${this.config.color.a})`
    this.ctx.fillStyle = `rgba(${this.config.color.r},${this.config.color.g},${this.config.color.b},${this.config.color.a})`
    
    this.ctx.font = `lighter ${this.canvas.height}px sans-serif`
    this.ctx.textBaseline = 'middle'
    this.ctx.textAlign = 'center'
    let d = new Date()
    let txt = `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}`
    this.ctx.fillText(txt, this.canvas.width/2, this.canvas.height/2, this.canvas.width)
  }

  getDataURL () {
    const ret = createCanvas(this.config.outputWidth, this.config.outputHeight)
    ret.getContext('2d').drawImage(
      this.canvas,
      this.config.x,
      this.config.y,
      this.canvas.width,
      this.canvas.height
    )
    return ret.toDataURL()
  }

  destroy () {
    clearInterval(this.interval)
    super.destroy()
  }
}