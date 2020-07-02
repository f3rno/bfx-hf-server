'use strict'

const _keys = require('lodash/keys')
const _isEmpty = require('lodash/isEmpty')
const _compact = require('lodash/compact')
const _isFunction = require('lodash/isFunction')
const getLogger = require('../get_logger')
const validators = require('./validators')
const ParamValidationError = require('../../errors/param_validation_error')
const ParamsValidationError = require('../../errors/params_validation_error')

const L = getLogger('req')

const validateParams = (ws, params) => {
  const paramValidationResults = _keys(params).map((name) => {
    const { [name]: param } = params
    const { e, type, v } = param
    const validator = validators[type](true)
    let err = false

    if (!_isFunction(validator)) {
      L.warn('no validator for req param "%s" type: %s (%s)', name, type, v)
    } else {
      err = validator(v, e)
    }

    return err && new ParamValidationError(ws, { name, type, v, err })
  })

  const errors = _compact(paramValidationResults)

  if (_isEmpty(errors)) {
    return
  }

  throw new ParamsValidationError(ws, errors)
}

module.exports = validateParams
