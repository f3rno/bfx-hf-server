'use strict'

const _ = require('lodash') // eslint-disable-line
const HFU = require('bfx-hf-util')
const HFS = require('bfx-hf-strategy')

/**
 * @throws {Error} fails if given invalid source
 * @memberof module:bfx-hf-server
 * @private
 *
 * @param {string} src - source
 * @param {string} name - section name
 * @returns {Function} sectionHandler
 */
const loadStrategySection = (src, name) => {
  try {
    return name.substring(0, 6) === 'define'
      ? eval(src) // eslint-disable-line
      : eval(src)({ HFS, HFU, _ }) // eslint-disable-line
  } catch (e) {
    throw new Error(`Section syntax error: ${name} ${e.message}`)
  }
}

module.exports = loadStrategySection
