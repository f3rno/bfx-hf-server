/* eslint-env mocha */
'use strict'

const sinon = require('sinon')
const assert = require('assert')

const poolInit = require('../../../src/ex_pool')
const poolReset = require('../../../src/ex_pool/reset')
const poolAddClient = require('../../../src/ex_pool/add_client')
const poolSubscribe = require('../../../src/ex_pool/subscribe')
const poolUnsubscribe = require('../../../src/ex_pool/unsubscribe')
const poolGetSubRefCount = require('../../../src/ex_pool/get_sub_ref_count')
const chanDataToKey = require('../../../src/util/chan_data_to_key')
const bfx = require('../../../src/exchange_clients/bitfinex')
const capture = require('../../../src/capture')

describe('ex_pool: unsubscribe', () => {
  const channel = ['trades', 'tBTCUSD']
  const chanKey = chanDataToKey(channel)

  it('captures exception if no client is open for the exchange', () => {
    const pool = poolInit()

    sinon.stub(capture, 'exception')

    return poolUnsubscribe({
      pool,
      channel,
      exID: 'bitfinex'
    }).then((chanID) => {
      assert(!chanID)
      assert(capture.exception.called)
      poolReset(pool)
      capture.exception.restore()
      return null
    })
  })

  it('captures exception if not subscribed to the channel', () => {
    const pool = poolInit()
    poolAddClient(pool, 'bitfinex')

    sinon.stub(capture, 'exception')

    return poolUnsubscribe({
      pool,
      channel,
      exID: 'bitfinex'
    }).then((chanID) => {
      assert(!chanID)
      assert(capture.exception.called)
      poolReset(pool)
      capture.exception.restore()
      return null
    })
  })

  it('decrements the subscription ref count & unsubscribes if zero', async () => {
    const pool = poolInit()

    sinon.stub(bfx.prototype, 'openWS')
    sinon.stub(bfx.prototype, 'subscribe').callsFake(() => (
      new Promise((resolve) => {
        pool.exchangeClients.bitfinex.subs[chanKey] = 42
        resolve(42)
      })
    ))

    sinon.stub(bfx.prototype, 'unsubscribe').callsFake(() => (
      new Promise((resolve) => {
        delete pool.exchangeClients.bitfinex.subs[chanKey]
        resolve(42)
      })
    ))

    const subChanID = await poolSubscribe({
      pool,
      channel,
      exID: 'bitfinex'
    })

    assert.strictEqual(subChanID, 42)
    assert.strictEqual(poolGetSubRefCount(pool, 'bitfinex', chanKey), 1)

    const unsubChanID = await poolUnsubscribe({
      pool,
      channel,
      exID: 'bitfinex'
    })

    assert.strictEqual(subChanID, unsubChanID)
    assert.strictEqual(poolGetSubRefCount(pool, 'bitfinex', chanKey), 0)
    assert(pool.exchangeClients.bitfinex.unsubscribe.called)

    bfx.prototype.openWS.restore()
    bfx.prototype.subscribe.restore()
    bfx.prototype.unsubscribe.restore()

    poolReset(pool)
  })

  it('does not unsubscribe if the ref count is still above zero', async () => {
    const pool = poolInit()

    sinon.stub(bfx.prototype, 'openWS')
    sinon.stub(bfx.prototype, 'subscribe').callsFake(() => (
      new Promise((resolve) => {
        pool.exchangeClients.bitfinex.subs[chanKey] = 42
        resolve(42)
      })
    ))

    sinon.stub(bfx.prototype, 'unsubscribe').callsFake(() => (
      new Promise((resolve) => {
        delete pool.exchangeClients.bitfinex.subs[chanKey]
        resolve(42)
      })
    ))

    const subChanID = await poolSubscribe({
      pool,
      channel,
      exID: 'bitfinex'
    })

    assert.strictEqual(subChanID, 42)
    assert.strictEqual(poolGetSubRefCount(pool, 'bitfinex', chanKey), 1)

    // bump ref count
    pool.subscriptions.bitfinex[chanKey] = 2

    const unsubChanID = await poolUnsubscribe({
      pool,
      channel,
      exID: 'bitfinex'
    })

    assert.strictEqual(subChanID, unsubChanID)
    assert.strictEqual(poolGetSubRefCount(pool, 'bitfinex', chanKey), 1)
    assert(pool.exchangeClients.bitfinex.unsubscribe.notCalled)

    bfx.prototype.openWS.restore()
    bfx.prototype.subscribe.restore()
    bfx.prototype.unsubscribe.restore()

    poolReset(pool)
  })

  it('clears the ref count if forced', async () => {
    const pool = poolInit()

    sinon.stub(bfx.prototype, 'openWS')
    sinon.stub(bfx.prototype, 'subscribe').callsFake(() => (
      new Promise((resolve) => {
        pool.exchangeClients.bitfinex.subs[chanKey] = 42
        resolve(42)
      })
    ))

    sinon.stub(bfx.prototype, 'unsubscribe').callsFake(() => (
      new Promise((resolve) => {
        delete pool.exchangeClients.bitfinex.subs[chanKey]
        resolve(42)
      })
    ))

    const subChanID = await poolSubscribe({
      pool,
      channel,
      exID: 'bitfinex'
    })

    assert.strictEqual(subChanID, 42)
    assert.strictEqual(poolGetSubRefCount(pool, 'bitfinex', chanKey), 1)

    // bump ref count
    pool.subscriptions.bitfinex[chanKey] = 2

    const unsubChanID = await poolUnsubscribe({
      pool,
      channel,
      force: true,
      exID: 'bitfinex'
    })

    assert.strictEqual(subChanID, unsubChanID)
    assert.strictEqual(poolGetSubRefCount(pool, 'bitfinex', chanKey), 0)
    assert(pool.exchangeClients.bitfinex.unsubscribe.called)

    bfx.prototype.openWS.restore()
    bfx.prototype.subscribe.restore()
    bfx.prototype.unsubscribe.restore()

    poolReset(pool)
  })
})
