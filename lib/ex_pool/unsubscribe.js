'use strict';

const capture = require('../capture');
const getClient = require('./get_client');
const hasClient = require('./has_client');
const getSubscriptionRefCount = require('./get_sub_ref_count');
const clearSubscriptionRefCount = require('./clear_sub_ref_count');
const decrementSubscriptionRefCount = require('./decrement_sub_ref_count');
const chanDataToKey = require('../util/chan_data_to_key');

/**
                                                            * @param {object} args - arguments
                                                            * @param {object} args.pool - exchange pool
                                                            * @param {string} args.exID - exchange ID
                                                            * @param {string[]} args.channel - channel data
                                                            * @param {boolean} [args.force] - if true, ref count is reset, otherwise
                                                            *   decremented
                                                            * @returns {Promise} p - resolves to chanID or null
                                                            */
module.exports = async ({ pool, exID, channel, force }) => {
  if (!hasClient(pool, exID)) {
    capture.exception('tried to unsub from unknown exchange: %s', exID);
    return null;
  }

  const ex = getClient(pool, exID);
  const chanKey = chanDataToKey(channel);

  if (!ex.isSubscribed(channel)) {
    capture.exception(
    'tried to unsubscribe from non-subscribed channel: %s %j',
    exID, channel);


    return null;
  }

  if (force) {
    clearSubscriptionRefCount(pool, exID, chanKey);
  } else {
    decrementSubscriptionRefCount(pool, exID, chanKey);
  }

  const ref = getSubscriptionRefCount(pool, exID, chanKey);

  if (ref === 0) {
    return ex.unsubscribe(channel);
  } else {
    return ex.getChannelID(channel);
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leF9wb29sL3Vuc3Vic2NyaWJlLmpzIl0sIm5hbWVzIjpbImNhcHR1cmUiLCJyZXF1aXJlIiwiZ2V0Q2xpZW50IiwiaGFzQ2xpZW50IiwiZ2V0U3Vic2NyaXB0aW9uUmVmQ291bnQiLCJjbGVhclN1YnNjcmlwdGlvblJlZkNvdW50IiwiZGVjcmVtZW50U3Vic2NyaXB0aW9uUmVmQ291bnQiLCJjaGFuRGF0YVRvS2V5IiwibW9kdWxlIiwiZXhwb3J0cyIsInBvb2wiLCJleElEIiwiY2hhbm5lbCIsImZvcmNlIiwiZXhjZXB0aW9uIiwiZXgiLCJjaGFuS2V5IiwiaXNTdWJzY3JpYmVkIiwicmVmIiwidW5zdWJzY3JpYmUiLCJnZXRDaGFubmVsSUQiXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU1BLE9BQU8sR0FBR0MsT0FBTyxDQUFDLFlBQUQsQ0FBdkI7QUFDQSxNQUFNQyxTQUFTLEdBQUdELE9BQU8sQ0FBQyxjQUFELENBQXpCO0FBQ0EsTUFBTUUsU0FBUyxHQUFHRixPQUFPLENBQUMsY0FBRCxDQUF6QjtBQUNBLE1BQU1HLHVCQUF1QixHQUFHSCxPQUFPLENBQUMscUJBQUQsQ0FBdkM7QUFDQSxNQUFNSSx5QkFBeUIsR0FBR0osT0FBTyxDQUFDLHVCQUFELENBQXpDO0FBQ0EsTUFBTUssNkJBQTZCLEdBQUdMLE9BQU8sQ0FBQywyQkFBRCxDQUE3QztBQUNBLE1BQU1NLGFBQWEsR0FBR04sT0FBTyxDQUFDLDBCQUFELENBQTdCOztBQUVBOzs7Ozs7Ozs7QUFTQU8sTUFBTSxDQUFDQyxPQUFQLEdBQWlCLE9BQU8sRUFBRUMsSUFBRixFQUFRQyxJQUFSLEVBQWNDLE9BQWQsRUFBdUJDLEtBQXZCLEVBQVAsS0FBMEM7QUFDekQsTUFBSSxDQUFDVixTQUFTLENBQUNPLElBQUQsRUFBT0MsSUFBUCxDQUFkLEVBQTRCO0FBQzFCWCxJQUFBQSxPQUFPLENBQUNjLFNBQVIsQ0FBa0IsMENBQWxCLEVBQThESCxJQUE5RDtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUVELFFBQU1JLEVBQUUsR0FBR2IsU0FBUyxDQUFDUSxJQUFELEVBQU9DLElBQVAsQ0FBcEI7QUFDQSxRQUFNSyxPQUFPLEdBQUdULGFBQWEsQ0FBQ0ssT0FBRCxDQUE3Qjs7QUFFQSxNQUFJLENBQUNHLEVBQUUsQ0FBQ0UsWUFBSCxDQUFnQkwsT0FBaEIsQ0FBTCxFQUErQjtBQUM3QlosSUFBQUEsT0FBTyxDQUFDYyxTQUFSO0FBQ0UsNkRBREY7QUFFRUgsSUFBQUEsSUFGRixFQUVRQyxPQUZSOzs7QUFLQSxXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJQyxLQUFKLEVBQVc7QUFDVFIsSUFBQUEseUJBQXlCLENBQUNLLElBQUQsRUFBT0MsSUFBUCxFQUFhSyxPQUFiLENBQXpCO0FBQ0QsR0FGRCxNQUVPO0FBQ0xWLElBQUFBLDZCQUE2QixDQUFDSSxJQUFELEVBQU9DLElBQVAsRUFBYUssT0FBYixDQUE3QjtBQUNEOztBQUVELFFBQU1FLEdBQUcsR0FBR2QsdUJBQXVCLENBQUNNLElBQUQsRUFBT0MsSUFBUCxFQUFhSyxPQUFiLENBQW5DOztBQUVBLE1BQUlFLEdBQUcsS0FBSyxDQUFaLEVBQWU7QUFDYixXQUFPSCxFQUFFLENBQUNJLFdBQUgsQ0FBZVAsT0FBZixDQUFQO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBT0csRUFBRSxDQUFDSyxZQUFILENBQWdCUixPQUFoQixDQUFQO0FBQ0Q7QUFDRixDQS9CRCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBjYXB0dXJlID0gcmVxdWlyZSgnLi4vY2FwdHVyZScpXG5jb25zdCBnZXRDbGllbnQgPSByZXF1aXJlKCcuL2dldF9jbGllbnQnKVxuY29uc3QgaGFzQ2xpZW50ID0gcmVxdWlyZSgnLi9oYXNfY2xpZW50JylcbmNvbnN0IGdldFN1YnNjcmlwdGlvblJlZkNvdW50ID0gcmVxdWlyZSgnLi9nZXRfc3ViX3JlZl9jb3VudCcpXG5jb25zdCBjbGVhclN1YnNjcmlwdGlvblJlZkNvdW50ID0gcmVxdWlyZSgnLi9jbGVhcl9zdWJfcmVmX2NvdW50JylcbmNvbnN0IGRlY3JlbWVudFN1YnNjcmlwdGlvblJlZkNvdW50ID0gcmVxdWlyZSgnLi9kZWNyZW1lbnRfc3ViX3JlZl9jb3VudCcpXG5jb25zdCBjaGFuRGF0YVRvS2V5ID0gcmVxdWlyZSgnLi4vdXRpbC9jaGFuX2RhdGFfdG9fa2V5JylcblxuLyoqXG4gKiBAcGFyYW0ge29iamVjdH0gYXJncyAtIGFyZ3VtZW50c1xuICogQHBhcmFtIHtvYmplY3R9IGFyZ3MucG9vbCAtIGV4Y2hhbmdlIHBvb2xcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzLmV4SUQgLSBleGNoYW5nZSBJRFxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJncy5jaGFubmVsIC0gY2hhbm5lbCBkYXRhXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFthcmdzLmZvcmNlXSAtIGlmIHRydWUsIHJlZiBjb3VudCBpcyByZXNldCwgb3RoZXJ3aXNlXG4gKiAgIGRlY3JlbWVudGVkXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gcCAtIHJlc29sdmVzIHRvIGNoYW5JRCBvciBudWxsXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgKHsgcG9vbCwgZXhJRCwgY2hhbm5lbCwgZm9yY2UgfSkgPT4ge1xuICBpZiAoIWhhc0NsaWVudChwb29sLCBleElEKSkge1xuICAgIGNhcHR1cmUuZXhjZXB0aW9uKCd0cmllZCB0byB1bnN1YiBmcm9tIHVua25vd24gZXhjaGFuZ2U6ICVzJywgZXhJRClcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgY29uc3QgZXggPSBnZXRDbGllbnQocG9vbCwgZXhJRClcbiAgY29uc3QgY2hhbktleSA9IGNoYW5EYXRhVG9LZXkoY2hhbm5lbClcblxuICBpZiAoIWV4LmlzU3Vic2NyaWJlZChjaGFubmVsKSkge1xuICAgIGNhcHR1cmUuZXhjZXB0aW9uKFxuICAgICAgJ3RyaWVkIHRvIHVuc3Vic2NyaWJlIGZyb20gbm9uLXN1YnNjcmliZWQgY2hhbm5lbDogJXMgJWonLFxuICAgICAgZXhJRCwgY2hhbm5lbFxuICAgIClcblxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBpZiAoZm9yY2UpIHtcbiAgICBjbGVhclN1YnNjcmlwdGlvblJlZkNvdW50KHBvb2wsIGV4SUQsIGNoYW5LZXkpXG4gIH0gZWxzZSB7XG4gICAgZGVjcmVtZW50U3Vic2NyaXB0aW9uUmVmQ291bnQocG9vbCwgZXhJRCwgY2hhbktleSlcbiAgfVxuXG4gIGNvbnN0IHJlZiA9IGdldFN1YnNjcmlwdGlvblJlZkNvdW50KHBvb2wsIGV4SUQsIGNoYW5LZXkpXG5cbiAgaWYgKHJlZiA9PT0gMCkge1xuICAgIHJldHVybiBleC51bnN1YnNjcmliZShjaGFubmVsKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBleC5nZXRDaGFubmVsSUQoY2hhbm5lbClcbiAgfVxufVxuIl19