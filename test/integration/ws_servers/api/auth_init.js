/* eslint-env mocha */

const { assert } = require('chai')
const Bluebird = require('bluebird')
const _isEmpty = require('lodash/isEmpty')
const _isString = require('lodash/isString')
const testHFServer = require('../../../util/test_hf_server')
const { get: getCredentials } = require('../../../../lib/db/credentials')

const PASSWORD = 'test-password'

describe('integration:ws_servers:api:auth-init', function () {
  this.timeout(10 * 1000)

  testHFServer('provides an auth token on success', async ({ client }) => {
    return new Bluebird((resolve) => {
      let sawAuthConfigured = false
      let sawAuthSuccess = false
      let sawAuthToken = false

      client.onMessage((msg) => {
        const [type, ...data] = msg

        if (type === 'info.auth_configured' && data[0]) {
          sawAuthConfigured = true
        } else if (type === 'info.auth_token') {
          assert(_isString(data[0]) && !_isEmpty(data[0]), 'got bad auth token')
          sawAuthToken = true
        } else if (
          type === 'notify' &&
          data[0] === 'success' &&
          data[1] === 'Authenticated'
        ) {
          sawAuthSuccess = true
        }

        if (sawAuthConfigured && sawAuthSuccess && sawAuthToken) {
          resolve()
        }
      })

      client.send(['auth.init', PASSWORD])
    })
  })

  testHFServer('creates a new Credential model on succcess', async ({
    client, apiDB
  }) => {
    return new Bluebird((resolve) => {
      client.onAuth(async () => {
        const credentials = await getCredentials(apiDB)

        assert.isObject(credentials)
        assert(!_isEmpty(credentials))

        resolve()
      })

      client.send(['auth.init', PASSWORD])
    })
  })

  testHFServer('sends all strategies on success', async ({ client }) => {
    return new Bluebird((resolve) => {
      client.onMessage((msg) => {
        const [type, ...data] = msg

        if (type === 'data.strategies') {
          assert.isArray(data[0])
          assert.lengthOf(data[0], 0)
          resolve()
        }
      })

      client.send(['auth.init', PASSWORD])
    })
  })
})
