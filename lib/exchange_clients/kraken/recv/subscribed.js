'use strict';function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

const chanKeytoData = require('../../../util/chan_key_to_data');
const minutesToInterval = require('../util/minutes_to_interval');

module.exports = (exa, msg) => {
  const { d, pendingSubs, subs, channelMap } = exa;
  const { channelID, pair, subscription } = msg;
  const { name, interval } = subscription;
  const pendingSubKeys = Object.keys(pendingSubs);

  d('subscribed to %s for %s', name, pair);

  let pendingSubMatches;
  let pendingSubData;
  let pendingSubKey;

  for (let i = 0; i < pendingSubKeys.length; i += 1) {
    pendingSubMatches = false;
    pendingSubKey = pendingSubKeys[i];
    pendingSubData = chanKeytoData(pendingSubKey);

    const { type } = pendingSubData;

    if (
    type === 'trades' && name === 'trade' && pair === pendingSubData.symbol ||
    type === 'ticker' && name === 'ticker' && pair === pendingSubData.symbol ||
    type === 'book' && name === 'book' && pair === pendingSubData.symbol)
    {
      pendingSubMatches = true;
    } else if (type === 'candles' && name === 'ohlc') {
      const [, tf, symbol] = pendingSubData.key.split(':');

      if (pair === symbol && minutesToInterval(interval) === tf) {
        pendingSubMatches = true;
      }
    }

    if (pendingSubMatches) {
      pendingSubs[pendingSubKey](channelID);
      subs[pendingSubKey] = channelID;
      channelMap[`${channelID}`] = _objectSpread({},
      subscription, {
        channelID,
        pair });

    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9leGNoYW5nZV9jbGllbnRzL2tyYWtlbi9yZWN2L3N1YnNjcmliZWQuanMiXSwibmFtZXMiOlsiY2hhbktleXRvRGF0YSIsInJlcXVpcmUiLCJtaW51dGVzVG9JbnRlcnZhbCIsIm1vZHVsZSIsImV4cG9ydHMiLCJleGEiLCJtc2ciLCJkIiwicGVuZGluZ1N1YnMiLCJzdWJzIiwiY2hhbm5lbE1hcCIsImNoYW5uZWxJRCIsInBhaXIiLCJzdWJzY3JpcHRpb24iLCJuYW1lIiwiaW50ZXJ2YWwiLCJwZW5kaW5nU3ViS2V5cyIsIk9iamVjdCIsImtleXMiLCJwZW5kaW5nU3ViTWF0Y2hlcyIsInBlbmRpbmdTdWJEYXRhIiwicGVuZGluZ1N1YktleSIsImkiLCJsZW5ndGgiLCJ0eXBlIiwic3ltYm9sIiwidGYiLCJrZXkiLCJzcGxpdCJdLCJtYXBwaW5ncyI6IkFBQUEsYTs7QUFFQSxNQUFNQSxhQUFhLEdBQUdDLE9BQU8sQ0FBQyxnQ0FBRCxDQUE3QjtBQUNBLE1BQU1DLGlCQUFpQixHQUFHRCxPQUFPLENBQUMsNkJBQUQsQ0FBakM7O0FBRUFFLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBYztBQUM3QixRQUFNLEVBQUVDLENBQUYsRUFBS0MsV0FBTCxFQUFrQkMsSUFBbEIsRUFBd0JDLFVBQXhCLEtBQXVDTCxHQUE3QztBQUNBLFFBQU0sRUFBRU0sU0FBRixFQUFhQyxJQUFiLEVBQW1CQyxZQUFuQixLQUFvQ1AsR0FBMUM7QUFDQSxRQUFNLEVBQUVRLElBQUYsRUFBUUMsUUFBUixLQUFxQkYsWUFBM0I7QUFDQSxRQUFNRyxjQUFjLEdBQUdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZVixXQUFaLENBQXZCOztBQUVBRCxFQUFBQSxDQUFDLENBQUMseUJBQUQsRUFBNEJPLElBQTVCLEVBQWtDRixJQUFsQyxDQUFEOztBQUVBLE1BQUlPLGlCQUFKO0FBQ0EsTUFBSUMsY0FBSjtBQUNBLE1BQUlDLGFBQUo7O0FBRUEsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHTixjQUFjLENBQUNPLE1BQW5DLEVBQTJDRCxDQUFDLElBQUksQ0FBaEQsRUFBbUQ7QUFDakRILElBQUFBLGlCQUFpQixHQUFHLEtBQXBCO0FBQ0FFLElBQUFBLGFBQWEsR0FBR0wsY0FBYyxDQUFDTSxDQUFELENBQTlCO0FBQ0FGLElBQUFBLGNBQWMsR0FBR3BCLGFBQWEsQ0FBQ3FCLGFBQUQsQ0FBOUI7O0FBRUEsVUFBTSxFQUFFRyxJQUFGLEtBQVdKLGNBQWpCOztBQUVBO0FBQ0dJLElBQUFBLElBQUksS0FBSyxRQUFULElBQXFCVixJQUFJLEtBQUssT0FBOUIsSUFBeUNGLElBQUksS0FBS1EsY0FBYyxDQUFDSyxNQUFsRTtBQUNDRCxJQUFBQSxJQUFJLEtBQUssUUFBVCxJQUFxQlYsSUFBSSxLQUFLLFFBQTlCLElBQTBDRixJQUFJLEtBQUtRLGNBQWMsQ0FBQ0ssTUFEbkU7QUFFQ0QsSUFBQUEsSUFBSSxLQUFLLE1BQVQsSUFBbUJWLElBQUksS0FBSyxNQUE1QixJQUFzQ0YsSUFBSSxLQUFLUSxjQUFjLENBQUNLLE1BSGpFO0FBSUU7QUFDQU4sTUFBQUEsaUJBQWlCLEdBQUcsSUFBcEI7QUFDRCxLQU5ELE1BTU8sSUFBSUssSUFBSSxLQUFLLFNBQVQsSUFBc0JWLElBQUksS0FBSyxNQUFuQyxFQUEyQztBQUNoRCxZQUFNLEdBQUdZLEVBQUgsRUFBT0QsTUFBUCxJQUFpQkwsY0FBYyxDQUFDTyxHQUFmLENBQW1CQyxLQUFuQixDQUF5QixHQUF6QixDQUF2Qjs7QUFFQSxVQUFJaEIsSUFBSSxLQUFLYSxNQUFULElBQW1CdkIsaUJBQWlCLENBQUNhLFFBQUQsQ0FBakIsS0FBZ0NXLEVBQXZELEVBQTJEO0FBQ3pEUCxRQUFBQSxpQkFBaUIsR0FBRyxJQUFwQjtBQUNEO0FBQ0Y7O0FBRUQsUUFBSUEsaUJBQUosRUFBdUI7QUFDckJYLE1BQUFBLFdBQVcsQ0FBQ2EsYUFBRCxDQUFYLENBQTJCVixTQUEzQjtBQUNBRixNQUFBQSxJQUFJLENBQUNZLGFBQUQsQ0FBSixHQUFzQlYsU0FBdEI7QUFDQUQsTUFBQUEsVUFBVSxDQUFFLEdBQUVDLFNBQVUsRUFBZCxDQUFWO0FBQ0tFLE1BQUFBLFlBREw7QUFFRUYsUUFBQUEsU0FGRjtBQUdFQyxRQUFBQSxJQUhGOztBQUtEO0FBQ0Y7QUFDRixDQTNDRCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBjaGFuS2V5dG9EYXRhID0gcmVxdWlyZSgnLi4vLi4vLi4vdXRpbC9jaGFuX2tleV90b19kYXRhJylcbmNvbnN0IG1pbnV0ZXNUb0ludGVydmFsID0gcmVxdWlyZSgnLi4vdXRpbC9taW51dGVzX3RvX2ludGVydmFsJylcblxubW9kdWxlLmV4cG9ydHMgPSAoZXhhLCBtc2cpID0+IHtcbiAgY29uc3QgeyBkLCBwZW5kaW5nU3Vicywgc3VicywgY2hhbm5lbE1hcCB9ID0gZXhhXG4gIGNvbnN0IHsgY2hhbm5lbElELCBwYWlyLCBzdWJzY3JpcHRpb24gfSA9IG1zZ1xuICBjb25zdCB7IG5hbWUsIGludGVydmFsIH0gPSBzdWJzY3JpcHRpb25cbiAgY29uc3QgcGVuZGluZ1N1YktleXMgPSBPYmplY3Qua2V5cyhwZW5kaW5nU3VicylcblxuICBkKCdzdWJzY3JpYmVkIHRvICVzIGZvciAlcycsIG5hbWUsIHBhaXIpXG5cbiAgbGV0IHBlbmRpbmdTdWJNYXRjaGVzXG4gIGxldCBwZW5kaW5nU3ViRGF0YVxuICBsZXQgcGVuZGluZ1N1YktleVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGVuZGluZ1N1YktleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBwZW5kaW5nU3ViTWF0Y2hlcyA9IGZhbHNlXG4gICAgcGVuZGluZ1N1YktleSA9IHBlbmRpbmdTdWJLZXlzW2ldXG4gICAgcGVuZGluZ1N1YkRhdGEgPSBjaGFuS2V5dG9EYXRhKHBlbmRpbmdTdWJLZXkpXG5cbiAgICBjb25zdCB7IHR5cGUgfSA9IHBlbmRpbmdTdWJEYXRhXG5cbiAgICBpZiAoXG4gICAgICAodHlwZSA9PT0gJ3RyYWRlcycgJiYgbmFtZSA9PT0gJ3RyYWRlJyAmJiBwYWlyID09PSBwZW5kaW5nU3ViRGF0YS5zeW1ib2wpIHx8XG4gICAgICAodHlwZSA9PT0gJ3RpY2tlcicgJiYgbmFtZSA9PT0gJ3RpY2tlcicgJiYgcGFpciA9PT0gcGVuZGluZ1N1YkRhdGEuc3ltYm9sKSB8fFxuICAgICAgKHR5cGUgPT09ICdib29rJyAmJiBuYW1lID09PSAnYm9vaycgJiYgcGFpciA9PT0gcGVuZGluZ1N1YkRhdGEuc3ltYm9sKVxuICAgICkge1xuICAgICAgcGVuZGluZ1N1Yk1hdGNoZXMgPSB0cnVlXG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnY2FuZGxlcycgJiYgbmFtZSA9PT0gJ29obGMnKSB7XG4gICAgICBjb25zdCBbLCB0Ziwgc3ltYm9sXSA9IHBlbmRpbmdTdWJEYXRhLmtleS5zcGxpdCgnOicpXG5cbiAgICAgIGlmIChwYWlyID09PSBzeW1ib2wgJiYgbWludXRlc1RvSW50ZXJ2YWwoaW50ZXJ2YWwpID09PSB0Zikge1xuICAgICAgICBwZW5kaW5nU3ViTWF0Y2hlcyA9IHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocGVuZGluZ1N1Yk1hdGNoZXMpIHtcbiAgICAgIHBlbmRpbmdTdWJzW3BlbmRpbmdTdWJLZXldKGNoYW5uZWxJRClcbiAgICAgIHN1YnNbcGVuZGluZ1N1YktleV0gPSBjaGFubmVsSURcbiAgICAgIGNoYW5uZWxNYXBbYCR7Y2hhbm5lbElEfWBdID0ge1xuICAgICAgICAuLi5zdWJzY3JpcHRpb24sXG4gICAgICAgIGNoYW5uZWxJRCxcbiAgICAgICAgcGFpclxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19