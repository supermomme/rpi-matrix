import feathers from '@feathersjs/client'
import socketio from '@feathersjs/client/socketio'
import auth from '@feathersjs/client/authentication'
import io from 'socket.io-client'
import feathersVuex from 'feathers-vuex'

const socket = io('/', { transports: ['websocket'], path: '/api/socket.io' })
/*
  https://stackoverflow.com/questions/18877643/error-in-local-storage-ns-error-file-corrupted-firefox
  https://davidjb.com/blog/2017/11/resolving-an-ns_error_file_corrupted-error-in-mozilla-firefox/
*/

function catchFirefoxError (error) {
  console.error(error)
  if (error.name === 'NS_ERROR_FILE_CORRUPTED') {
    localStorage.clear()
    sessionStorage.clear()
    location.reload()
  }
}

const localStorageWrapper = {
  setItem: function () {
    try {
      return window.localStorage.setItem.apply(localStorage, arguments)
    } catch (error) {
      catchFirefoxError(error)
    }
  },
  getItem: function () {
    try {
      return window.localStorage.getItem.apply(localStorage, arguments)
    } catch (error) {
      catchFirefoxError(error)
    }
  },
  removeItem: function () {
    try {
      return window.localStorage.removeItem.apply(localStorage, arguments)
    } catch (error) {
      catchFirefoxError(error)
    }
  }
}

const feathersClient = feathers()
  .configure(socketio(socket, {
    timeout: 60000
  }))
  .configure(auth({ storage: localStorageWrapper }))

export default feathersClient

// Setting up feathers-vuex
const { makeServicePlugin, makeAuthPlugin, BaseModel, models, FeathersVuex } = feathersVuex(
  feathersClient,
  {
    idField: '_id'
  }
)

export { makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex }
