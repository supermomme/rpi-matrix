// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const logger = require('../../../logger')
const componentClass = require('../../../matrix/layer/class')

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    console.log(context.result)
    if (componentClass[context.result.type.toLowerCase()] != undefined) {
      context.app.$layer[context.result._id] = {
        // worker, // TODO: worker
        class: new componentClass[context.result.type]({
          ...context.result,
          outputWidth: context.app.$matrix.width(),
          outputHeight: context.app.$matrix.height()
        }),
        uri: null, // Mainly for future worker use
        changed: false
      }
    } else {
      logger.warn(`Class does not exist! skip ${context.result._id} with type ${context.result.type}`)
    }
    return context
  }
}