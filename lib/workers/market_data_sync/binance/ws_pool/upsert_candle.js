'use strict';function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

const upsert = require('../../../../db/pg/upsert');
const dbRL = require('../../../../db/pg_rate_limited');
const tfToString = require('../../../../exchange_clients/binance/util/tf_to_string');

module.exports = async (symbol, tf, candle) => {
  return dbRL(db => {
    return upsert({
      db,
      path: `binance_candles_${tfToString(tf)}`,
      index: 'key',
      indexMatches: ['key'],
      doc: _objectSpread({
        symbol,
        key: `${symbol}-${candle.mts}` },
      candle) });


  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZXJzL21hcmtldF9kYXRhX3N5bmMvYmluYW5jZS93c19wb29sL3Vwc2VydF9jYW5kbGUuanMiXSwibmFtZXMiOlsidXBzZXJ0IiwicmVxdWlyZSIsImRiUkwiLCJ0ZlRvU3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsInN5bWJvbCIsInRmIiwiY2FuZGxlIiwiZGIiLCJwYXRoIiwiaW5kZXgiLCJpbmRleE1hdGNoZXMiLCJkb2MiLCJrZXkiLCJtdHMiXSwibWFwcGluZ3MiOiJBQUFBLGE7O0FBRUEsTUFBTUEsTUFBTSxHQUFHQyxPQUFPLENBQUMsMEJBQUQsQ0FBdEI7QUFDQSxNQUFNQyxJQUFJLEdBQUdELE9BQU8sQ0FBQyxnQ0FBRCxDQUFwQjtBQUNBLE1BQU1FLFVBQVUsR0FBR0YsT0FBTyxDQUFDLHdEQUFELENBQTFCOztBQUVBRyxNQUFNLENBQUNDLE9BQVAsR0FBaUIsT0FBT0MsTUFBUCxFQUFlQyxFQUFmLEVBQW1CQyxNQUFuQixLQUE4QjtBQUM3QyxTQUFPTixJQUFJLENBQUVPLEVBQUQsSUFBUTtBQUNsQixXQUFPVCxNQUFNLENBQUM7QUFDWlMsTUFBQUEsRUFEWTtBQUVaQyxNQUFBQSxJQUFJLEVBQUcsbUJBQWtCUCxVQUFVLENBQUNJLEVBQUQsQ0FBSyxFQUY1QjtBQUdaSSxNQUFBQSxLQUFLLEVBQUUsS0FISztBQUlaQyxNQUFBQSxZQUFZLEVBQUUsQ0FBQyxLQUFELENBSkY7QUFLWkMsTUFBQUEsR0FBRztBQUNEUCxRQUFBQSxNQURDO0FBRURRLFFBQUFBLEdBQUcsRUFBRyxHQUFFUixNQUFPLElBQUdFLE1BQU0sQ0FBQ08sR0FBSSxFQUY1QjtBQUdFUCxNQUFBQSxNQUhGLENBTFMsRUFBRCxDQUFiOzs7QUFXRCxHQVpVLENBQVg7QUFhRCxDQWREIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHVwc2VydCA9IHJlcXVpcmUoJy4uLy4uLy4uLy4uL2RiL3BnL3Vwc2VydCcpXG5jb25zdCBkYlJMID0gcmVxdWlyZSgnLi4vLi4vLi4vLi4vZGIvcGdfcmF0ZV9saW1pdGVkJylcbmNvbnN0IHRmVG9TdHJpbmcgPSByZXF1aXJlKCcuLi8uLi8uLi8uLi9leGNoYW5nZV9jbGllbnRzL2JpbmFuY2UvdXRpbC90Zl90b19zdHJpbmcnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIChzeW1ib2wsIHRmLCBjYW5kbGUpID0+IHtcbiAgcmV0dXJuIGRiUkwoKGRiKSA9PiB7XG4gICAgcmV0dXJuIHVwc2VydCh7XG4gICAgICBkYixcbiAgICAgIHBhdGg6IGBiaW5hbmNlX2NhbmRsZXNfJHt0ZlRvU3RyaW5nKHRmKX1gLFxuICAgICAgaW5kZXg6ICdrZXknLFxuICAgICAgaW5kZXhNYXRjaGVzOiBbJ2tleSddLFxuICAgICAgZG9jOiB7XG4gICAgICAgIHN5bWJvbCxcbiAgICAgICAga2V5OiBgJHtzeW1ib2x9LSR7Y2FuZGxlLm10c31gLFxuICAgICAgICAuLi5jYW5kbGVcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuIl19