/* eslint-env mocha */

const chai = require('chai')
const chaiThings = require('chai-things')
const ParamsValidationError = require('../../../lib/errors/params_validation_error')
const ValidationError = require('../../../lib/errors/validation_error')
const validators = require('../../../lib/util/validation/validators')

chai.should()
chai.use(chaiThings)

const { assert } = chai
const WS = null

describe('ParamsValidationError', () => {
  it('includes no mention of validation errors in UI message', () => {
    // const nParam = { name: 'numberParam', type: 'number', v: 'not' }
    // const oParam = { name: 'objectParam', type: 'object', v: 42 }
    const vErrors = [
      validators.safeNumber('not'),
      validators.safeObject(42)
    ]

    vErrors.should.all.be.an('ValidationError')

    const err = new ParamsValidationError(WS, vErrors)

    assert.isError(err)
    assert.match(err.name, /^Invalid\sParameters$/, 'invalid public message')

    const { params, errors } = err

    assert.isArray(errors, 'no sub-errors')
    assert.lengthOf(errors, 2, 'insufficient sub-errors')

    err.message.split('\n').forEach((ln, i) => {
      assert.isError(errors[i])
      assert.strictEqual(ln, errors[i].message)
    })

    assert.isArray(params, 'original param validation data not present')

    params.forEach((param, i) => {
      assert.isObject(param, 'bad param validation data')

      const { name, type, v, err } = param

      assert.isString(name)
      assert.isString(type)
      assert[i === 0 ? 'isString' : 'isNumber'](v)
      assert.isError(err)
      assert.instanceOf(err, ValidationError)
    })
  })
})
