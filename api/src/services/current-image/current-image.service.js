// Initializes the `currentImage` service on path `/current-image`
const { CurrentImage } = require('./current-image.class');
const hooks = require('./current-image.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/current-image', new CurrentImage(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('current-image');

  service.hooks(hooks);
};
