const createComponent = require('./hooks/create-component')
const removeComponent = require('./hooks/remove-component')
const addLayer = require('./hooks/add-layer')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ addLayer() ],
    update: [ addLayer() ],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [createComponent()],
    update: [],
    patch: [],
    remove: [removeComponent()]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
