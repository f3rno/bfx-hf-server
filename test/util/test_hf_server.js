/* eslint-env mocha */
'use strict'

process.env.WS_SEND_ERROR_TRACE = '0'

const WS = require('ws')
const { assert } = require('chai')
const Bluebird = require('bluebird')
const _last = require('lodash/last')
const _isError = require('lodash/isError')
const _isFunction = require('lodash/isFunction')
const startTestHFServer = require('./start_test_hf_server')

const testHFServer = (label, testParams, testHandler) => {
  const cb = _isFunction(testParams) ? testParams : testHandler
  const params = _isFunction(testParams) ? {} : testParams
  const { withClient = true } = params

  it(label, async () => {
    const serverData = await startTestHFServer(params)
    const { stop, wsServerPort } = serverData
    const testData = { ...serverData }

    if (withClient) {
      testData.client = new WS(`ws://localhost:${wsServerPort}`)
    }

    // TODO: Break this up + document, it grew over time
    return new Bluebird(async (resolve, reject) => {
      if (withClient) {
        const expectedErrors = []

        testData.client.expectError = async (msg) => {
          return new Bluebird((resolve) => {
            expectedErrors.push([msg, resolve])
          })
        }

        testData.client.on('error', (e) => {
          throw (_isError(e) ? e : new Error(e))
        })

        testData.client._send = testData.client.send
        testData.client.send = (packet) => {
          testData.client._send(JSON.stringify(packet))
        }

        testData.client.onMessage = (cb) => {
          testData.client.on('message', (msgJSON) => {
            let msg

            try {
              msg = JSON.parse(msgJSON)
            } catch (_) {
              throw new Error('received malformed JSON from server')
            }

            assert.isArray(msg)

            const [type, ...data] = msg

            if (type === 'notify' && data[0] === 'error') {
              throw new Error(`server notified error: ${data[1]}`)
            } else if (type === 'error') {
              const expectedError = _last(expectedErrors)

              if (expectedError && expectedError[0] === data[0]) {
                expectedErrors.pop()
                expectedError[1]()
              } else {
                throw new Error(`server sent error: ${data[0]}`)
              }
            }

            cb(msg)
          })
        }

        // onAuth helper
        const authListeners = []
        let authToken = null

        testData.client.onAuth = async (cb) => {
          if (authToken !== null) {
            return cb(authToken)
          }

          return new Bluebird((resolve) => {
            authListeners.push(resolve)
          }).then(cb)
        }

        testData.client.onMessage((msg) => {
          const [type, ...data] = msg

          if (type === 'info.auth_token') {
            assert.strictEqual(authToken, null, 'auth token provided twice')

            authToken = data[0]
            authListeners.forEach(cb => { cb(authToken) })
          }
        })

        // Await client connection
        await new Bluebird((resolve) => {
          testData.client.on('open', () => resolve())
        })
      }

      return cb(testData)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          if (withClient) {
            testData.client.close()
          }

          stop()
        })
    })
  })
}

module.exports = testHFServer
module.exports.LOG_PATH = startTestHFServer.LOG_PATH
module.exports.PORT = startTestHFServer.PORT

module.exports.DB_PATH = startTestHFServer.DB_PATH
module.exports.UI_DB_PATH = startTestHFServer.UI_DB_PATH
module.exports.ALGO_DB_PATH = startTestHFServer.ALGO_DB_PATH
module.exports.DS_BITFINEX_BB_PATH = startTestHFServer.DS_BITFINEX_BB_PATH
