/* eslint-env mocha */

// process.env.DEBUG = '*'

const { assert } = require('chai')
const Bluebird = require('bluebird')
const _isFunction = require('lodash/isFunction')
const testHFServer = require('../../../util/test_hf_server')
const {
  VERSION: API_SERVER_VERSION
} = require('../../../../lib/ws_servers/api')

const { PORT } = testHFServer

describe('integration:ws_servers:api:init', function () {
  this.timeout(10 * 1000)

  testHFServer('starts a WS server on the specified port', async ({
    wsServerPort, stop, client
  }) => {
    assert(_isFunction(stop), 'no stop method provided')
    assert.strictEqual(wsServerPort, PORT, 'server started on wrong port')

    return new Bluebird((resolve) => {
      client.on('open', () => { resolve() })
    })
  })

  testHFServer('sends info data to new clients', async ({ client }) => {
    let sawVersion = false
    let sawExchanges = false
    let sawMarkets = false
    let sawAuthConfigured = false

    return new Bluebird((resolve) => {
      client.onMessage((msg) => {
        const [type, ...data] = msg

        if (type === 'info.version') {
          assert.strictEqual(data[0], API_SERVER_VERSION, 'api server reported wrong version')
          sawVersion = true
        } else if (type === 'info.exchanges') {
          assert.lengthOf(data[0], 1)
          assert.strictEqual(data[0][0], 'bitfinex')
          sawExchanges = true
        } else if (type === 'info.markets') {
          assert.strictEqual(data[0], 'bitfinex')
          assert.isArray(data[1], 'reported market set not an array')
          sawMarkets = true
        } else if (type === 'info.auth_configured') {
          assert.strictEqual(data[0], false, 'server credentials already configured')
          sawAuthConfigured = true
        }

        if (sawVersion && sawExchanges && sawMarkets && sawAuthConfigured) {
          resolve()
        }
      })
    })
  })
})
