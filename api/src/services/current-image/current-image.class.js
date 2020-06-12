/* eslint-disable no-unused-vars */
exports.CurrentImage = class CurrentImage {
  constructor (options) {
    this.options = options || {}
  }

  setup (app, path) {
    this.app = app
  }

  async get (id, params) {
    return {
      uri: this.app.$canvas.toDataURL()
    }
  }

  async update (id, data, params) {
    return this.get(0, params)
  }
}
