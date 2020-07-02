'use strict'

const path = require('path')
const { _default: DEFAULT_SETTINGS } = require('bfx-hf-ui-config').UserSettings
const send = require('../../../util/ws/send')
const sendError = require('../../../util/ws/send_error')
const createStrategyWorker = require('../../../strategy_worker/create')
const createExecModel = require('../../../strategy_worker/create_exec_model')
const WSHandlerError = require('../../../errors/ws_handler_error')
const enforceRequestValidity = require('../../../util/ws/enforce_req_validity' )

/**
 * Runs a strategy (by ID) in a spawned process.
 *
 * Responds with a `['data.strategy.start', strategyID]` message on success
 * Responds with an error on failure
 *
 * @private
 * @async
 *
 * @param {module:bfx-hf-server.APIWSServer} server - server
 * @param {WebSocket} ws - client
 * @param {Array[]} msg - incoming message
 * @returns {Promise} p
 */
const onStartStrategy = async (server, ws, msg) => {
  const { d, db } = server
  const { UserSettings, Strategy, StrategyExecution } = db
  const [, authToken, strategyID, symbol, tf] = msg
  const { userSettings: settings } = await UserSettings.getAll()
  const { bgStrategyExec } = settings || DEFAULT_SETTINGS

  enforceRequestValidity(ws, {
    authToken,
    paramValidators: {
      strategyID: { type: 'string', v: strategyID },
      symbol: { type: 'string', v: symbol },
      tf: { type: 'string', v: tf }
    }
  })

  const strategy = await Strategy.get(strategyID)

  if (!strategy) {
    throw new WSHandlerError(ws, `Unknown strategy ID: ${strategyID}`)
  }

  d('starting worker for strategy %s', strategyID)

  const exec = await createExecModel(db, { strategyID })

  try {
    await StrategyExecution.set(exec)
  } catch (e) {
    throw new WSHandlerError(ws, 'Failed to create strategy execution model')
  }

  try {
    const logFN = `/strategy-worker-${strategyID}.log`

    await createStrategyWorker({
      d,
      strategy,
      execID: exec.id,
      initialState: {},
      apiPort: server._port,
      detached: bgStrategyExec,
      logFN: path.join(server.strategyLogDir, logFN)
    })

    send(ws, ['data.strategy.start', strategyID])
  } catch (e) {
    const msg = `failed to spawn worker for strategy ${strategyID}`

    d('%s: %s', msg, e.stack)
    sendError(ws, msg)
  }
}

module.exports = onStartStrategy
