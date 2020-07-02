'use strict'

const send = require('../../../util/ws/send')
const sendError = require('../../../util/ws/send_error')
const isAuthorized = require('../../../util/ws/is_authorized')
const validateParams = require('../../../util/ws/validate_params')

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
const onStopStrategy = async (server, ws, msg) => {
  const { db } = server
  const { StrategyExecution } = db
  const [, authToken, execID] = msg
  const validRequest = validateParams(ws, {
    authToken: { type: 'string', v: authToken },
    execID: { type: 'string', v: execID }
  })

  if (!validRequest) {
    return
  } else if (!isAuthorized(ws, authToken)) {
    sendError(ws, 'Unauthorized')
    return
  }

  const exec = await StrategyExecution.get(execID)

  if (!exec) {
    sendError(ws, 'Strategy execution not found')
    return
  } else if (!exec.active) {
    sendError(ws, 'Strategy execution not active')
    return
  }

  // TODO

  send(ws, ['data.strategy.exec.stopped', execID])
}

module.exports = onStopStrategy
