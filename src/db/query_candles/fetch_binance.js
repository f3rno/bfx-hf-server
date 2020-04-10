'use strict'

const binanceTFToString = require('../../exchange_clients/binance/util/tf_to_string')
const fetch = require('./fetch')

/**
 * @param {object} args - args
 * @param {object} args.market - market
 * @param {string} args.tf - tf
 * @param {number} [args.start] - start
 * @param {number} [args.end] - end
 * @param {number} [args.limit] - limit
 * @param {string} [args.order] - order
 * @param {string} [args.orderBy] - key to order by
 * @returns {Promise} p
 */
module.exports = async ({
  market, tf, start, end, limit, order = 'asc', orderBy = 'mts'
}) => {
  return fetch({
    table: `binance_candles_${binanceTFToString(tf)}`,
    market,
    start,
    end,
    limit,
    order,
    orderBy
  })
}
