const portPID = require('port-pid')
const _isEmpty = require('lodash/isEmpty')

/**
 * Returns the first free port number found from the provided start.
 *
 * @private
 * @throws {Error} fails if no port is found within the attempt limit.
 *
 * @param {number} startPort - initial port to begin search from.
 * @param {number} [maxAttempts=1024] - number of consecutive ports to check.
 * @returns {number} port - free port.
 */
const resolveWorkerAPIPort = async (startPort, maxAttempts = 1024) => {
  let port = startPort + 1
  let portValid = false
  let attempt = 1

  // Resolve a free port number for the child's WS API server
  while (!portValid && attempt <= maxAttempts) {
    const pids = await portPID(port)
    const { all } = pids

    portValid = _isEmpty(all)

    if (!portValid) {
      port += 1
      attempt += 1
    }
  }

  if (!portValid) {
    throw new Error(`Worker port not resolved after ${maxAttempts} attempts`)
  }

  return port
}

module.exports = resolveWorkerAPIPort
