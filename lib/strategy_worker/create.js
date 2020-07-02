'use strict'

const resolveWorkerAPIPort = require('./resolve_worker_api_port')
const verifyWorkerOwnsPort = require('./verify_worker_owns_port')
const bootstrapWorker = require('./bootstrap_worker')
const spawnWorker = require('./spawn')

/**
 * @private
 *
 * @param {object} params - params.
 * @param {object} params.strategy - strategy definition.
 * @param {number} params.apiPortSearchStart - port to start child API port
 *   resolution from.
 * @param {string} params.logFN - worker log file path
 * @param {string} params.execID - execution ID
 * @param {boolean} [params.detached] - causes the child process to spawn
 *   detached.
 * @returns {Promise} p
 */
const createStrategyWorker = async (params) => {
  const { apiPortSearchStart } = params
  const apiPort = await resolveWorkerAPIPort(apiPortSearchStart)
  const proc = await spawnWorker(params)

  try {
    await verifyWorkerOwnsPort(apiPort, proc.pid)
    await bootstrapWorker({ ...params, apiPort, proc })
  } catch (err) {
    if (!proc.kill()) {
      err.prefixInternalMessage('[kill failed]')
    }

    throw err
  }

  return proc
}

module.exports = createStrategyWorker
