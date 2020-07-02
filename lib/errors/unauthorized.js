const WSHandlerError = require('./ws_handler_error')

class UnauthorisedError extends WSHandlerError {
  static getInternalMessage (ws = {}) {
    const { authPassword, authControl, authToken } = ws

    return [
      'client ws object:',
      !!authPassword && 'lacks password',
      !!authControl && 'lacks control',
      authControl !== authToken && 'has control/token mismatch'
    ].join(' ')
  }

  constructor (ws, detail) {
    const internal = detail || UnauthorisedError.getInternalMessage(ws)

    super(ws, 'Unauthorized Request', internal)
    this.name = 'Unauthorised'
  }
}

module.exports = UnauthorisedError
