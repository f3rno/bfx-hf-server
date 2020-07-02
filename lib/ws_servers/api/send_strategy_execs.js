'use strict'

const send = require('../../util/ws/send')
const { notifyInternalError } = require('../../util/ws/notify')
const capture = require('../../capture')

module.exports = async (ws, db) => {
  if (!ws.authPassword) {
    return
  }

  const { StrategyExecution } = db

  try {
    const execs = await StrategyExecution.getAll()

    send(ws, ['data.strategy.execs', execs])
  } catch (e) {
    capture.exception(e)
    notifyInternalError(ws)
  }
}
