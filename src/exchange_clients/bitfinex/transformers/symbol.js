'use strict'

const _includes = require('lodash/includes')

/**
 * @param {string[][]} symbolsByContext - [exchangeSymbols, marginSymbols]
 * @param {string} sym - symbol to generate market object for
 * @returns {object} - market
 */
module.exports = (symbolsByContext, sym) => {
  const c = []

  if (_includes(symbolsByContext[0], sym)) {
    c.push('e')
  }

  if (_includes(symbolsByContext[1], sym)) {
    c.push('m')
  }

  if (_includes(symbolsByContext[2], sym)) {
    c.push('f')
  }

  const b = sym.match(/:/) ? sym.split(':')[0] : sym.substring(0, 3)
  const q = sym.match(/:/) ? sym.split(':')[1] : sym.substring(3)

  return {
    c,
    b,
    q,
    u: `${b}/${q}`,
    r: `t${sym}`,
    w: `t${sym}`
  }
}
