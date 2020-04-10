'use strict';

const _isFunction = require('lodash/isFunction');
const { AOHost } = require('bfx-hf-algo');
const AOServer = require('bfx-hf-algo-server');

const {
  PingPong, Iceberg, TWAP, AccumulateDistribute, MACrossover, OCOCO } =
require('bfx-hf-algo');

const algoOrders = [
PingPong, Iceberg, TWAP, AccumulateDistribute, MACrossover, OCOCO];


/**
                                                                     * @param {object} args - arguments
                                                                     * @param {object} args.adapter - AO adapter
                                                                     * @param {object} args.db - bfx-hf-models db instance
                                                                     * @param {Function} [args.initCB] - called before exchange connection is
                                                                     *   opened
                                                                     * @returns {Promise} p - resolves to algo host
                                                                     */
module.exports = async ({ adapter, db, initCB }) => {
  const host = new AOHost({
    db,
    adapter,
    aos: algoOrders });


  // For communication with the official BFX UI
  const server = new AOServer({
    db,
    adapter,
    aos: algoOrders });


  server.setAlgoHost(host);

  if (_isFunction(initCB)) {
    await initCB(host);
  }

  host.connect();

  return host;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2luaXRfYW9faG9zdC5qcyJdLCJuYW1lcyI6WyJfaXNGdW5jdGlvbiIsInJlcXVpcmUiLCJBT0hvc3QiLCJBT1NlcnZlciIsIlBpbmdQb25nIiwiSWNlYmVyZyIsIlRXQVAiLCJBY2N1bXVsYXRlRGlzdHJpYnV0ZSIsIk1BQ3Jvc3NvdmVyIiwiT0NPQ08iLCJhbGdvT3JkZXJzIiwibW9kdWxlIiwiZXhwb3J0cyIsImFkYXB0ZXIiLCJkYiIsImluaXRDQiIsImhvc3QiLCJhb3MiLCJzZXJ2ZXIiLCJzZXRBbGdvSG9zdCIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU1BLFdBQVcsR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQTNCO0FBQ0EsTUFBTSxFQUFFQyxNQUFGLEtBQWFELE9BQU8sQ0FBQyxhQUFELENBQTFCO0FBQ0EsTUFBTUUsUUFBUSxHQUFHRixPQUFPLENBQUMsb0JBQUQsQ0FBeEI7O0FBRUEsTUFBTTtBQUNKRyxFQUFBQSxRQURJLEVBQ01DLE9BRE4sRUFDZUMsSUFEZixFQUNxQkMsb0JBRHJCLEVBQzJDQyxXQUQzQyxFQUN3REMsS0FEeEQ7QUFFRlIsT0FBTyxDQUFDLGFBQUQsQ0FGWDs7QUFJQSxNQUFNUyxVQUFVLEdBQUc7QUFDakJOLFFBRGlCLEVBQ1BDLE9BRE8sRUFDRUMsSUFERixFQUNRQyxvQkFEUixFQUM4QkMsV0FEOUIsRUFDMkNDLEtBRDNDLENBQW5COzs7QUFJQTs7Ozs7Ozs7QUFRQUUsTUFBTSxDQUFDQyxPQUFQLEdBQWlCLE9BQU8sRUFBRUMsT0FBRixFQUFXQyxFQUFYLEVBQWVDLE1BQWYsRUFBUCxLQUFtQztBQUNsRCxRQUFNQyxJQUFJLEdBQUcsSUFBSWQsTUFBSixDQUFXO0FBQ3RCWSxJQUFBQSxFQURzQjtBQUV0QkQsSUFBQUEsT0FGc0I7QUFHdEJJLElBQUFBLEdBQUcsRUFBRVAsVUFIaUIsRUFBWCxDQUFiOzs7QUFNQTtBQUNBLFFBQU1RLE1BQU0sR0FBRyxJQUFJZixRQUFKLENBQWE7QUFDMUJXLElBQUFBLEVBRDBCO0FBRTFCRCxJQUFBQSxPQUYwQjtBQUcxQkksSUFBQUEsR0FBRyxFQUFFUCxVQUhxQixFQUFiLENBQWY7OztBQU1BUSxFQUFBQSxNQUFNLENBQUNDLFdBQVAsQ0FBbUJILElBQW5COztBQUVBLE1BQUloQixXQUFXLENBQUNlLE1BQUQsQ0FBZixFQUF5QjtBQUN2QixVQUFNQSxNQUFNLENBQUNDLElBQUQsQ0FBWjtBQUNEOztBQUVEQSxFQUFBQSxJQUFJLENBQUNJLE9BQUw7O0FBRUEsU0FBT0osSUFBUDtBQUNELENBdkJEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IF9pc0Z1bmN0aW9uID0gcmVxdWlyZSgnbG9kYXNoL2lzRnVuY3Rpb24nKVxuY29uc3QgeyBBT0hvc3QgfSA9IHJlcXVpcmUoJ2JmeC1oZi1hbGdvJylcbmNvbnN0IEFPU2VydmVyID0gcmVxdWlyZSgnYmZ4LWhmLWFsZ28tc2VydmVyJylcblxuY29uc3Qge1xuICBQaW5nUG9uZywgSWNlYmVyZywgVFdBUCwgQWNjdW11bGF0ZURpc3RyaWJ1dGUsIE1BQ3Jvc3NvdmVyLCBPQ09DT1xufSA9IHJlcXVpcmUoJ2JmeC1oZi1hbGdvJylcblxuY29uc3QgYWxnb09yZGVycyA9IFtcbiAgUGluZ1BvbmcsIEljZWJlcmcsIFRXQVAsIEFjY3VtdWxhdGVEaXN0cmlidXRlLCBNQUNyb3Nzb3ZlciwgT0NPQ09cbl1cblxuLyoqXG4gKiBAcGFyYW0ge29iamVjdH0gYXJncyAtIGFyZ3VtZW50c1xuICogQHBhcmFtIHtvYmplY3R9IGFyZ3MuYWRhcHRlciAtIEFPIGFkYXB0ZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBhcmdzLmRiIC0gYmZ4LWhmLW1vZGVscyBkYiBpbnN0YW5jZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2FyZ3MuaW5pdENCXSAtIGNhbGxlZCBiZWZvcmUgZXhjaGFuZ2UgY29ubmVjdGlvbiBpc1xuICogICBvcGVuZWRcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBwIC0gcmVzb2x2ZXMgdG8gYWxnbyBob3N0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgKHsgYWRhcHRlciwgZGIsIGluaXRDQiB9KSA9PiB7XG4gIGNvbnN0IGhvc3QgPSBuZXcgQU9Ib3N0KHtcbiAgICBkYixcbiAgICBhZGFwdGVyLFxuICAgIGFvczogYWxnb09yZGVyc1xuICB9KVxuXG4gIC8vIEZvciBjb21tdW5pY2F0aW9uIHdpdGggdGhlIG9mZmljaWFsIEJGWCBVSVxuICBjb25zdCBzZXJ2ZXIgPSBuZXcgQU9TZXJ2ZXIoe1xuICAgIGRiLFxuICAgIGFkYXB0ZXIsXG4gICAgYW9zOiBhbGdvT3JkZXJzXG4gIH0pXG5cbiAgc2VydmVyLnNldEFsZ29Ib3N0KGhvc3QpXG5cbiAgaWYgKF9pc0Z1bmN0aW9uKGluaXRDQikpIHtcbiAgICBhd2FpdCBpbml0Q0IoaG9zdClcbiAgfVxuXG4gIGhvc3QuY29ubmVjdCgpXG5cbiAgcmV0dXJuIGhvc3Rcbn1cbiJdfQ==