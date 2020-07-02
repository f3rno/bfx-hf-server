'use strict'

const HFDB = require('bfx-hf-models')
const DataServer = require('bfx-hf-data-server')
const HFDBLowDBAdapter = require('bfx-hf-models-adapter-lowdb')
const { schema: HFDBBitfinexSchema } = require('bfx-hf-ext-plugin-bitfinex')
const { schema: HFDBBinanceSchema } = require('bfx-hf-ext-plugin-binance')
const { schema: HFDBDummySchema } = require('bfx-hf-ext-plugin-dummy')

const EXAS = require('./exchange_clients')
const AlgoServer = require('./ws_servers/algos')
const ExchangePoolServer = require('./ws_servers/ex_pool')
const APIWSServer = require('./ws_servers/api')
const syncMarkets = require('./sync_meta')

// TODO: rename wsServerPort -> apiServerPort
const startHFServer = async ({
  bfxRestURL,
  bfxWSURL,
  uiDBPath,
  algoDBPath,
  strategyDBDir,
  strategyLogDir,
  hfBitfinexDBPath,
  hfBinanceDBPath,
  wsServerPort = 45000,
  algoServerPort = 25223,
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
    hfDSBinanceURL: `http://localhost:${hfDSBinancePort}`,
    strategyLogDir,
    strategyDBDir
  })

  await syncMarkets(apiDB, EXAS)

  as.open()
  exPool.open()

  if (dsBinance) {
    dsBinance.open()
  }

  if (dsBitfinex) {
    dsBitfinex.open()
  }

  await api.open()

  return {
    wsServerPort,
    algoServerPort,
    exPoolServerPort,
    hfDSBinancePort,
    hfDSBitfinexPort,

    apiDB,
    dsBinanceDB: dbBinance,
    dsBitfinexDB: dbBitfinex,

    stop: () => {
      as.close()
      exPool.close()

      if (dsBinance) {
        dsBinance.close()
      }

      if (dsBitfinex) {
        dsBitfinex.close()
      }

      api.close()
    }
  }
}

module.exports = startHFServer
