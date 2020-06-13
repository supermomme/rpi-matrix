// Initializes the `Image` service on path `/image`
const { Image } = require('./image.class')
const hooks = require('./image.hooks')

module.exports = function (app) {
  const options = {
    id: '_id',
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/image', new Image(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('image')

  service.hooks(hooks)
}
