'use strict'

/**
 * @memberof module:bfx-hf-server
 * @private
 *
 * @param {string} strategyID - strategy ID
 * @returns {string} stateFN
 */
const getStateFN = strategyID => `${process.pid}-${strategyID}.json`

module.exports = getStateFN
