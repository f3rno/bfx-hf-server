'use strict';

const binanceTFToString = require('../../exchange_clients/binance/util/tf_to_string');
const fetch = require('./fetch');

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
  market, tf, start, end, limit, order = 'asc', orderBy = 'mts' }) =>
{
  return fetch({
    table: `binance_candles_${binanceTFToString(tf)}`,
    market,
    start,
    end,
    limit,
    order,
    orderBy });

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9xdWVyeV9jYW5kbGVzL2ZldGNoX2JpbmFuY2UuanMiXSwibmFtZXMiOlsiYmluYW5jZVRGVG9TdHJpbmciLCJyZXF1aXJlIiwiZmV0Y2giLCJtb2R1bGUiLCJleHBvcnRzIiwibWFya2V0IiwidGYiLCJzdGFydCIsImVuZCIsImxpbWl0Iiwib3JkZXIiLCJvcmRlckJ5IiwidGFibGUiXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU1BLGlCQUFpQixHQUFHQyxPQUFPLENBQUMsa0RBQUQsQ0FBakM7QUFDQSxNQUFNQyxLQUFLLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQXJCOztBQUVBOzs7Ozs7Ozs7OztBQVdBRSxNQUFNLENBQUNDLE9BQVAsR0FBaUIsT0FBTztBQUN0QkMsRUFBQUEsTUFEc0IsRUFDZEMsRUFEYyxFQUNWQyxLQURVLEVBQ0hDLEdBREcsRUFDRUMsS0FERixFQUNTQyxLQUFLLEdBQUcsS0FEakIsRUFDd0JDLE9BQU8sR0FBRyxLQURsQyxFQUFQO0FBRVg7QUFDSixTQUFPVCxLQUFLLENBQUM7QUFDWFUsSUFBQUEsS0FBSyxFQUFHLG1CQUFrQlosaUJBQWlCLENBQUNNLEVBQUQsQ0FBSyxFQURyQztBQUVYRCxJQUFBQSxNQUZXO0FBR1hFLElBQUFBLEtBSFc7QUFJWEMsSUFBQUEsR0FKVztBQUtYQyxJQUFBQSxLQUxXO0FBTVhDLElBQUFBLEtBTlc7QUFPWEMsSUFBQUEsT0FQVyxFQUFELENBQVo7O0FBU0QsQ0FaRCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBiaW5hbmNlVEZUb1N0cmluZyA9IHJlcXVpcmUoJy4uLy4uL2V4Y2hhbmdlX2NsaWVudHMvYmluYW5jZS91dGlsL3RmX3RvX3N0cmluZycpXG5jb25zdCBmZXRjaCA9IHJlcXVpcmUoJy4vZmV0Y2gnKVxuXG4vKipcbiAqIEBwYXJhbSB7b2JqZWN0fSBhcmdzIC0gYXJnc1xuICogQHBhcmFtIHtvYmplY3R9IGFyZ3MubWFya2V0IC0gbWFya2V0XG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy50ZiAtIHRmXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ3Muc3RhcnRdIC0gc3RhcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5lbmRdIC0gZW5kXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ3MubGltaXRdIC0gbGltaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5vcmRlcl0gLSBvcmRlclxuICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLm9yZGVyQnldIC0ga2V5IHRvIG9yZGVyIGJ5XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gcFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jICh7XG4gIG1hcmtldCwgdGYsIHN0YXJ0LCBlbmQsIGxpbWl0LCBvcmRlciA9ICdhc2MnLCBvcmRlckJ5ID0gJ210cydcbn0pID0+IHtcbiAgcmV0dXJuIGZldGNoKHtcbiAgICB0YWJsZTogYGJpbmFuY2VfY2FuZGxlc18ke2JpbmFuY2VURlRvU3RyaW5nKHRmKX1gLFxuICAgIG1hcmtldCxcbiAgICBzdGFydCxcbiAgICBlbmQsXG4gICAgbGltaXQsXG4gICAgb3JkZXIsXG4gICAgb3JkZXJCeVxuICB9KVxufVxuIl19