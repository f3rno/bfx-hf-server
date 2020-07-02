const { Signale } = require('signale')

const getLogger = (params = {}) => (
  new Signale(params)
)

module.exports = getLogger
