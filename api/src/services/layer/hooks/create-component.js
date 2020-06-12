// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const logger = require('../../../logger')
const components = require('../../../layerComponent')

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    console.log(context.result)
    if (components[context.result.type.toLowerCase()] != undefined) {
      context.app.$layerClass[context.result._id] = new components[context.result.type.toLowerCase()](context.app, context.result._id)
    } else {
      logger.warn(`Class does not exist! skip ${context.result._id} with type ${context.result.type}`)
    }
    return context
  }
}