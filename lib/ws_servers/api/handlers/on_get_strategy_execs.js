'use strict'

const sendError = require('../../../util/ws/send_error')
const isAuthorized = require('../../../util/ws/is_authorized')
const validateParams = require('../../../util/ws/validate_params')
const sendStrategyExecs = require('../send_strategy_execs')

/**
 * @memberof module:bfx-hf-server
 * @private
 * @async
 *
 * @param {module:bfx-hf-server.APIWSServer} server - server
 * @param {WebSocket} ws - client
 * @param {Array[]} msg - incoming message
 * @returns {Promise} p
 */
const onGetStrategyExecs = async (server, ws, msg) => {
  const { db } = server
  const [, authToken] = msg
  const validRequest = validateParams(ws, {
    authToken: { type: 'string', v: authToken }
  })

  if (!validRequest) {
    return
  } else if (!isAuthorized(ws, authToken)) {
    sendError(ws, 'Unauthorized')
    return
  }

  await sendStrategyExecs(ws, db)
}

module.exports = onGetStrategyExecs
