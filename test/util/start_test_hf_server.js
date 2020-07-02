'use strict'

const fs = require('fs')
const startHFServer = require('../../')

const PORT = 46000
const LOG_PATH = `${__dirname}/../logs`

const DB_PATH = `${__dirname}/../db`
const UI_DB_PATH = `${DB_PATH}/test-ui.json`
const ALGO_DB_PATH = `${DB_PATH}/test-algos.json`
const DS_BITFINEX_BB_PATH = `${DB_PATH}/test-hfdb-bfx.json`

const startTestHFServer = async (params = {}) => {
  const { clean = true } = params

  if (clean) {
    if (fs.existsSync(UI_DB_PATH)) fs.unlinkSync(UI_DB_PATH)
    if (fs.existsSync(ALGO_DB_PATH)) fs.unlinkSync(ALGO_DB_PATH)
    if (fs.existsSync(DS_BITFINEX_BB_PATH)) fs.unlinkSync(DS_BITFINEX_BB_PATH)
  }

  return startHFServer({
    wsServerPort: PORT,
    strategyLogDir: LOG_PATH,
    hfBitfinexDBPath: DS_BITFINEX_BB_PATH,
    algoDBPath: ALGO_DB_PATH,
    strategyDBDir: DB_PATH,
    uiDBPath: UI_DB_PATH
  })
}

module.exports = startTestHFServer
module.exports.LOG_PATH = LOG_PATH
module.exports.PORT = PORT

module.exports.DB_PATH = DB_PATH
module.exports.UI_DB_PATH = UI_DB_PATH
module.exports.ALGO_DB_PATH = ALGO_DB_PATH
module.exports.DS_BITFINEX_BB_PATH = DS_BITFINEX_BB_PATH
