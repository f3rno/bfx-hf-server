const gen = require('./gen_validator')
const _isEmpty = require('lodash/isEmpty')
const _isString = require('lodash/isString')
const _isFinite = require('lodash/isFinite')
const _isObject = require('lodash/isObject')
const _isBoolean = require('lodash/isBoolean')
const _isFunction = require('lodash/isFunction')

/* @todo add `reqWSClient` */
const genReqObject = gen((v, e) => _isObject(v) && (e || !_isEmpty(v)), 'object')
const genReqString = gen((v, e) => _isString(v) && (e || !_isEmpty(v)), 'string')
const genReqNumber = gen(v => _isFinite(v), 'number')
const genReqBoolean = gen(v => _isBoolean(v), 'boolean')
const genReqFunction = gen(v => _isFunction(v), 'function')

module.exports = {
  object: genReqObject(),
  string: genReqString(),
  number: genReqNumber(),
  boolean: genReqBoolean(),
  function: genReqFunction(),

  safeObject: genReqObject(true),
  safeString: genReqString(true),
  safeNumber: genReqNumber(true),
  safeBoolean: genReqBoolean(true),
  safeFunction: genReqFunction(true)
}
