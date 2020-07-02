'use strict'

const _isError = require('lodash/isError')
const send = require('./send')

module.exports = (ws, err) => {
  const { WS_SEND_ERROR_TRACE = '1' } = process.env

  if (+WS_SEND_ERROR_TRACE) {
    console.trace(err)
  }

  send(ws, ['error', err, _isError(err) ? err.stack : null])
}
