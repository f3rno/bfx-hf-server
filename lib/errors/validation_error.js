const DetailedError = require('./detailed_error')

class ValidationError extends DetailedError {
  constructor (v, message, type) {
    super(`Validation Error [${type}]:`, message)

    this.name = 'ValidationError'
    this.type = type
    this.value = v
  }
}

module.exports = ValidationError
