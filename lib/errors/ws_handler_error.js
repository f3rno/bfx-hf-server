const sendError = require('../util/ws/send_error')
const InternalError = require('./internal_error')
const { object: validObject } = require('../util/validation/validators')

class WSHandlerError extends InternalError {
  constructor (ws, detail) {
    super('WS API Handler Error', detail)

    this.name = 'WSHandlerErr'

    if (validObject(ws)) {
      sendError(ws, this.message)
    }
  }
}

module.exports = WSHandlerError
