const createExecModel = (db, params = {}) => {
  const { StrategyExecution } = db
  const {
    tf, symbol, strategyID, state = {}, events = [], endedMTS = 0,
    startedMTS = Date.now(), active = true
  } = params

  return StrategyExecution.create({
    startedMTS, active, endedMTS, events, state, strategyID, symbol, tf
  })
}

module.exports = createExecModel
