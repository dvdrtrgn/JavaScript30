define(['lib/util'], {
  create: function (_fn, _ms, _once) {
    var count, interval, action, rate, self;

    function _clear() {
      interval = window.clearInterval(interval);
    }

    function _makeInterval(once) {
      interval = window.setInterval((foo) => {
        if (once && count) return _clear();
        count++;
        action(foo);
      }, rate > 9 ? rate : 99);
    }

    function _reload() {
      _clear();
      _makeInterval();
    }

    function _create(fn, ms, once) {
      count = 0;
      _clear();
      setAction(fn);
      setRate(ms);
      _makeInterval(once);
      return self;
    }
    /*

    PUBLIC

    */
    function setAction(fn) {
      action = fn;
    }

    function setRate(ms) {
      rate = ms;
      if (interval) _reload();
    }

    function start() {
      _reload();
    }

    function stop() {
      _clear();
    }

    self = Object.create({
      get count() {
        return count;
      },
      setAction,
      setRate,
      start,
      stop,
    });

    return _create(_fn, _ms, _once);
  }
});
