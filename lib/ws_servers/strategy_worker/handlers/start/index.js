'use strict'

// const getStateFN = require('./get_state_fn')
// const loadStrategy = require('./load_strategy')

/**
 * @memberof module:bfx-hf-server
 * @private
 * @async
 *
 * @param {module:bfx-hf-ui.StrategyWorkerWSServer} server - server
 * @param {WebSocket} ws - client
 * @param {Array[]} msg - incoming message
 * @returns {Promise} p
 */
const startCommandHandler = async (server, ws, msg) => { // eslint-disable-line
  // TODO: Validate
  // const [
  //   id, symbol, tf, defineMetaSrc, defineIndicatorsSrc, execSrc
  // ] = msg[1]

  // server.setConfigured(id)

  // const strategy = loadStrategy({
  //   symbol, tf, defineMetaSrc, defineIndicatorsSrc, execSrc
  // })

  // const stateFN = getStateFN(id)
}

module.exports = startCommandHandler
