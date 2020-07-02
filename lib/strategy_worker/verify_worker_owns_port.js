const portPID = require('port-pid')
const DetailedError = require('../errors/detailed_error')

/**
 * @private
 * @throws {DetailedError} fails if the port is not owned by the provided PID
 *
 * @param {number} port - port to check.
 * @param {number} expectedPID - PID that must own the port.
 * @returns {Promise} p
 */
const verifyWorkerOwnsPort = async (port, expectedPID) => {
  const { tcp } = await portPID(port)
  const [foundPID] = tcp

  if (foundPID !== expectedPID) {
    throw new DetailedError('Internal Error', `worker not port owner: ${port}`)
  }
}

module.exports = verifyWorkerOwnsPort
