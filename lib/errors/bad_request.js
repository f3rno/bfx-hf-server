const _isObject = require('lodash/isObject')
const _isString = require('lodash/isString')
const WSHandlerError = require('./ws_handler_error')

class BadRequestError extends WSHandlerError {
  static getDetail () {
    return '' // TODO
  }

  constructor (ws, errorsOrDetail) {
    const internal = _isString(errorsOrDetail)
      ? errorsOrDetail
      : _isObject(errorsOrDetail)
        ? BadRequestError.getDetail(errorsOrDetail)
        : 'validation failed'

    super(ws, 'Bad Request', internal)

    this.name = 'BadRequestError'
  }
}

module.exports = BadRequestError
