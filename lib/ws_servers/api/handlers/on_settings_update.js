'use strict'

const _values = require('lodash/values')
const { _default, CHARTS } = require('bfx-hf-ui-config').UserSettings

const send = require('../../../util/ws/send')
const sendError = require('../../../util/ws/send_error')
const validateParams = require('../../../util/ws/validate_params')
const isAuthorized = require('../../../util/ws/is_authorized')
const { notifySuccess, notifyInfo } = require('../../../util/ws/notify')

const { affiliateCode } = _default

module.exports = async (server, ws, msg) => {
  const { d, db } = server
  const { UserSettings } = db
  const [, bgStrategyExec, authToken, chart, dms, theme] = msg

  const validRequest = validateParams(ws, {
    bgStrategyExec: { type: 'boolean', v: bgStrategyExec },
    chart: { type: 'string', v: chart },
    theme: { type: 'string', v: theme },
    dms: { type: 'bool', v: dms }
  })

  if (!validRequest) {
    return
  } if (!isAuthorized(ws, authToken)) {
    return sendError(ws, 'Unauthorized')
  }

  const { userSettings: oldSettings = {} } = await UserSettings.getAll()
  const settings = {
    bgStrategyExec,
    affiliateCode,
    chart,
    theme,
    dms
  }

  await UserSettings.set(settings)

  d('UI settings has been updated')

  ws.UserSettings = settings

  notifySuccess(ws, 'Settings successfully updated')

  if (chart === CHARTS.TRADING_VIEW) {
    notifyInfo(ws, 'Warning: The Trading View chart does not support rendering of order and position lines')
  }

  send(ws, ['data.settings.updated', settings])

  if (oldSettings.dms !== settings.dms) {
    d('issuing API & Algo reconnect due to DMS change [dms %s]', settings.dms)

    if (ws.clients.bitfinex) {
      ws.clients.bitfinex.setDMS(settings.dms)
    }

    _values(ws.clients).forEach(ex => ex.reconnect())

    if (ws.aoc) {
      ws.aoc.reconnect()
    }

    notifySuccess(ws, 'Reconnecting with new DMS setting...')
  }
}
