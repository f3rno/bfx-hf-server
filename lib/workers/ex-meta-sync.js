'use strict'

const debug = require('debug')('bfx:hf:server:db-exa-meta-sync')

const exchangeClients = require('../exchange_clients')
const sync = require('../sync_meta')

module.exports = (syncIntervalMS) => {
  sync(exchangeClients).then(() => { // initial sync
    return setInterval(() => {
      try {
        sync(exchangeClients)
      } catch (err) {
        debug('error: %s', err.stack)
      }
    }, syncIntervalMS)
  }).catch((err) => {
    debug('error: %s', err.stack)
  })
}
