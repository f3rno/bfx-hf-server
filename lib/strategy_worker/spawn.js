const path = require('path')
const Bluebird = require('bluebird')
const _isFinite = require('lodash/isFinite')
const { promises: fs } = require('fs')
const { spawn } = require('child_process')
const colors = require('colors')

const SCRIPT_PATH = path.join(__dirname, 'worker.js')

/**
 * Creates a log stream and spawns a worker child process. Respects the
 * specified grace period before resolving the returned promise.
 *
 * @private
 * @throws {Error} fails if `logFN` cannot be opened for append.
 *
 * @param {params} params - params.
 * @param {Function} params.d - logger function.
 * @param {number} params.apiPort - requested child WS API port number.
 * @param {string} params.execID - ID of associated strategy execution model.
 * @param {object} params.initialState - used as initial strategy state; pass
 *   state from a previous run to resume execution.
 * @param {boolean} [params.detached] - causes the child process to spawn
 *   detached.
 * @param {number} [params.gracePeriodMS=2000] - time to wait after succesful
 *   spawn, prior to resolving returned promise.
 * @returns {Promise} p - resolves to process object.
 */
const spawnWorker = async (params = {}) => {
  const {
    d, logFN, apiPort, execID, initialState, detached, gracePeriodMS = 2000
  } = params

  const stateJSON = JSON.stringify(initialState)
  const logStream = await fs.open(logFN, 'a')

  if (detached) {
    d('%s',
      colors.yellow(`spawning worker as a ${colors.underline('bg')} process`)
    )
  }

  const spawnArgs = [SCRIPT_PATH, apiPort, execID, stateJSON]
  const proc = spawn(process.argv[0], spawnArgs, {
    stdio: ['ignore', logStream, logStream],
    detached
  })

  if (_isFinite(gracePeriodMS) && gracePeriodMS > 0) {
    await Bluebird.delay(gracePeriodMS)
  }

  return proc
}

module.exports = spawnWorker
