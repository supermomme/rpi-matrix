// Initializes the `layer` service on path `/layer`
const { Layer } = require('./layer.class')
const hooks = require('./layer.hooks')

module.exports = function (app) {
  const options = {
    id: '_id',
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/layer', new Layer(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('layer')

  service.hooks(hooks)
}
