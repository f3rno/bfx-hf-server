'use strict'

const _isError = require('lodash/isError')
const debug = require('debug')('bfx:hf:server:capture-exception')
const { sprintf } = require('sprintf-js')

const exception = (err, ...args) => {
  const str = args.length > 0
    ? sprintf(err, ...args)
    : _isError(err)
      ? err.message
      : err

  debug(_isError(err) ? err.stack : str)
}

module.exports = { exception }
