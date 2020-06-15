// Cooming as soon as https://github.com/Automattic/node-canvas/issues/1394 is resolved

/* eslint-disable no-unused-vars */
const { parentPort, workerData } = require('worker_threads')
const { createCanvas } = require('canvas')
const { width, height, color } = workerData

const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`
  // ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`
  ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
  
  ctx.font = `lighter ${canvas.height}px sans-serif`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  let d = new Date()
  let txt = `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}`
  ctx.fillText(txt, canvas.width/2, canvas.height/2, canvas.width)

  parentPort.postMessage(canvas.toDataURL())
}, 1000)