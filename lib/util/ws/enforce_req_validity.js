const isAuthorized = require('./is_authorized')
const UnauthorisedError = require('../../errors/unauthorized')
const validateParams = require('../validation/params')

/**
 * @todo add auto-param validation by name (i.e. strategyID is always a string)
 *
 * @throws {Error} fails if the user is found to be unuthorized
 * @see {@link validateParams}
 *
 * @param {ws.Client} ws - ws client.
 * @param {object} [params={}] - params.
 * @param {string} [params.authToken] - secret token created when user was
 *   authenticated, used to auth user for this request.
 * @param {boolean} [params.validRequest] - optional, if `true`,
 *   `validatePArams` is skipped.
 * @param {object} [params.paramValidators] - validators.
 * @returns {null} null
 */
const enforceRequestValidity = (ws, params = {}) => {
  const { authToken, validRequest: isValid, paramValidators = {} } = params

  if (isAuthorized(ws, authToken)) {
    throw new UnauthorisedError(ws)
  }

  if (isValid === true) {
    return
  }

  const validRequest = validateParams(ws, {
    authToken: { type: 'string', v: authToken },
    ...paramValidators
  })

  if (validRequest && isAuthorized(ws, authToken)) {
    return null
  }

  throw new WSHandlerError(ws, 'Unauthorized')
}

module.exports = enforceRequestValidity
