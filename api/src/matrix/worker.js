// Cooming as soon as https://github.com/Automattic/node-canvas/issues/1394 is resolved

/* eslint-disable no-unused-vars */
const { parentPort, workerData } = require('worker_threads')
const { LedMatrix } = require('rpi-led-matrix')
const { config } = workerData

const matrix = new LedMatrix(
  {
    ...LedMatrix.defaultMatrixOptions(),
    ...config
  },
  LedMatrix.defaultRuntimeOptions()
)

matrix.sync()

parentPort.on('message', message => {
  if (message.type === 'drawBuffer') {
    matrix.drawBuffer(message.buffer, message.width, message.height)
    matrix.sync()
  } else {
    console.log('[Matrix Worker] Unkown Message Type', message)
  }
})