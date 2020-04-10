'use strict';

const bfxTFToString = require('../../exchange_clients/bitfinex/util/tf_to_string');
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
    table: `bitfinex_candles_${bfxTFToString(tf)}`,
    market,
    start,
    end,
    limit,
    order,
    orderBy });

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9xdWVyeV9jYW5kbGVzL2ZldGNoX2JpdGZpbmV4LmpzIl0sIm5hbWVzIjpbImJmeFRGVG9TdHJpbmciLCJyZXF1aXJlIiwiZmV0Y2giLCJtb2R1bGUiLCJleHBvcnRzIiwibWFya2V0IiwidGYiLCJzdGFydCIsImVuZCIsImxpbWl0Iiwib3JkZXIiLCJvcmRlckJ5IiwidGFibGUiXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU1BLGFBQWEsR0FBR0MsT0FBTyxDQUFDLG1EQUFELENBQTdCO0FBQ0EsTUFBTUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUFyQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQUUsTUFBTSxDQUFDQyxPQUFQLEdBQWlCLE9BQU87QUFDdEJDLEVBQUFBLE1BRHNCLEVBQ2RDLEVBRGMsRUFDVkMsS0FEVSxFQUNIQyxHQURHLEVBQ0VDLEtBREYsRUFDU0MsS0FBSyxHQUFHLEtBRGpCLEVBQ3dCQyxPQUFPLEdBQUcsS0FEbEMsRUFBUDtBQUVYO0FBQ0osU0FBT1QsS0FBSyxDQUFDO0FBQ1hVLElBQUFBLEtBQUssRUFBRyxvQkFBbUJaLGFBQWEsQ0FBQ00sRUFBRCxDQUFLLEVBRGxDO0FBRVhELElBQUFBLE1BRlc7QUFHWEUsSUFBQUEsS0FIVztBQUlYQyxJQUFBQSxHQUpXO0FBS1hDLElBQUFBLEtBTFc7QUFNWEMsSUFBQUEsS0FOVztBQU9YQyxJQUFBQSxPQVBXLEVBQUQsQ0FBWjs7QUFTRCxDQVpEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGJmeFRGVG9TdHJpbmcgPSByZXF1aXJlKCcuLi8uLi9leGNoYW5nZV9jbGllbnRzL2JpdGZpbmV4L3V0aWwvdGZfdG9fc3RyaW5nJylcbmNvbnN0IGZldGNoID0gcmVxdWlyZSgnLi9mZXRjaCcpXG5cbi8qKlxuICogQHBhcmFtIHtvYmplY3R9IGFyZ3MgLSBhcmdzXG4gKiBAcGFyYW0ge29iamVjdH0gYXJncy5tYXJrZXQgLSBtYXJrZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzLnRmIC0gdGZcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5zdGFydF0gLSBzdGFydFxuICogQHBhcmFtIHtudW1iZXJ9IFthcmdzLmVuZF0gLSBlbmRcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5saW1pdF0gLSBsaW1pdFxuICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLm9yZGVyXSAtIG9yZGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3Mub3JkZXJCeV0gLSBrZXkgdG8gb3JkZXIgYnlcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBwXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgKHtcbiAgbWFya2V0LCB0Ziwgc3RhcnQsIGVuZCwgbGltaXQsIG9yZGVyID0gJ2FzYycsIG9yZGVyQnkgPSAnbXRzJ1xufSkgPT4ge1xuICByZXR1cm4gZmV0Y2goe1xuICAgIHRhYmxlOiBgYml0ZmluZXhfY2FuZGxlc18ke2JmeFRGVG9TdHJpbmcodGYpfWAsXG4gICAgbWFya2V0LFxuICAgIHN0YXJ0LFxuICAgIGVuZCxcbiAgICBsaW1pdCxcbiAgICBvcmRlcixcbiAgICBvcmRlckJ5XG4gIH0pXG59XG4iXX0=