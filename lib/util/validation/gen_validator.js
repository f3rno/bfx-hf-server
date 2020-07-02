const ValidationError = require('../../errors/validation_error')

const genValidator = (fn, type, message) => noThrow => v => {
  const label = message || `${v} is not a ${type}`
  const valid = fn(v)
  const err = new ValidationError(v, label, message)

  if (valid) {
    return null
  } else if (noThrow) {
    return err
  }

  throw err
}

module.exports = genValidator
