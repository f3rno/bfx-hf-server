const DetailedError = require('./detailed_error')

class InternalError extends DetailedError {
  constructor (detail, logStack) {
    super('Internal error', detail, logStack)

    this.name = 'InternalError'
  }
}

module.exports = InternalError
