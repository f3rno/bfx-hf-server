/* eslint-env mocha */

const { assert } = require('chai')
const Bluebird = require('bluebird')
const _keys = require('lodash/keys')
const _isEmpty = require('lodash/isEmpty')
const _isString = require('lodash/isString')
const testHFServer = require('../../../util/test_hf_server')

const PASSWORD = 'test-password'
const STRATEGY = {
  label: 'Test Strategy',
  defineIndicators: (() => {}).toString(),
  defineMeta: (() => {}).toString(),
  exec: (() => {}).toString()
}

describe('integration:ws_servers:api:strategy-save', function () {
  this.timeout(10 * 1000)

  testHFServer('responds with error if not authenticated', async ({ client }) => {
    client.send(['strategy.save', 'test', STRATEGY])
    return client.expectError('Unauthorized')
  })

  testHFServer('responds with saved strategy on success', async ({ client }) => {
    return new Bluebird((resolve) => {
      client.onMessage((msg) => {
        const [type, ...data] = msg

        if (type === 'data.strategy') {
          assert(_isString(data[0]) && !_isEmpty(data[0]), 'recv bad strategy ID')
          assert.strictEqual(data[1].id, data[0])

          _keys(data[1]).forEach((k) => {
            if (k === 'id') return

            assert.strictEqual(data[1][k], STRATEGY[k])
          })

          resolve()
        }
      })

      client.onAuth((token) => {
        client.send(['strategy.save', token, STRATEGY])
      })

      client.send(['auth.init', PASSWORD])
    })
  })
})
