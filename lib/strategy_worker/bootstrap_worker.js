const WS = require('ws')
const DetailedError = require('../errors/detailed_error')

/**
 * Connects to child worker on designated API port, and sends the strategy to
 * be executed and starts execution.
 *
 * @private
 * @todo switch to `wss://`
 * @todo expand usage of worker API server.
 * @todo create typedef for strategy definition.
 *
 * @param {object} params - params
 * @param {Function} params.d - logger.
 * @param {number} params.apiPort - worker ws API port.
 * @param {object} params.strategy - strategy definition.
 * @param {boolean} [params.detached] - causes the child process to spawn
 *   detached.
 * @param {ChildProcess} params.childProc - child process object.
 * @returns {Promise} p
 */
const bootstrapWorker = async (params = {}) => {
  const { d, apiPort, strategy, detached, proc } = params
  const { id, defineMeta, defineIndicators, exec } = strategy
  const client = new WS(`ws://localhost:${apiPort}`)

  client.on('error', (e) => {
    client.close()

    throw new DetailedError(
      'Strategy execution error', `recv child ws error: ${e.message}`
    )
  })

  client.on('open', () => {
    client.send(JSON.stringify([
      'start', [id, defineMeta, defineIndicators, exec]
    ]))

    // Background worker
    if (detached) {
      d('child process discounted from event loop dependents')
      proc.unref()
    }
  })

  await new Promise(resolve => {
    client.on('close', resolve)
    client.close()
  })
}

module.exports = bootstrapWorker
