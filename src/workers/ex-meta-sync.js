'use strict'

const debug = require('debug')('bfx:hf:server:db-exa-meta-sync')
const exchangeClients = require('../exchange_clients')
const sync = require('../sync_meta')

module.exports = (syncIntervalMS) => {
  sync(exchangeClients).then(() => { // initial sync
    setInterval(() => {
      sync(exchangeClients).catch((err) => { // eslint-disable-line
        debug('error: %s', err.stack)
      })
    }, syncIntervalMS)

    return null
  }).catch((err) => {
    debug('error: %s', err.stack)
  })
}
