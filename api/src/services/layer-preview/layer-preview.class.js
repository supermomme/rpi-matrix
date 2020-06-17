/* eslint-disable no-unused-vars */
exports.LayerPreview = class LayerPreview {
  constructor (options) {
    this.options = options || {}
  }

  setup (app, path) {
    this.app = app
  }

  async _getPreviewUri (layer) {
    return null // Some uri
  }

  async get (id, params) {
    const layer = await this.app.serivce('layer').get(id, params)
    return await this._getPreviewUri(layer)
  }

  async create (layer, params) {
    return await this._getPreviewUri(layer)
  }
}
