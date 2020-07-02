'use strict'

const WSServer = require('../../ws_server')
const startCommandHandler = require('./handlers/start')

/**
 * @class
 * @memberof module:bfx-hf-server
 * @augments module:bfx-hf-server.WSServer
 */
class StrategyWorkerWSServer extends WSServer {
  /**
   * @param {object} params - params
   * @param {number} params.port - server port
   * @param {number} [params.execID] - execution ID
   * @param {object} [params.initialState={}] - initial strategy state
   */
  constructor (params = {}) {
    const { port } = params

    super({
      port,
      debugName: 'strategy-worker',
      msgHandlers: {
        start: startCommandHandler
      }
    })

    this._configuredWithID = null
  }

  /**
   * @throws {Error} fails if already configured
   *
   * @param {number} id - ID of strategy the server is executing
   */
  setConfigured (id) {
    if (this._configuredWithID !== null) {
      throw new Error('Already configured with a strategy')
    }

    this._configuredWithID = id
  }

  /**
   * @returns {boolean} isConfigured
   */
  isConfigured () {
    return this._configuredWithID !== null
  }
}

module.exports = StrategyWorkerWSServer
