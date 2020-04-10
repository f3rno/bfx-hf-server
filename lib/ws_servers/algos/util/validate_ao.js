'use strict';function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

const _isFunction = require('lodash/isFunction');

module.exports = (aoHost, aoID, payload) => {
  const ao = aoHost.getAO(aoID);

  if (!ao) {
    return `Unknown algo order ID: ${aoID}`;
  }

  const { meta = {} } = ao;
  const { validateParams, processParams } = meta;

  const params = _isFunction(processParams) ?
  processParams(payload) : _objectSpread({},
  payload);

  if (_isFunction(validateParams)) {
    const err = validateParams(params);

    if (err) {
      return err;
    }
  }

  return null;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy93c19zZXJ2ZXJzL2FsZ29zL3V0aWwvdmFsaWRhdGVfYW8uanMiXSwibmFtZXMiOlsiX2lzRnVuY3Rpb24iLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsImFvSG9zdCIsImFvSUQiLCJwYXlsb2FkIiwiYW8iLCJnZXRBTyIsIm1ldGEiLCJ2YWxpZGF0ZVBhcmFtcyIsInByb2Nlc3NQYXJhbXMiLCJwYXJhbXMiLCJlcnIiXSwibWFwcGluZ3MiOiJBQUFBLGE7O0FBRUEsTUFBTUEsV0FBVyxHQUFHQyxPQUFPLENBQUMsbUJBQUQsQ0FBM0I7O0FBRUFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixDQUFDQyxNQUFELEVBQVNDLElBQVQsRUFBZUMsT0FBZixLQUEyQjtBQUMxQyxRQUFNQyxFQUFFLEdBQUdILE1BQU0sQ0FBQ0ksS0FBUCxDQUFhSCxJQUFiLENBQVg7O0FBRUEsTUFBSSxDQUFDRSxFQUFMLEVBQVM7QUFDUCxXQUFRLDBCQUF5QkYsSUFBSyxFQUF0QztBQUNEOztBQUVELFFBQU0sRUFBRUksSUFBSSxHQUFHLEVBQVQsS0FBZ0JGLEVBQXRCO0FBQ0EsUUFBTSxFQUFFRyxjQUFGLEVBQWtCQyxhQUFsQixLQUFvQ0YsSUFBMUM7O0FBRUEsUUFBTUcsTUFBTSxHQUFHWixXQUFXLENBQUNXLGFBQUQsQ0FBWDtBQUNYQSxFQUFBQSxhQUFhLENBQUNMLE9BQUQsQ0FERjtBQUVOQSxFQUFBQSxPQUZNLENBQWY7O0FBSUEsTUFBSU4sV0FBVyxDQUFDVSxjQUFELENBQWYsRUFBaUM7QUFDL0IsVUFBTUcsR0FBRyxHQUFHSCxjQUFjLENBQUNFLE1BQUQsQ0FBMUI7O0FBRUEsUUFBSUMsR0FBSixFQUFTO0FBQ1AsYUFBT0EsR0FBUDtBQUNEO0FBQ0Y7O0FBRUQsU0FBTyxJQUFQO0FBQ0QsQ0F2QkQiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuY29uc3QgX2lzRnVuY3Rpb24gPSByZXF1aXJlKCdsb2Rhc2gvaXNGdW5jdGlvbicpXG5cbm1vZHVsZS5leHBvcnRzID0gKGFvSG9zdCwgYW9JRCwgcGF5bG9hZCkgPT4ge1xuICBjb25zdCBhbyA9IGFvSG9zdC5nZXRBTyhhb0lEKVxuXG4gIGlmICghYW8pIHtcbiAgICByZXR1cm4gYFVua25vd24gYWxnbyBvcmRlciBJRDogJHthb0lEfWBcbiAgfVxuXG4gIGNvbnN0IHsgbWV0YSA9IHt9IH0gPSBhb1xuICBjb25zdCB7IHZhbGlkYXRlUGFyYW1zLCBwcm9jZXNzUGFyYW1zIH0gPSBtZXRhXG5cbiAgY29uc3QgcGFyYW1zID0gX2lzRnVuY3Rpb24ocHJvY2Vzc1BhcmFtcylcbiAgICA/IHByb2Nlc3NQYXJhbXMocGF5bG9hZClcbiAgICA6IHsgLi4ucGF5bG9hZCB9XG5cbiAgaWYgKF9pc0Z1bmN0aW9uKHZhbGlkYXRlUGFyYW1zKSkge1xuICAgIGNvbnN0IGVyciA9IHZhbGlkYXRlUGFyYW1zKHBhcmFtcylcblxuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnJcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuIl19