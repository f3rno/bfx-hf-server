'use strict';

const _includes = require('lodash/includes');

/**
                                               * @param {string[][]} symbolsByContext - [exchangeSymbols, marginSymbols]
                                               * @param {string} sym - symbol to generate market object for
                                               * @returns {object} - market
                                               */
module.exports = (symbolsByContext, sym) => {
  const c = [];

  if (_includes(symbolsByContext[0], sym)) {
    c.push('e');
  }

  if (_includes(symbolsByContext[1], sym)) {
    c.push('m');
  }

  if (_includes(symbolsByContext[2], sym)) {
    c.push('f');
  }

  const b = sym.match(/:/) ? sym.split(':')[0] : sym.substring(0, 3);
  const q = sym.match(/:/) ? sym.split(':')[1] : sym.substring(3);

  return {
    c,
    b,
    q,
    u: `${b}/${q}`,
    r: `t${sym}`,
    w: `t${sym}` };

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9leGNoYW5nZV9jbGllbnRzL2JpdGZpbmV4L3RyYW5zZm9ybWVycy9zeW1ib2wuanMiXSwibmFtZXMiOlsiX2luY2x1ZGVzIiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJzeW1ib2xzQnlDb250ZXh0Iiwic3ltIiwiYyIsInB1c2giLCJiIiwibWF0Y2giLCJzcGxpdCIsInN1YnN0cmluZyIsInEiLCJ1IiwiciIsInciXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU1BLFNBQVMsR0FBR0MsT0FBTyxDQUFDLGlCQUFELENBQXpCOztBQUVBOzs7OztBQUtBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUIsQ0FBQ0MsZ0JBQUQsRUFBbUJDLEdBQW5CLEtBQTJCO0FBQzFDLFFBQU1DLENBQUMsR0FBRyxFQUFWOztBQUVBLE1BQUlOLFNBQVMsQ0FBQ0ksZ0JBQWdCLENBQUMsQ0FBRCxDQUFqQixFQUFzQkMsR0FBdEIsQ0FBYixFQUF5QztBQUN2Q0MsSUFBQUEsQ0FBQyxDQUFDQyxJQUFGLENBQU8sR0FBUDtBQUNEOztBQUVELE1BQUlQLFNBQVMsQ0FBQ0ksZ0JBQWdCLENBQUMsQ0FBRCxDQUFqQixFQUFzQkMsR0FBdEIsQ0FBYixFQUF5QztBQUN2Q0MsSUFBQUEsQ0FBQyxDQUFDQyxJQUFGLENBQU8sR0FBUDtBQUNEOztBQUVELE1BQUlQLFNBQVMsQ0FBQ0ksZ0JBQWdCLENBQUMsQ0FBRCxDQUFqQixFQUFzQkMsR0FBdEIsQ0FBYixFQUF5QztBQUN2Q0MsSUFBQUEsQ0FBQyxDQUFDQyxJQUFGLENBQU8sR0FBUDtBQUNEOztBQUVELFFBQU1DLENBQUMsR0FBR0gsR0FBRyxDQUFDSSxLQUFKLENBQVUsR0FBVixJQUFpQkosR0FBRyxDQUFDSyxLQUFKLENBQVUsR0FBVixFQUFlLENBQWYsQ0FBakIsR0FBcUNMLEdBQUcsQ0FBQ00sU0FBSixDQUFjLENBQWQsRUFBaUIsQ0FBakIsQ0FBL0M7QUFDQSxRQUFNQyxDQUFDLEdBQUdQLEdBQUcsQ0FBQ0ksS0FBSixDQUFVLEdBQVYsSUFBaUJKLEdBQUcsQ0FBQ0ssS0FBSixDQUFVLEdBQVYsRUFBZSxDQUFmLENBQWpCLEdBQXFDTCxHQUFHLENBQUNNLFNBQUosQ0FBYyxDQUFkLENBQS9DOztBQUVBLFNBQU87QUFDTEwsSUFBQUEsQ0FESztBQUVMRSxJQUFBQSxDQUZLO0FBR0xJLElBQUFBLENBSEs7QUFJTEMsSUFBQUEsQ0FBQyxFQUFHLEdBQUVMLENBQUUsSUFBR0ksQ0FBRSxFQUpSO0FBS0xFLElBQUFBLENBQUMsRUFBRyxJQUFHVCxHQUFJLEVBTE47QUFNTFUsSUFBQUEsQ0FBQyxFQUFHLElBQUdWLEdBQUksRUFOTixFQUFQOztBQVFELENBMUJEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IF9pbmNsdWRlcyA9IHJlcXVpcmUoJ2xvZGFzaC9pbmNsdWRlcycpXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmdbXVtdfSBzeW1ib2xzQnlDb250ZXh0IC0gW2V4Y2hhbmdlU3ltYm9scywgbWFyZ2luU3ltYm9sc11cbiAqIEBwYXJhbSB7c3RyaW5nfSBzeW0gLSBzeW1ib2wgdG8gZ2VuZXJhdGUgbWFya2V0IG9iamVjdCBmb3JcbiAqIEByZXR1cm5zIHtvYmplY3R9IC0gbWFya2V0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gKHN5bWJvbHNCeUNvbnRleHQsIHN5bSkgPT4ge1xuICBjb25zdCBjID0gW11cblxuICBpZiAoX2luY2x1ZGVzKHN5bWJvbHNCeUNvbnRleHRbMF0sIHN5bSkpIHtcbiAgICBjLnB1c2goJ2UnKVxuICB9XG5cbiAgaWYgKF9pbmNsdWRlcyhzeW1ib2xzQnlDb250ZXh0WzFdLCBzeW0pKSB7XG4gICAgYy5wdXNoKCdtJylcbiAgfVxuXG4gIGlmIChfaW5jbHVkZXMoc3ltYm9sc0J5Q29udGV4dFsyXSwgc3ltKSkge1xuICAgIGMucHVzaCgnZicpXG4gIH1cblxuICBjb25zdCBiID0gc3ltLm1hdGNoKC86LykgPyBzeW0uc3BsaXQoJzonKVswXSA6IHN5bS5zdWJzdHJpbmcoMCwgMylcbiAgY29uc3QgcSA9IHN5bS5tYXRjaCgvOi8pID8gc3ltLnNwbGl0KCc6JylbMV0gOiBzeW0uc3Vic3RyaW5nKDMpXG5cbiAgcmV0dXJuIHtcbiAgICBjLFxuICAgIGIsXG4gICAgcSxcbiAgICB1OiBgJHtifS8ke3F9YCxcbiAgICByOiBgdCR7c3ltfWAsXG4gICAgdzogYHQke3N5bX1gXG4gIH1cbn1cbiJdfQ==