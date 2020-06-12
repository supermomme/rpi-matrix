const layer = require('./layer/layer.service.js')
const currentImage = require('./current-image/current-image.service.js')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(layer)
  app.configure(currentImage)
}
