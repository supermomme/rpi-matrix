const { createCanvas } = require('canvas')

// eslint-disable-next-line no-unused-vars
module.exports = (layer, oWidth, oHeight, cycle) => {
  const canvas = createCanvas(layer.width, layer.height)
  const ctx = canvas.getContext('2d')
  if (layer.type === 'clock') {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = `rgba(${layer.color.r},${layer.color.g},${layer.color.b},${layer.color.a})`
    ctx.fillStyle = `rgba(${layer.color.r},${layer.color.g},${layer.color.b},${layer.color.a})`
    
    ctx.font = `lighter ${canvas.height}px sans-serif`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    let d = new Date()
    let txt = `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}`
    ctx.fillText(txt, canvas.width/2, canvas.height/2, canvas.width)
  }

  const retCanvas = createCanvas(oWidth, oHeight)
  retCanvas.getContext('2d').drawImage(
    canvas,
    layer.x,
    layer.y,
    canvas.width,
    canvas.height
  )
  return retCanvas.toDataURL()
}