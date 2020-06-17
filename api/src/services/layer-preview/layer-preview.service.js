// Initializes the `layer-preview` service on path `/layer-preview`
const { LayerPreview } = require('./layer-preview.class');
const hooks = require('./layer-preview.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/layer-preview', new LayerPreview(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('layer-preview');

  service.hooks(hooks);
};
