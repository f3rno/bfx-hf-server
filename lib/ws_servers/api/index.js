'use strict';

const PI = require('p-iteration');

const { get: getCredentials } = require('../../db/credentials');
const EXCHANGE_ADAPTERS = require('../../exchange_clients');
const send = require('../../util/ws/send');
const PoolClient = require('../../ws_clients/ex_pool');
const HFDSClient = require('../../ws_clients/hf_ds');
const AlgoServerClient = require('../../ws_clients/algos');
const WSServer = require('../../ws_server');
const removePoolClient = require('../../ws_clients/ex_pool/remove_client');

const onAuthSubmit = require('./handlers/on_auth_submit');
const onAuthInit = require('./handlers/on_auth_init');
const onAuthReset = require('./handlers/on_auth_reset');
const onSubscribe = require('./handlers/on_subscribe');
const onUnsubscribe = require('./handlers/on_unsubscribe');
const onCandleRequest = require('./handlers/on_candle_request');
const onSaveStrategy = require('./handlers/on_save_strategy');
const onSaveAPICredentials = require('./handlers/on_save_api_credentials');
const onOrderSubmit = require('./handlers/on_order_submit');
const onOrderCancel = require('./handlers/on_order_cancel');
const onAlgoOrderSubmit = require('./handlers/on_algo_order_submit');
const onAlgoOrderCancel = require('./handlers/on_algo_order_cancel');
const onSettingsUpdate = require('./handlers/on_settings_update');
const onSettingsRequest = require('./send_settings');

const VERSION = 1;

module.exports = class APIWSServer extends WSServer {
  /**
                                                      * @param {object} args - args
                                                      * @param {number} args.port - port to listen on
                                                      * @param {object} [args.server] - server
                                                      * @param {object} args.db - bfx-hf-models db instance
                                                      * @param {string} args.hfDSBitfinexURL - URL to bitfinex data server
                                                      * @param {string} args.exPoolURL - URL to exchange pool server
                                                      * @param {string} args.algoServerURL - URL to algo server
                                                      */
  constructor({
    port,
    server,
    db,
    hfDSBitfinexURL,
    /** hfDSBinanceURL, */
    exPoolURL,
    algoServerURL })
  {
    super({
      port,
      server,
      debugName: 'api',
      msgHandlers: {
        'auth.init': onAuthInit,
        'auth.submit': onAuthSubmit,
        'auth.reset': onAuthReset,

        subscribe: onSubscribe,
        unsubscribe: onUnsubscribe,

        'get.candles': onCandleRequest,
        'get.settings': onSettingsRequest,

        'strategy.save': onSaveStrategy,
        'api_credentials.save': onSaveAPICredentials,
        'order.submit': onOrderSubmit,
        'order.cancel': onOrderCancel,
        'algo_order.submit': onAlgoOrderSubmit,
        'algo_order.cancel': onAlgoOrderCancel,
        'settings.update': onSettingsUpdate } });



    this.db = db;
    this.algoServerURL = algoServerURL;
    this.pc = new PoolClient({ url: exPoolURL });
    this.hfDSClients = {
      bitfinex: new HFDSClient({ id: 'bitfinex', url: hfDSBitfinexURL })
      // NOTE: binance disabled pending plugin system
      // binance: new HFDSClient({ id: 'binance', url: hfDSBinanceURL })
    };
  }

  openAlgoServerClient() {
    return new AlgoServerClient({ url: this.algoServerURL });
  }

  async sendInitialConnectionData(ws) {
    send(ws, ['info.version', VERSION]);
    send(ws, ['info.exchanges', EXCHANGE_ADAPTERS.map(({ id }) => id)]);

    await PI.forEach(EXCHANGE_ADAPTERS, async ({ id }) => {
      const { Market } = this.db;
      const markets = await Market.find([['exchange', '=', id]]);

      send(ws, ['info.markets', id, markets]);
    }).catch(err => {
      this.d('error sending markets to client: %s', err.stack);
    });

    const credentials = await getCredentials(this.db);

    send(ws, ['info.auth_configured', !!credentials]);
  }

  async onWSSConnection(ws) {
    super.onWSSConnection(ws);

    ws.clients = {};
    ws.user = null;

    await this.sendInitialConnectionData(ws);
  }

  onWSClose(ws) {
    super.onWSClose(ws);

    Object.keys(ws.clients).forEach(exID => {
      if (ws.aoc) {
        ws.aoc.closeHost(exID);
      }

      ws.clients[exID].close();
    });

    if (ws.aoc) {
      ws.aoc.close();
    }

    removePoolClient(this.pc, ws);

    const subExchanges = Object.keys(ws.subscriptions || {});

    subExchanges.forEach(exID => {
      ws.subscriptions[exID].forEach(channelData => {
        this.pc.send(['unsub', exID, channelData]);
      });
    });

    ws.clients = {};
    ws.user = null;
  }};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93c19zZXJ2ZXJzL2FwaS9pbmRleC5qcyJdLCJuYW1lcyI6WyJQSSIsInJlcXVpcmUiLCJnZXQiLCJnZXRDcmVkZW50aWFscyIsIkVYQ0hBTkdFX0FEQVBURVJTIiwic2VuZCIsIlBvb2xDbGllbnQiLCJIRkRTQ2xpZW50IiwiQWxnb1NlcnZlckNsaWVudCIsIldTU2VydmVyIiwicmVtb3ZlUG9vbENsaWVudCIsIm9uQXV0aFN1Ym1pdCIsIm9uQXV0aEluaXQiLCJvbkF1dGhSZXNldCIsIm9uU3Vic2NyaWJlIiwib25VbnN1YnNjcmliZSIsIm9uQ2FuZGxlUmVxdWVzdCIsIm9uU2F2ZVN0cmF0ZWd5Iiwib25TYXZlQVBJQ3JlZGVudGlhbHMiLCJvbk9yZGVyU3VibWl0Iiwib25PcmRlckNhbmNlbCIsIm9uQWxnb09yZGVyU3VibWl0Iiwib25BbGdvT3JkZXJDYW5jZWwiLCJvblNldHRpbmdzVXBkYXRlIiwib25TZXR0aW5nc1JlcXVlc3QiLCJWRVJTSU9OIiwibW9kdWxlIiwiZXhwb3J0cyIsIkFQSVdTU2VydmVyIiwiY29uc3RydWN0b3IiLCJwb3J0Iiwic2VydmVyIiwiZGIiLCJoZkRTQml0ZmluZXhVUkwiLCJleFBvb2xVUkwiLCJhbGdvU2VydmVyVVJMIiwiZGVidWdOYW1lIiwibXNnSGFuZGxlcnMiLCJzdWJzY3JpYmUiLCJ1bnN1YnNjcmliZSIsInBjIiwidXJsIiwiaGZEU0NsaWVudHMiLCJiaXRmaW5leCIsImlkIiwib3BlbkFsZ29TZXJ2ZXJDbGllbnQiLCJzZW5kSW5pdGlhbENvbm5lY3Rpb25EYXRhIiwid3MiLCJtYXAiLCJmb3JFYWNoIiwiTWFya2V0IiwibWFya2V0cyIsImZpbmQiLCJjYXRjaCIsImVyciIsImQiLCJzdGFjayIsImNyZWRlbnRpYWxzIiwib25XU1NDb25uZWN0aW9uIiwiY2xpZW50cyIsInVzZXIiLCJvbldTQ2xvc2UiLCJPYmplY3QiLCJrZXlzIiwiZXhJRCIsImFvYyIsImNsb3NlSG9zdCIsImNs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c0IsYUFBSCxJQUFvQixFQUFoQyxDQUFyQjs7QUFFQUQsSUFBQUEsWUFBWSxDQUFDbkIsT0FBYixDQUFzQmUsSUFBRCxJQUFVO0FBQzdCakIsTUFBQUEsRUFBRSxDQUFDc0IsYUFBSCxDQUFpQkwsSUFBakIsRUFBdUJmLE9BQXZCLENBQWdDcUIsV0FBRCxJQUFpQjtBQUM5QyxhQUFLOUIsRUFBTCxDQUFRbkMsSUFBUixDQUFhLENBQUMsT0FBRCxFQUFVMkQsSUFBVixFQUFnQk0sV0FBaEIsQ0FBYjtBQUNELE9BRkQ7QUFHRCxLQUpEOztBQU1BdkIsSUFBQUEsRUFBRSxDQUFDWSxPQUFILEdBQWEsRUFBYjtBQUNBWixJQUFBQSxFQUFFLENBQUNhLElBQUgsR0FBVSxJQUFWO0FBQ0QsR0FoSGlELENBQXBEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IFBJID0gcmVxdWlyZSgncC1pdGVyYXRpb24nKVxuXG5jb25zdCB7IGdldDogZ2V0Q3JlZGVudGlhbHMgfSA9IHJlcXVpcmUoJy4uLy4uL2RiL2NyZWRlbnRpYWxzJylcbmNvbnN0IEVYQ0hBTkdFX0FEQVBURVJTID0gcmVxdWlyZSgnLi4vLi4vZXhjaGFuZ2VfY2xpZW50cycpXG5jb25zdCBzZW5kID0gcmVxdWlyZSgnLi4vLi4vdXRpbC93cy9zZW5kJylcbmNvbnN0IFBvb2xDbGllbnQgPSByZXF1aXJlKCcuLi8uLi93c19jbGllbnRzL2V4X3Bvb2wnKVxuY29uc3QgSEZEU0NsaWVudCA9IHJlcXVpcmUoJy4uLy4uL3dzX2NsaWVudHMvaGZfZHMnKVxuY29uc3QgQWxnb1NlcnZlckNsaWVudCA9IHJlcXVpcmUoJy4uLy4uL3dzX2NsaWVudHMvYWxnb3MnKVxuY29uc3QgV1NTZXJ2ZXIgPSByZXF1aXJlKCcuLi8uLi93c19zZXJ2ZXInKVxuY29uc3QgcmVtb3ZlUG9vbENsaWVudCA9IHJlcXVpcmUoJy4uLy4uL3dzX2NsaWVudHMvZXhfcG9vbC9yZW1vdmVfY2xpZW50JylcblxuY29uc3Qgb25BdXRoU3VibWl0ID0gcmVxdWlyZSgnLi9oYW5kbGVycy9vbl9hdXRoX3N1Ym1pdCcpXG5jb25zdCBvbkF1dGhJbml0ID0gcmVxdWlyZSgnLi9oYW5kbGVycy9vbl9hdXRoX2luaXQnKVxuY29uc3Qgb25BdXRoUmVzZXQgPSByZXF1aXJlKCcuL2hhbmRsZXJzL29uX2F1dGhfcmVzZXQnKVxuY29uc3Qgb25TdWJzY3JpYmUgPSByZXF1aXJlKCcuL2hhbmRsZXJzL29uX3N1YnNjcmliZScpXG5jb25zdCBvblVuc3Vic2NyaWJlID0gcmVxdWlyZSgnLi9oYW5kbGVycy9vbl91bnN1YnNjcmliZScpXG5jb25zdCBvbkNhbmRsZVJlcXVlc3QgPSByZXF1aXJlKCcuL2hhbmRsZXJzL29uX2NhbmRsZV9yZXF1ZXN0JylcbmNvbnN0IG9uU2F2ZVN0cmF0ZWd5ID0gcmVxdWlyZSgnLi9oYW5kbGVycy9vbl9zYXZlX3N0cmF0ZWd5JylcbmNvbnN0IG9uU2F2ZUFQSUNyZWRlbnRpYWxzID0gcmVxdWlyZSgnLi9oYW5kbGVycy9vbl9zYXZlX2FwaV9jcmVkZW50aWFscycpXG5jb25zdCBvbk9yZGVyU3VibWl0ID0gcmVxdWlyZSgnLi9oYW5kbGVycy9vbl9vcmRlcl9zdWJtaXQnKVxuY29uc3Qgb25PcmRlckNhbmNlbCA9IHJlcXVpcmUoJy4vaGFuZGxlcnMvb25fb3JkZXJfY2FuY2VsJylcbmNvbnN0IG9uQWxnb09yZGVyU3VibWl0ID0gcmVxdWlyZSgnLi9oYW5kbGVycy9vbl9hbGdvX29yZGVyX3N1Ym1pdCcpXG5jb25zdCBvbkFsZ29PcmRlckNhbmNlbCA9IHJlcXVpcmUoJy4vaGFuZGxlcnMvb25fYWxnb19vcmRlcl9jYW5jZWwnKVxuY29uc3Qgb25TZXR0aW5nc1VwZGF0ZSA9IHJlcXVpcmUoJy4vaGFuZGxlcnMvb25fc2V0dGluZ3NfdXBkYXRlJylcbmNvbnN0IG9uU2V0dGluZ3NSZXF1ZXN0ID0gcmVxdWlyZSgnLi9zZW5kX3NldHRpbmdzJylcblxuY29uc3QgVkVSU0lPTiA9IDFcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBBUElXU1NlcnZlciBleHRlbmRzIFdTU2VydmVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhcmdzIC0gYXJnc1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXJncy5wb3J0IC0gcG9ydCB0byBsaXN0ZW4gb25cbiAgICogQHBhcmFtIHtvYmplY3R9IFthcmdzLnNlcnZlcl0gLSBzZXJ2ZXJcbiAgICogQHBhcmFtIHtvYmplY3R9IGFyZ3MuZGIgLSBiZngtaGYtbW9kZWxzIGRiIGluc3RhbmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzLmhmRFNCaXRmaW5leFVSTCAtIFVSTCB0byBiaXRmaW5leCBkYXRhIHNlcnZlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXJncy5leFBvb2xVUkwgLSBVUkwgdG8gZXhjaGFuZ2UgcG9vbCBzZXJ2ZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFyZ3MuYWxnb1NlcnZlclVSTCAtIFVSTCB0byBhbGdvIHNlcnZlclxuICAgKi9cbiAgY29uc3RydWN0b3IgKHtcbiAgICBwb3J0LFxuICAgIHNlcnZlcixcbiAgICBkYixcbiAgICBoZkRTQml0ZmluZXhVUkwsXG4gICAgLyoqIGhmRFNCaW5hbmNlVVJMLCAqL1xuICAgIGV4UG9vbFVSTCxcbiAgICBhbGdvU2VydmVyVVJMXG4gIH0pIHtcbiAgICBzdXBlcih7XG4gICAgICBwb3J0LFxuICAgICAgc2VydmVyLFxuICAgICAgZGVidWdOYW1lOiAnYXBpJyxcbiAgICAgIG1zZ0hhbmRsZXJzOiB7XG4gICAgICAgICdhdXRoLmluaXQnOiBvbkF1dGhJbml0LFxuICAgICAgICAnYXV0aC5zdWJtaXQnOiBvbkF1dGhTdWJtaXQsXG4gICAgICAgICdhdXRoLnJlc2V0Jzogb25BdXRoUmVzZXQsXG5cbiAgICAgICAgc3Vic2NyaWJlOiBvblN1YnNjcmliZSxcbiAgICAgICAgdW5zdWJzY3JpYmU6IG9uVW5zdWJzY3JpYmUsXG5cbiAgICAgICAgJ2dldC5jYW5kbGVzJzogb25DYW5kbGVSZXF1ZXN0LFxuICAgICAgICAnZ2V0LnNldHRpbmdzJzogb25TZXR0aW5nc1JlcXVlc3QsXG5cbiAgICAgICAgJ3N0cmF0ZWd5LnNhdmUnOiBvblNhdmVTdHJhdGVneSxcbiAgICAgICAgJ2FwaV9jcmVkZW50aWFscy5zYXZlJzogb25TYXZlQVBJQ3JlZGVudGlhbHMsXG4gICAgICAgICdvcmRlci5zdWJtaXQnOiBvbk9yZGVyU3VibWl0LFxuICAgICAgICAnb3JkZXIuY2FuY2VsJzogb25PcmRlckNhbmNlbCxcbiAgICAgICAgJ2FsZ29fb3JkZXIuc3VibWl0Jzogb25BbGdvT3JkZXJTdWJtaXQsXG4gICAgICAgICdhbGdvX29yZGVyLmNhbmNlbCc6IG9uQWxnb09yZGVyQ2FuY2VsLFxuICAgICAgICAnc2V0dGluZ3MudXBkYXRlJzogb25TZXR0aW5nc1VwZGF0ZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmRiID0gZGJcbiAgICB0aGlzLmFsZ29TZXJ2ZXJVUkwgPSBhbGdvU2VydmVyVVJMXG4gICAgdGhpcy5wYyA9IG5ldyBQb29sQ2xpZW50KHsgdXJsOiBleFBvb2xVUkwgfSlcbiAgICB0aGlzLmhmRFNDbGllbnRzID0ge1xuICAgICAgYml0ZmluZXg6IG5ldyBIRkRTQ2xpZW50KHsgaWQ6ICdiaXRmaW5leCcsIHVybDogaGZEU0JpdGZpbmV4VVJMIH0pXG4gICAgICAvLyBOT1RFOiBiaW5hbmNlIGRpc2FibGVkIHBlbmRpbmcgcGx1Z2luIHN5c3RlbVxuICAgICAgLy8gYmluYW5jZTogbmV3IEhGRFNDbGllbnQoeyBpZDogJ2JpbmFuY2UnLCB1cmw6IGhmRFNCaW5hbmNlVVJMIH0pXG4gICAgfVxuICB9XG5cbiAgb3BlbkFsZ29TZXJ2ZXJDbGllbnQgKCkge1xuICAgIHJldHVybiBuZXcgQWxnb1NlcnZlckNsaWVudCh7IHVybDogdGhpcy5hbGdvU2VydmVyVVJMIH0pXG4gIH1cblxuICBhc3luYyBzZW5kSW5pdGlhbENvbm5lY3Rpb25EYXRhICh3cykge1xuICAgIHNlbmQod3MsIFsnaW5mby52ZXJzaW9uJywgVkVSU0lPTl0pXG4gICAgc2VuZCh3cywgWydpbmZvLmV4Y2hhbmdlcycsIEVYQ0hBTkdFX0FEQVBURVJTLm1hcCgoeyBpZCB9KSA9PiBpZCldKVxuXG4gICAgYXdhaXQgUEkuZm9yRWFjaChFWENIQU5HRV9BREFQVEVSUywgYXN5bmMgKHsgaWQgfSkgPT4ge1xuICAgICAgY29uc3QgeyBNYXJrZXQgfSA9IHRoaXMuZGJcbiAgICAgIGNvbnN0IG1hcmtldHMgPSBhd2FpdCBNYXJrZXQuZmluZChbWydleGNoYW5nZScsICc9JywgaWRdXSlcblxuICAgICAgc2VuZCh3cywgWydpbmZvLm1hcmtldHMnLCBpZCwgbWFya2V0c10pXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgdGhpcy5kKCdlcnJvciBzZW5kaW5nIG1hcmtldHMgdG8gY2xpZW50OiAlcycsIGVyci5zdGFjaylcbiAgICB9KVxuXG4gICAgY29uc3QgY3JlZGVudGlhbHMgPSBhd2FpdCBnZXRDcmVkZW50aWFscyh0aGlzLmRiKVxuXG4gICAgc2VuZCh3cywgWydpbmZvLmF1dGhfY29uZmlndXJlZCcsICEhY3JlZGVudGlhbHNdKVxuICB9XG5cbiAgYXN5bmMgb25XU1NDb25uZWN0aW9uICh3cykge1xuICAgIHN1cGVyLm9uV1NTQ29ubmVjdGlvbih3cylcblxuICAgIHdzLmNsaWVudHMgPSB7fVxuICAgIHdzLnVzZXIgPSBudWxsXG5cbiAgICBhd2FpdCB0aGlzLnNlbmRJbml0aWFsQ29ubmVjdGlvbkRhdGEod3MpXG4gIH1cblxuICBvbldTQ2xvc2UgKHdzKSB7XG4gICAgc3VwZXIub25XU0Nsb3NlKHdzKVxuXG4gICAgT2JqZWN0LmtleXMod3MuY2xpZW50cykuZm9yRWFjaChleElEID0+IHtcbiAgICAgIGlmICh3cy5hb2MpIHtcbiAgICAgICAgd3MuYW9jLmNsb3NlSG9zdChleElEKVxuICAgICAgfVxuXG4gICAgICB3cy5jbGllbnRzW2V4SURdLmNsb3NlKClcbiAgICB9KVxuXG4gICAgaWYgKHdzLmFvYykge1xuICAgICAgd3MuYW9jLmNsb3NlKClcbiAgICB9XG5cbiAgICByZW1vdmVQb29sQ2xpZW50KHRoaXMucGMsIHdzKVxuXG4gICAgY29uc3Qgc3ViRXhjaGFuZ2VzID0gT2JqZWN0LmtleXMod3Muc3Vic2NyaXB0aW9ucyB8fCB7fSlcblxuICAgIHN1YkV4Y2hhbmdlcy5mb3JFYWNoKChleElEKSA9PiB7XG4gICAgICB3cy5zdWJzY3JpcHRpb25zW2V4SURdLmZvckVhY2goKGNoYW5uZWxEYXRhKSA9PiB7XG4gICAgICAgIHRoaXMucGMuc2VuZChbJ3Vuc3ViJywgZXhJRCwgY2hhbm5lbERhdGFdKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgd3MuY2xpZW50cyA9IHt9XG4gICAgd3MudXNlciA9IG51bGxcbiAgfVxufVxuIl19