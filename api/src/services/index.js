const layer = require('./layer/layer.service.js')
const image = require('./image/image.service.js')
const layerPreview = require('./layer-preview/layer-preview.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(layer)
  app.configure(image)
  app.configure(layerPreview);
}
