'use strict'

const HFI = require('bfx-hf-indicators')
const _isFunction = require('lodash/isFunction')
const { define: defineStrategy } = require('bfx-hf-strategy')
const loadStrategySection = require('./load_strategy_section')

/**
 * @memberof module:bfx-hf-server
 * @private
 *
 * @param {object} params - strategy definition
 * @param {string} params.symbol - default symbol
 * @param {string} params.tf - default time frame
 * @param {string} params.exec - exec section src
 * @param {string} [params.defineMetaSrc] - defineMeta section src
 * @param {string} [params.defineIndicatorsSrc] - defineIndicators section src
 * @returns {module:bfx-hf-strategy.StrategyState} state
 */
const loadStrategy = (params) => {
  const {
    symbol, tf, defineMetaSrc = '', defineIndicatorsSrc = '', execSrc
  } = params

  const exec = loadStrategySection(execSrc, 'exec')
  const defineMeta = loadStrategySection(defineMetaSrc, 'defineMeta')
  const defineIndicators = loadStrategySection(
    defineIndicatorsSrc, 'defineIndicators'
  )

  return defineStrategy({
    ...(_isFunction(defineMeta) ? defineMeta() : {}),

    tf,
    symbol,
    exec,
    indicators: {
      ...(_isFunction(defineIndicators)
        ? defineIndicators(HFI)
        : {}
      )
    }
  })
}

module.exports = loadStrategy
