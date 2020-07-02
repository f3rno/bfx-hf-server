const { sprintfjs: sprintf } = require('sprintf-js')
const _isError = require('lodash/isError')
const DetailedError = require('./detailed_error')

class ParamValidationError extends DetailedError {
  constructor (ws, param = {}) {
    const { name, type, v, err } = param
    const internal = sprintf(
      'param %s expected to be of type %s, got "%s" [%s]',
      name, type, `${v}`, _isError(err) ? err.message : err
    )

    super(ws, 'Param Invalid', internal)

    this.name = 'ParamValidationError'
    this.param = { name, type, v, err }
  }

  get param () {
    return this.param
  }
}

module.exports = ParamValidationError
