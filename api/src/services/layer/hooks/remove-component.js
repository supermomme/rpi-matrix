// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    // TODO: rework remove hook
    // if (context.app.$layerClass[context.result._id] != undefined) {
    //   context.app.$layerClass[context.result._id].destroy()
    //   delete context.app.$layerClass[context.result._id]
    // }
    return context
  }
}