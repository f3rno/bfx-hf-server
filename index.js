'use strict'

require('bfx-hf-util/lib/catch_uncaught_errors')

const HFDB = require('bfx-hf-models')
const DataServer = require('bfx-hf-data-server')
const HFDBLowDBAdapter = require('bfx-hf-models-adapter-lowdb')
const { schema: HFDBBitfinexSchema } = require('bfx-hf-ext-plugin-bitfinex')
const { schema: HFDBBinanceSchema } = require('bfx-hf-ext-plugin-binance')
const { schema: HFDBDummySchema } = require('bfx-hf-ext-plugin-dummy')

const EXAS = require('./lib/exchange_clients')
const AlgoServer = require('./lib/ws_servers/algos')
const ExchangePoolServer = require('./lib/ws_servers/ex_pool')
const APIWSServer = require('./lib/ws_servers/api')
const syncMarkets = require('./lib/sync_meta')
const capture = require('./lib/capture')

module.exports = ({
  bfxRestURL,
  bfxWSURL,
  uiDBPath,
  algoDBPath,
  hfBitfinexDBPath,
  hfBinanceDBPath,
  algoServerPort = 25223,
  wsServerPort = 45000,
  exPoolServerPort = 25224,
  hfDSBinancePort = 23522,
  hfDSBitfinexPort = 23521
}) => {
  let dbBitfinex = null
  let dbBinance = null

  if (hfBitfinexDBPath && hfDSBitfinexPort) {
    dbBitfinex = new HFDB({
      schema: HFDBBitfinexSchema,
      adapter: HFDBLowDBAdapter({ dbPath: hfBitfinexDBPath })
    })
  }

  if (hfBinanceDBPath && hfDSBinancePort) {
    dbBinance = new HFDB({
      schema: HFDBBinanceSchema,
      adapter: HFDBLowDBAdapter({ dbPath: hfBinanceDBPath })
    })
  }

  const apiDB = new HFDB({
    schema: HFDBDummySchema,
    adapter: HFDBLowDBAdapter({ dbPath: uiDBPath })
  })

  const as = new AlgoServer({
    port: algoServerPort,
    hfLowDBPath: algoDBPath,
    apiDB
  })

  let dsBitfinex = null
  let dsBinance = null

  if (dbBitfinex) {
    dsBitfinex = new DataServer({
      port: hfDSBitfinexPort,
      db: dbBitfinex,
      restURL: bfxRestURL,
      wsURL: bfxWSURL
    })
  }

  if (dbBinance) {
    dsBinance = new DataServer({
      port: hfDSBinancePort,
      db: dbBinance
    })
  }

  const exPool = new ExchangePoolServer({
    port: exPoolServerPort
  })

  const api = new APIWSServer({
    db: apiDB,
    port: wsServerPort,
    exPoolURL: `http://localhost:${exPoolServerPort}`,
    algoServerURL: `http://localhost:${algoServerPort}`,
    hfDSBitfinexURL: `http://localhost:${hfDSBitfinexPort}`,
    hfDSBinanceURL: `http://localhost:${hfDSBinancePort}`
  })

  syncMarkets(apiDB, EXAS).then(() => {
    as.open()
    exPool.open()

    if (dsBinance) {
      dsBinance.open()
    }

    if (dsBitfinex) {
      dsBitfinex.open()
    }

    api.open()
  }).catch((e) => {
    capture.exception(e)
  })
}
