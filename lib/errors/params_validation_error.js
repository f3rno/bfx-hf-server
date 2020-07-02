const _map = require('lodash/map')
const WSHandlerError = require('./ws_handler_error')

/**
 * Param validation errors are hidden from the UI, as they should be impossible
 * due to safeguards in the UI itself. Detailed information will be logged
 * instead.
 *
 * @todo potentially expand public message, or rely on UI to provide one
 *
 * @class
 * @augments WSHandlerError
 */
class ParamsValidationError extends WSHandlerError {
  static getDetail (errors) {
    return _map(errors, 'internalMessage').join('\n')
  }

  constructor (ws, errors = []) {
    super(ws, 'Invalid Parameters', ParamsValidationError.getDetail(errors))

    this.name = 'ParamsValidationError'
    this.errors = errors
    this.params = _map(errors, 'param')
  }
}

module.exports = ParamsValidationError
