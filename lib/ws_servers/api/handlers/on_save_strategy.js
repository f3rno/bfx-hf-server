'use strict';function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

const uuid = require('uuid/v4');
const send = require('../../../util/ws/send');
const sendError = require('../../../util/ws/send_error');
const { notifyInternalError } = require('../../../util/ws/notify');
const validateParams = require('../../../util/ws/validate_params');
const isAuthorized = require('../../../util/ws/is_authorized');
const encryptStrategy = require('../../../util/encrypt_strategy');
const capture = require('../../../capture');

module.exports = async (server, ws, msg) => {
  const { d, db } = server;
  const [, authToken, strategy] = msg;
  const validRequest = validateParams(ws, {
    authToken: { type: 'string', v: authToken },
    strategy: { type: 'object', v: strategy } });


  if (!validRequest) {
    return;
  }

  if (!isAuthorized(ws, authToken)) {
    return sendError(ws, 'Unauthorized');
  }

  const { Strategy } = db;
  const id = uuid();
  let encryptedStrategy;

  console.log(id);

  try {
    encryptedStrategy = await encryptStrategy(_objectSpread({ id }, strategy), ws.authPassword);
  } catch (e) {
    capture.exception(e);
    notifyInternalError(ws);
    return;
  }

  await Strategy.set(encryptedStrategy);

  send(ws, ['data.strategy', id, _objectSpread({ id }, strategy)]);
  d('saved strategy %s', id);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy93c19zZXJ2ZXJzL2FwaS9oYW5kbGVycy9vbl9zYXZlX3N0cmF0ZWd5LmpzIl0sIm5hbWVzIjpbInV1aWQiLCJyZXF1aXJlIiwic2VuZCIsInNlbmRFcnJvciIsIm5vdGlmeUludGVybmFsRXJyb3IiLCJ2YWxpZGF0ZVBhcmFtcyIsImlzQXV0aG9yaXplZCIsImVuY3J5cHRTdHJhdGVneSIsImNhcHR1cmUiLCJtb2R1bGUiLCJleHBvcnRzIiwic2VydmVyIiwid3MiLCJtc2ciLCJkIiwiZGIiLCJhdXRoVG9rZW4iLCJzdHJhdGVneSIsInZhbGlkUmVxdWVzdCIsInR5cGUiLCJ2IiwiU3RyYXRlZ3kiLCJpZCIsImVuY3J5cHRlZFN0cmF0ZWd5IiwiY29uc29sZSIsImxvZyIsImF1dGhQYXNzd29yZCIsImUiLCJleGNlcHRpb24iLCJzZXQiXSwibWFwcGluZ3MiOiJBQUFBLGE7O0FBRUEsTUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUFwQjtBQUNBLE1BQU1DLElBQUksR0FBR0QsT0FBTyxDQUFDLHVCQUFELENBQXBCO0FBQ0EsTUFBTUUsU0FBUyxHQUFHRixPQUFPLENBQUMsNkJBQUQsQ0FBekI7QUFDQSxNQUFNLEVBQUVHLG1CQUFGLEtBQTBCSCxPQUFPLENBQUMseUJBQUQsQ0FBdkM7QUFDQSxNQUFNSSxjQUFjLEdBQUdKLE9BQU8sQ0FBQyxrQ0FBRCxDQUE5QjtBQUNBLE1BQU1LLFlBQVksR0FBR0wsT0FBTyxDQUFDLGdDQUFELENBQTVCO0FBQ0EsTUFBTU0sZUFBZSxHQUFHTixPQUFPLENBQUMsZ0NBQUQsQ0FBL0I7QUFDQSxNQUFNTyxPQUFPLEdBQUdQLE9BQU8sQ0FBQyxrQkFBRCxDQUF2Qjs7QUFFQVEsTUFBTSxDQUFDQyxPQUFQLEdBQWlCLE9BQU9DLE1BQVAsRUFBZUMsRUFBZixFQUFtQkMsR0FBbkIsS0FBMkI7QUFDMUMsUUFBTSxFQUFFQyxDQUFGLEVBQUtDLEVBQUwsS0FBWUosTUFBbEI7QUFDQSxRQUFNLEdBQUdLLFNBQUgsRUFBY0MsUUFBZCxJQUEwQkosR0FBaEM7QUFDQSxRQUFNSyxZQUFZLEdBQUdiLGNBQWMsQ0FBQ08sRUFBRCxFQUFLO0FBQ3RDSSxJQUFBQSxTQUFTLEVBQUUsRUFBRUcsSUFBSSxFQUFFLFFBQVIsRUFBa0JDLENBQUMsRUFBRUosU0FBckIsRUFEMkI7QUFFdENDLElBQUFBLFFBQVEsRUFBRSxFQUFFRSxJQUFJLEVBQUUsUUFBUixFQUFrQkMsQ0FBQyxFQUFFSCxRQUFyQixFQUY0QixFQUFMLENBQW5DOzs7QUFLQSxNQUFJLENBQUNDLFlBQUwsRUFBbUI7QUFDakI7QUFDRDs7QUFFRCxNQUFJLENBQUNaLFlBQVksQ0FBQ00sRUFBRCxFQUFLSSxTQUFMLENBQWpCLEVBQWtDO0FBQ2hDLFdBQU9iLFNBQVMsQ0FBQ1MsRUFBRCxFQUFLLGNBQUwsQ0FBaEI7QUFDRDs7QUFFRCxRQUFNLEVBQUVTLFFBQUYsS0FBZU4sRUFBckI7QUFDQSxRQUFNTyxFQUFFLEdBQUd0QixJQUFJLEVBQWY7QUFDQSxNQUFJdUIsaUJBQUo7O0FBRUFDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSCxFQUFaOztBQUVBLE1BQUk7QUFDRkMsSUFBQUEsaUJBQWlCLEdBQUcsTUFBTWhCLGVBQWUsaUJBQUdlLEVBQUgsSUFBVUwsUUFBVixHQUFzQkwsRUFBRSxDQUFDYyxZQUF6QixDQUF6QztBQUNELEdBRkQsQ0FFRSxPQUFPQyxDQUFQLEVBQVU7QUFDVm5CLElBQUFBLE9BQU8sQ0FBQ29CLFNBQVIsQ0FBa0JELENBQWxCO0FBQ0F2QixJQUFBQSxtQkFBbUIsQ0FBQ1EsRUFBRCxDQUFuQjtBQUNBO0FBQ0Q7O0FBRUQsUUFBTVMsUUFBUSxDQUFDUSxHQUFULENBQWFOLGlCQUFiLENBQU47O0FBRUFyQixFQUFBQSxJQUFJLENBQUNVLEVBQUQsRUFBSyxDQUFDLGVBQUQsRUFBa0JVLEVBQWxCLGtCQUF3QkEsRUFBeEIsSUFBK0JMLFFBQS9CLEVBQUwsQ0FBSjtBQUNBSCxFQUFBQSxDQUFDLENBQUMsbUJBQUQsRUFBc0JRLEVBQXRCLENBQUQ7QUFDRCxDQWxDRCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5jb25zdCB1dWlkID0gcmVxdWlyZSgndXVpZC92NCcpXG5jb25zdCBzZW5kID0gcmVxdWlyZSgnLi4vLi4vLi4vdXRpbC93cy9zZW5kJylcbmNvbnN0IHNlbmRFcnJvciA9IHJlcXVpcmUoJy4uLy4uLy4uL3V0aWwvd3Mvc2VuZF9lcnJvcicpXG5jb25zdCB7IG5vdGlmeUludGVybmFsRXJyb3IgfSA9IHJlcXVpcmUoJy4uLy4uLy4uL3V0aWwvd3Mvbm90aWZ5JylcbmNvbnN0IHZhbGlkYXRlUGFyYW1zID0gcmVxdWlyZSgnLi4vLi4vLi4vdXRpbC93cy92YWxpZGF0ZV9wYXJhbXMnKVxuY29uc3QgaXNBdXRob3JpemVkID0gcmVxdWlyZSgnLi4vLi4vLi4vdXRpbC93cy9pc19hdXRob3JpemVkJylcbmNvbnN0IGVuY3J5cHRTdHJhdGVneSA9IHJlcXVpcmUoJy4uLy4uLy4uL3V0aWwvZW5jcnlwdF9zdHJhdGVneScpXG5jb25zdCBjYXB0dXJlID0gcmVxdWlyZSgnLi4vLi4vLi4vY2FwdHVyZScpXG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgKHNlcnZlciwgd3MsIG1zZykgPT4ge1xuICBjb25zdCB7IGQsIGRiIH0gPSBzZXJ2ZXJcbiAgY29uc3QgWywgYXV0aFRva2VuLCBzdHJhdGVneV0gPSBtc2dcbiAgY29uc3QgdmFsaWRSZXF1ZXN0ID0gdmFsaWRhdGVQYXJhbXMod3MsIHtcbiAgICBhdXRoVG9rZW46IHsgdHlwZTogJ3N0cmluZycsIHY6IGF1dGhUb2tlbiB9LFxuICAgIHN0cmF0ZWd5OiB7IHR5cGU6ICdvYmplY3QnLCB2OiBzdHJhdGVneSB9XG4gIH0pXG5cbiAgaWYgKCF2YWxpZFJlcXVlc3QpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICghaXNBdXRob3JpemVkKHdzLCBhdXRoVG9rZW4pKSB7XG4gICAgcmV0dXJuIHNlbmRFcnJvcih3cywgJ1VuYXV0aG9yaXplZCcpXG4gIH1cblxuICBjb25zdCB7IFN0cmF0ZWd5IH0gPSBkYlxuICBjb25zdCBpZCA9IHV1aWQoKVxuICBsZXQgZW5jcnlwdGVkU3RyYXRlZ3lcblxuICBjb25zb2xlLmxvZyhpZClcblxuICB0cnkge1xuICAgIGVuY3J5cHRlZFN0cmF0ZWd5ID0gYXdhaXQgZW5jcnlwdFN0cmF0ZWd5KHsgaWQsIC4uLnN0cmF0ZWd5IH0sIHdzLmF1dGhQYXNzd29yZClcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNhcHR1cmUuZXhjZXB0aW9uKGUpXG4gICAgbm90aWZ5SW50ZXJuYWxFcnJvcih3cylcbiAgICByZXR1cm5cbiAgfVxuXG4gIGF3YWl0IFN0cmF0ZWd5LnNldChlbmNyeXB0ZWRTdHJhdGVneSlcblxuICBzZW5kKHdzLCBbJ2RhdGEuc3RyYXRlZ3knLCBpZCwgeyBpZCwgLi4uc3RyYXRlZ3kgfV0pXG4gIGQoJ3NhdmVkIHN0cmF0ZWd5ICVzJywgaWQpXG59XG4iXX0=