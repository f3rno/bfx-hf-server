'use strict'

const _isFinite = require('lodash/isFinite')
const CANDLE_WIDTHS = require('./candle_time_frames')

/** @typedef {import('bfx-api-node-models').Candle} Candle */

/**
 * Fills in gaps in candle data as returned by bfx; candles with no
 * trades are not returned by the API.
 *
 * Generated dummy candles have OHLC set to previous col, vol 0
 *
 * NOTE: Result size may exceed the fetch limit
 *
 * @param {string} tf - candle timeframe
 * @param {Array[]|Candle[]} candles - array of ws2/rest2 format candle data
 * @param {boolean} transformed - indicates if the dataset is transformed
 * @returns {Array[]|Candle[]} consistentCandles
 */
module.exports = (tf, candles = [], transformed) => {
  const candleSize = CANDLE_WIDTHS[tf]

  if (!_isFinite(candleSize)) {
    throw new Error(`invalid time frame: ${tf}`)
  }

  const consistentCandles = []
  let c

  for (let i = 0; i < candles.length; i += 1) {
    c = candles[i]
    consistentCandles.push(c)

    if (i === candles.length - 1) break

    if (transformed) {
      // @ts-ignore
      if ((candles[i + 1].mts - c.mts) === candleSize) continue
    } else {
      if ((candles[i + 1][0] - c[0]) === candleSize) continue
    }

    // Fill in candles with 0 vol
    // @ts-ignore
    let next = transformed ? c.mts + candleSize : c[0] + candleSize

    if (transformed) {
      const candle = /** @type {Candle} */ (c)

      // @ts-ignore
      while (next < candles[i + 1].mts) {
        consistentCandles.push({
          mts: next,
          open: candle.close,
          high: candle.close,
          low: candle.close,
          close: candle.close,
          volume: 0
        })

        next += candleSize
      }
    } else {
      while (next < candles[i + 1][0]) {
        consistentCandles.push([next, c[2], c[2], c[2], c[2], 0])
        next += candleSize
      }
    }
  }

  // @ts-ignore
  return consistentCandles
}
