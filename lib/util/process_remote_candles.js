'use strict';

const _isFinite = require('lodash/isFinite');
const CANDLE_WIDTHS = require('./candle_time_frames');

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
  const candleSize = CANDLE_WIDTHS[tf];

  if (!_isFinite(candleSize)) {
    throw new Error(`invalid time frame: ${tf}`);
  }

  const consistentCandles = [];
  let c;

  for (let i = 0; i < candles.length; i += 1) {
    c = candles[i];
    consistentCandles.push(c);

    if (i === candles.length - 1) break;

    if (transformed) {
      // @ts-ignore
      if (candles[i + 1].mts - c.mts === candleSize) continue;
    } else {
      if (candles[i + 1][0] - c[0] === candleSize) continue;
    }

    // Fill in candles with 0 vol
    // @ts-ignore
    let next = transformed ? c.mts + candleSize : c[0] + candleSize;

    if (transformed) {
      const candle = /** @type {Candle} */c;

      // @ts-ignore
      while (next < candles[i + 1].mts) {
        consistentCandles.push({
          mts: next,
          open: candle.close,
          high: candle.close,
          low: candle.close,
          close: candle.close,
          volume: 0 });


        next += candleSize;
      }
    } else {
      while (next < candles[i + 1][0]) {
        consistentCandles.push([next, c[2], c[2], c[2], c[2], 0]);
        next += candleSize;
      }
    }
  }

  // @ts-ignore
  return consistentCandles;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3Byb2Nlc3NfcmVtb3RlX2NhbmRsZXMuanMiXSwibmFtZXMiOlsiX2lzRmluaXRlIiwicmVxdWlyZSIsIkNBTkRMRV9XSURUSFMiLCJtb2R1bGUiLCJleHBvcnRzIiwidGYiLCJjYW5kbGVzIiwidHJhbnNmb3JtZWQiLCJjYW5kbGVTaXplIiwiRXJyb3IiLCJjb25zaXN0ZW50Q2FuZGxlcyIsImMiLCJpIiwibGVuZ3RoIiwicHVzaCIsIm10cyIsIm5leHQiLCJjYW5kbGUiLCJvcGVuIiwiY2xvc2UiLCJoaWdoIiwibG93Iiwidm9sdW1lIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxpQkFBRCxDQUF6QjtBQUNBLE1BQU1DLGFBQWEsR0FBR0QsT0FBTyxDQUFDLHNCQUFELENBQTdCOztBQUVBOztBQUVBOzs7Ozs7Ozs7Ozs7O0FBYUFFLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixDQUFDQyxFQUFELEVBQUtDLE9BQU8sR0FBRyxFQUFmLEVBQW1CQyxXQUFuQixLQUFtQztBQUNsRCxRQUFNQyxVQUFVLEdBQUdOLGFBQWEsQ0FBQ0csRUFBRCxDQUFoQzs7QUFFQSxNQUFJLENBQUNMLFNBQVMsQ0FBQ1EsVUFBRCxDQUFkLEVBQTRCO0FBQzFCLFVBQU0sSUFBSUMsS0FBSixDQUFXLHVCQUFzQkosRUFBRyxFQUFwQyxDQUFOO0FBQ0Q7O0FBRUQsUUFBTUssaUJBQWlCLEdBQUcsRUFBMUI7QUFDQSxNQUFJQyxDQUFKOztBQUVBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR04sT0FBTyxDQUFDTyxNQUE1QixFQUFvQ0QsQ0FBQyxJQUFJLENBQXpDLEVBQTRDO0FBQzFDRCxJQUFBQSxDQUFDLEdBQUdMLE9BQU8sQ0FBQ00sQ0FBRCxDQUFYO0FBQ0FGLElBQUFBLGlCQUFpQixDQUFDSSxJQUFsQixDQUF1QkgsQ0FBdkI7O0FBRUEsUUFBSUMsQ0FBQyxLQUFLTixPQUFPLENBQUNPLE1BQVIsR0FBaUIsQ0FBM0IsRUFBOEI7O0FBRTlCLFFBQUlOLFdBQUosRUFBaUI7QUFDZjtBQUNBLFVBQUtELE9BQU8sQ0FBQ00sQ0FBQyxHQUFHLENBQUwsQ0FBUCxDQUFlRyxHQUFmLEdBQXFCSixDQUFDLENBQUNJLEdBQXhCLEtBQWlDUCxVQUFyQyxFQUFpRDtBQUNsRCxLQUhELE1BR087QUFDTCxVQUFLRixPQUFPLENBQUNNLENBQUMsR0FBRyxDQUFMLENBQVAsQ0FBZSxDQUFmLElBQW9CRCxDQUFDLENBQUMsQ0FBRCxDQUF0QixLQUErQkgsVUFBbkMsRUFBK0M7QUFDaEQ7O0FBRUQ7QUFDQTtBQUNBLFFBQUlRLElBQUksR0FBR1QsV0FBVyxHQUFHSSxDQUFDLENBQUNJLEdBQUYsR0FBUVAsVUFBWCxHQUF3QkcsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPSCxVQUFyRDs7QUFFQSxRQUFJRCxXQUFKLEVBQWlCO0FBQ2YsWUFBTVUsTUFBTSxHQUFHLHFCQUF1Qk4sQ0FBdEM7O0FBRUE7QUFDQSxhQUFPSyxJQUFJLEdBQUdWLE9BQU8sQ0FBQ00sQ0FBQyxHQUFHLENBQUwsQ0FBUCxDQUFlRyxHQUE3QixFQUFrQztBQUNoQ0wsUUFBQUEsaUJBQWlCLENBQUNJLElBQWxCLENBQXVCO0FBQ3JCQyxVQUFBQSxHQUFHLEVBQUVDLElBRGdCO0FBRXJCRSxVQUFBQSxJQUFJLEVBQUVELE1BQU0sQ0FBQ0UsS0FGUTtBQUdyQkMsVUFBQUEsSUFBSSxFQUFFSCxNQUFNLENBQUNFLEtBSFE7QUFJckJFLFVBQUFBLEdBQUcsRUFBRUosTUFBTSxDQUFDRSxLQUpTO0FBS3JCQSxVQUFBQSxLQUFLLEVBQUVGLE1BQU0sQ0FBQ0UsS0FMTztBQU1yQkcsVUFBQUEsTUFBTSxFQUFFLENBTmEsRUFBdkI7OztBQVNBTixRQUFBQSxJQUFJLElBQUlSLFVBQVI7QUFDRDtBQUNGLEtBaEJELE1BZ0JPO0FBQ0wsYUFBT1EsSUFBSSxHQUFHVixPQUFPLENBQUNNLENBQUMsR0FBRyxDQUFMLENBQVAsQ0FBZSxDQUFmLENBQWQsRUFBaUM7QUFDL0JGLFFBQUFBLGlCQUFpQixDQUFDSSxJQUFsQixDQUF1QixDQUFDRSxJQUFELEVBQU9MLENBQUMsQ0FBQyxDQUFELENBQVIsRUFBYUEsQ0FBQyxDQUFDLENBQUQsQ0FBZCxFQUFtQkEsQ0FBQyxDQUFDLENBQUQsQ0FBcEIsRUFBeUJBLENBQUMsQ0FBQyxDQUFELENBQTFCLEVBQStCLENBQS9CLENBQXZCO0FBQ0FLLFFBQUFBLElBQUksSUFBSVIsVUFBUjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRDtBQUNBLFNBQU9FLGlCQUFQO0FBQ0QsQ0FyREQiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuY29uc3QgX2lzRmluaXRlID0gcmVxdWlyZSgnbG9kYXNoL2lzRmluaXRlJylcbmNvbnN0IENBTkRMRV9XSURUSFMgPSByZXF1aXJlKCcuL2NhbmRsZV90aW1lX2ZyYW1lcycpXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdiZngtYXBpLW5vZGUtbW9kZWxzJykuQ2FuZGxlfSBDYW5kbGUgKi9cblxuLyoqXG4gKiBGaWxscyBpbiBnYXBzIGluIGNhbmRsZSBkYXRhIGFzIHJldHVybmVkIGJ5IGJmeDsgY2FuZGxlcyB3aXRoIG5vXG4gKiB0cmFkZXMgYXJlIG5vdCByZXR1cm5lZCBieSB0aGUgQVBJLlxuICpcbiAqIEdlbmVyYXRlZCBkdW1teSBjYW5kbGVzIGhhdmUgT0hMQyBzZXQgdG8gcHJldmlvdXMgY29sLCB2b2wgMFxuICpcbiAqIE5PVEU6IFJlc3VsdCBzaXplIG1heSBleGNlZWQgdGhlIGZldGNoIGxpbWl0XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRmIC0gY2FuZGxlIHRpbWVmcmFtZVxuICogQHBhcmFtIHtBcnJheVtdfENhbmRsZVtdfSBjYW5kbGVzIC0gYXJyYXkgb2Ygd3MyL3Jlc3QyIGZvcm1hdCBjYW5kbGUgZGF0YVxuICogQHBhcmFtIHtib29sZWFufSB0cmFuc2Zvcm1lZCAtIGluZGljYXRlcyBpZiB0aGUgZGF0YXNldCBpcyB0cmFuc2Zvcm1lZFxuICogQHJldHVybnMge0FycmF5W118Q2FuZGxlW119IGNvbnNpc3RlbnRDYW5kbGVzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gKHRmLCBjYW5kbGVzID0gW10sIHRyYW5zZm9ybWVkKSA9PiB7XG4gIGNvbnN0IGNhbmRsZVNpemUgPSBDQU5ETEVfV0lEVEhTW3RmXVxuXG4gIGlmICghX2lzRmluaXRlKGNhbmRsZVNpemUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIHRpbWUgZnJhbWU6ICR7dGZ9YClcbiAgfVxuXG4gIGNvbnN0IGNvbnNpc3RlbnRDYW5kbGVzID0gW11cbiAgbGV0IGNcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNhbmRsZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjID0gY2FuZGxlc1tpXVxuICAgIGNvbnNpc3RlbnRDYW5kbGVzLnB1c2goYylcblxuICAgIGlmIChpID09PSBjYW5kbGVzLmxlbmd0aCAtIDEpIGJyZWFrXG5cbiAgICBpZiAodHJhbnNmb3JtZWQpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGlmICgoY2FuZGxlc1tpICsgMV0ubXRzIC0gYy5tdHMpID09PSBjYW5kbGVTaXplKSBjb250aW51ZVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoKGNhbmRsZXNbaSArIDFdWzBdIC0gY1swXSkgPT09IGNhbmRsZVNpemUpIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgLy8gRmlsbCBpbiBjYW5kbGVzIHdpdGggMCB2b2xcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgbGV0IG5leHQgPSB0cmFuc2Zvcm1lZCA/IGMubXRzICsgY2FuZGxlU2l6ZSA6IGNbMF0gKyBjYW5kbGVTaXplXG5cbiAgICBpZiAodHJhbnNmb3JtZWQpIHtcbiAgICAgIGNvbnN0IGNhbmRsZSA9IC8qKiBAdHlwZSB7Q2FuZGxlfSAqLyAoYylcblxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgd2hpbGUgKG5leHQgPCBjYW5kbGVzW2kgKyAxXS5tdHMpIHtcbiAgICAgICAgY29uc2lzdGVudENhbmRsZXMucHVzaCh7XG4gICAgICAgICAgbXRzOiBuZXh0LFxuICAgICAgICAgIG9wZW46IGNhbmRsZS5jbG9zZSxcbiAgICAgICAgICBoaWdoOiBjYW5kbGUuY2xvc2UsXG4gICAgICAgICAgbG93OiBjYW5kbGUuY2xvc2UsXG4gICAgICAgICAgY2xvc2U6IGNhbmRsZS5jbG9zZSxcbiAgICAgICAgICB2b2x1bWU6IDBcbiAgICAgICAgfSlcblxuICAgICAgICBuZXh0ICs9IGNhbmRsZVNpemVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKG5leHQgPCBjYW5kbGVzW2kgKyAxXVswXSkge1xuICAgICAgICBjb25zaXN0ZW50Q2FuZGxlcy5wdXNoKFtuZXh0LCBjWzJdLCBjWzJdLCBjWzJdLCBjWzJdLCAwXSlcbiAgICAgICAgbmV4dCArPSBjYW5kbGVTaXplXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQHRzLWlnbm9yZVxuICByZXR1cm4gY29uc2lzdGVudENhbmRsZXNcbn1cbiJdfQ==