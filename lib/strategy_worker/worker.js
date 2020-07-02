'use strict'

const _isEmpty = require('lodash/isEmpty')
const _isFinite = require('lodash/isFinite')
const StrategyWorkerWSServer = require('../ws_servers/strategy_worker')

const [,, API_PORT, EXEC_ID, STATE_JSON] = process.argv

if (!_isFinite(API_PORT) || API_PORT < 1024) {
  throw new Error(`Given invalid API port: ${API_PORT}`)
} else if (_isEmpty(EXEC_ID)) {
  throw new Error('Execution ID required')
}

let initialState = {}

if (!_isEmpty(STATE_JSON)) {
  try {
    initialState = JSON.parse(STATE_JSON)
  } catch (e) {
    throw new Error('Given malformed state JSON')
  }
}

const s = new StrategyWorkerWSServer({
  port: API_PORT,
  execID: EXEC_ID,
  initialState
})

s.open()
