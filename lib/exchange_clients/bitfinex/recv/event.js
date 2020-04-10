'use strict';function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

const chanKeytoData = require('../../../util/chan_key_to_data');

/**
                                                                  * Notifies pending subscription promises of resolved chanID for 'subscribed'
                                                                  * events.
                                                                  *
                                                                  * @param {object} exa - exchange adapter
                                                                  * @param {object} msg - incoming ws2 message
                                                                  */
module.exports = (exa, msg) => {
  const { pendingSubs, subs, channelMap } = exa;
  const { event: eventName } = msg;

  if (eventName !== 'subscribed') {
    return;
  }

  const pendingSubsKeys = Object.keys(pendingSubs);

  let pendingSubMatches;
  let pendingSubData;
  let pendingSubKeys;
  let key;

  for (let i = 0; i < pendingSubsKeys.length; i += 1) {
    pendingSubMatches = true;
    pendingSubData = chanKeytoData(pendingSubsKeys[i]);
    pendingSubKeys = Object.keys(pendingSubData);

    for (let j = 0; j < pendingSubKeys.length; j += 1) {
      key = pendingSubKeys[j];

      if (key === 'type' && pendingSubData[key] !== msg.channel) {
        pendingSubMatches = false;
        break;
      }

      if (key === 'type') {
        continue;
      }

      if (msg[key] !== pendingSubData[key]) {
        pendingSubMatches = false;
        break;
      }
    }

    if (pendingSubMatches) {
      subs[pendingSubsKeys[i]] = msg.chanId; // NOTE: assigned multiple times

      channelMap[`${msg.chanId}`] = _objectSpread({},
      msg, {
        market: pendingSubs[pendingSubsKeys[i]][0] });


      pendingSubs[pendingSubsKeys[i]][1](msg.chanId);
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9leGNoYW5nZV9jbGllbnRzL2JpdGZpbmV4L3JlY3YvZXZlbnQuanMiXSwibmFtZXMiOlsiY2hhbktleXRvRGF0YSIsInJlcXVpcmUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZXhhIiwibXNnIiwicGVuZGluZ1N1YnMiLCJzdWJzIiwiY2hhbm5lbE1hcCIsImV2ZW50IiwiZXZlbnROYW1lIiwicGVuZGluZ1N1YnNLZXlzIiwiT2JqZWN0Iiwia2V5cyIsInBlbmRpbmdTdWJNYXRjaGVzIiwicGVuZGluZ1N1YkRhdGEiLCJwZW5kaW5nU3ViS2V5cyIsImtleSIsImkiLCJsZW5ndGgiLCJqIiwiY2hhbm5lbCIsImNoYW5JZCIsIm1hcmtldCJdLCJtYXBwaW5ncyI6IkFBQUEsYTs7QUFFQSxNQUFNQSxhQUFhLEdBQUdDLE9BQU8sQ0FBQyxnQ0FBRCxDQUE3Qjs7QUFFQTs7Ozs7OztBQU9BQyxNQUFNLENBQUNDLE9BQVAsR0FBaUIsQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWM7QUFDN0IsUUFBTSxFQUFFQyxXQUFGLEVBQWVDLElBQWYsRUFBcUJDLFVBQXJCLEtBQW9DSixHQUExQztBQUNBLFFBQU0sRUFBRUssS0FBSyxFQUFFQyxTQUFULEtBQXVCTCxHQUE3Qjs7QUFFQSxNQUFJSyxTQUFTLEtBQUssWUFBbEIsRUFBZ0M7QUFDOUI7QUFDRDs7QUFFRCxRQUFNQyxlQUFlLEdBQUdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZUCxXQUFaLENBQXhCOztBQUVBLE1BQUlRLGlCQUFKO0FBQ0EsTUFBSUMsY0FBSjtBQUNBLE1BQUlDLGNBQUo7QUFDQSxNQUFJQyxHQUFKOztBQUVBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1AsZUFBZSxDQUFDUSxNQUFwQyxFQUE0Q0QsQ0FBQyxJQUFJLENBQWpELEVBQW9EO0FBQ2xESixJQUFBQSxpQkFBaUIsR0FBRyxJQUFwQjtBQUNBQyxJQUFBQSxjQUFjLEdBQUdmLGFBQWEsQ0FBQ1csZUFBZSxDQUFDTyxDQUFELENBQWhCLENBQTlCO0FBQ0FGLElBQUFBLGNBQWMsR0FBR0osTUFBTSxDQUFDQyxJQUFQLENBQVlFLGNBQVosQ0FBakI7O0FBRUEsU0FBSyxJQUFJSyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSixjQUFjLENBQUNHLE1BQW5DLEVBQTJDQyxDQUFDLElBQUksQ0FBaEQsRUFBbUQ7QUFDakRILE1BQUFBLEdBQUcsR0FBR0QsY0FBYyxDQUFDSSxDQUFELENBQXBCOztBQUVBLFVBQUlILEdBQUcsS0FBSyxNQUFSLElBQWtCRixjQUFjLENBQUNFLEdBQUQsQ0FBZCxLQUF3QlosR0FBRyxDQUFDZ0IsT0FBbEQsRUFBMkQ7QUFDekRQLFFBQUFBLGlCQUFpQixHQUFHLEtBQXBCO0FBQ0E7QUFDRDs7QUFFRCxVQUFJRyxHQUFHLEtBQUssTUFBWixFQUFvQjtBQUNsQjtBQUNEOztBQUVELFVBQUlaLEdBQUcsQ0FBQ1ksR0FBRCxDQUFILEtBQWFGLGNBQWMsQ0FBQ0UsR0FBRCxDQUEvQixFQUFzQztBQUNwQ0gsUUFBQUEsaUJBQWlCLEdBQUcsS0FBcEI7QUFDQTtBQUNEO0FBQ0Y7O0FBRUQsUUFBSUEsaUJBQUosRUFBdUI7QUFDckJQLE1BQUFBLElBQUksQ0FBQ0ksZUFBZSxDQUFDTyxDQUFELENBQWhCLENBQUosR0FBMkJiLEdBQUcsQ0FBQ2lCLE1BQS9CLENBRHFCLENBQ2lCOztBQUV0Q2QsTUFBQUEsVUFBVSxDQUFFLEdBQUVILEdBQUcsQ0FBQ2lCLE1BQU8sRUFBZixDQUFWO0FBQ0tqQixNQUFBQSxHQURMO0FBRUVrQixRQUFBQSxNQUFNLEVBQUVqQixXQUFXLENBQUNLLGVBQWUsQ0FBQ08sQ0FBRCxDQUFoQixDQUFYLENBQWdDLENBQWhDLENBRlY7OztBQUtBWixNQUFBQSxXQUFXLENBQUNLLGVBQWUsQ0FBQ08sQ0FBRCxDQUFoQixDQUFYLENBQWdDLENBQWhDLEVBQW1DYixHQUFHLENBQUNpQixNQUF2QztBQUNEO0FBQ0Y7QUFDRixDQWpERCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBjaGFuS2V5dG9EYXRhID0gcmVxdWlyZSgnLi4vLi4vLi4vdXRpbC9jaGFuX2tleV90b19kYXRhJylcblxuLyoqXG4gKiBOb3RpZmllcyBwZW5kaW5nIHN1YnNjcmlwdGlvbiBwcm9taXNlcyBvZiByZXNvbHZlZCBjaGFuSUQgZm9yICdzdWJzY3JpYmVkJ1xuICogZXZlbnRzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBleGEgLSBleGNoYW5nZSBhZGFwdGVyXG4gKiBAcGFyYW0ge29iamVjdH0gbXNnIC0gaW5jb21pbmcgd3MyIG1lc3NhZ2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZXhhLCBtc2cpID0+IHtcbiAgY29uc3QgeyBwZW5kaW5nU3Vicywgc3VicywgY2hhbm5lbE1hcCB9ID0gZXhhXG4gIGNvbnN0IHsgZXZlbnQ6IGV2ZW50TmFtZSB9ID0gbXNnXG5cbiAgaWYgKGV2ZW50TmFtZSAhPT0gJ3N1YnNjcmliZWQnKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCBwZW5kaW5nU3Vic0tleXMgPSBPYmplY3Qua2V5cyhwZW5kaW5nU3VicylcblxuICBsZXQgcGVuZGluZ1N1Yk1hdGNoZXNcbiAgbGV0IHBlbmRpbmdTdWJEYXRhXG4gIGxldCBwZW5kaW5nU3ViS2V5c1xuICBsZXQga2V5XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZW5kaW5nU3Vic0tleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBwZW5kaW5nU3ViTWF0Y2hlcyA9IHRydWVcbiAgICBwZW5kaW5nU3ViRGF0YSA9IGNoYW5LZXl0b0RhdGEocGVuZGluZ1N1YnNLZXlzW2ldKVxuICAgIHBlbmRpbmdTdWJLZXlzID0gT2JqZWN0LmtleXMocGVuZGluZ1N1YkRhdGEpXG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBlbmRpbmdTdWJLZXlzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICBrZXkgPSBwZW5kaW5nU3ViS2V5c1tqXVxuXG4gICAgICBpZiAoa2V5ID09PSAndHlwZScgJiYgcGVuZGluZ1N1YkRhdGFba2V5XSAhPT0gbXNnLmNoYW5uZWwpIHtcbiAgICAgICAgcGVuZGluZ1N1Yk1hdGNoZXMgPSBmYWxzZVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBpZiAoa2V5ID09PSAndHlwZScpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKG1zZ1trZXldICE9PSBwZW5kaW5nU3ViRGF0YVtrZXldKSB7XG4gICAgICAgIHBlbmRpbmdTdWJNYXRjaGVzID0gZmFsc2VcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocGVuZGluZ1N1Yk1hdGNoZXMpIHtcbiAgICAgIHN1YnNbcGVuZGluZ1N1YnNLZXlzW2ldXSA9IG1zZy5jaGFuSWQgLy8gTk9URTogYXNzaWduZWQgbXVsdGlwbGUgdGltZXNcblxuICAgICAgY2hhbm5lbE1hcFtgJHttc2cuY2hhbklkfWBdID0ge1xuICAgICAgICAuLi5tc2csXG4gICAgICAgIG1hcmtldDogcGVuZGluZ1N1YnNbcGVuZGluZ1N1YnNLZXlzW2ldXVswXVxuICAgICAgfVxuXG4gICAgICBwZW5kaW5nU3Vic1twZW5kaW5nU3Vic0tleXNbaV1dWzFdKG1zZy5jaGFuSWQpXG4gICAgfVxuICB9XG59XG4iXX0=