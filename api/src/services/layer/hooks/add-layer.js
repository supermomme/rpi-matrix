// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (context.data.layer == null) {
      const layers = await context.app.service('layer').find({
        query: {
          $limit: 1,
          $sort: {
            layer: -1
          }
        }
      })
      if (layers.total === 0) context.data.layer = 0
      else {
        context.data.layer = layers.data[0].layer + 1
      }
    }
    return context
  }
}