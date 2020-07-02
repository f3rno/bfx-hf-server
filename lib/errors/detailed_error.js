const _compact = require('lodash/compact')
const _isArray = require('lodash/isArray')
const getLogger = require('../util/get_logger')

/* @todo colorize */
class DetailedError extends Error {
  L = getLogger({ scope: 'err' })

  static getLogString (err) {
    return err.internalMessage
  }

  /* @todo colorize */
  static getlogStackString (err) {
    return err.stack
  }

  static genMessage (params) {
    const { publicMessage, internalMessage } = params

    return _compact([publicMessage, internalMessage]).join(': ')
  }

  constructor (publicMessage, internalMessage, logStack) {
    const msg = DetailedError.genMessage({ publicMessage, internalMessage })

    super(msg)

    this.name = 'DetailError'
    this.publicMessage = publicMessage
    this.internalMessage = internalMessage
    this.logStack = logStack
  }

  prefixInternalMessage (msg) {
    this.internalMessage = [msg, this.internalMessage].join(' - ')
  }

  toString () {
    return this.logStack
      ? DetailedError.getLogStackString(this)
      : DetailedError.getLogString(this)
  }

  log () {
    const str = this.toString()
    const parts = _isArray(str) ? str : [str]

    parts.forEach((ln, i) => DetailedError.L.error('[%d] err: %s', i, ln))
  }

  get message () {
    return DetailedError.genMessage(this)
  }
}

module.exports = DetailedError
