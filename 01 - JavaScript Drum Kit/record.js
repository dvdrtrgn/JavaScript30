/*global lastKey */

var Record = (function () {

  var Index;
  var tempo = 1000 / 8;
  var int_rec;
  var int_play;
  var funky = [75, 76, 75, 65, 70, 74, 71, undefined, 83, undefined,
    72, 76, 74, 76, 76, 71, 74, 83, 76, 71, 75,
    76, 65, 65, 74, 74, 75, 68, 83, undefined, 83, 68, 71, undefined];

  function keyPress(evt) {
    //console.log(evt.keyCode);
    if (evt.keyCode === 8) return Key.delete();
    if (evt.keyCode !== 32) return; // not spacebar?

    if (!int_rec && !Buffer.length) {
      Index = -1;
      int_rec = window.setInterval(Key.record, tempo);
    } else if (!int_play) {
      int_rec = window.clearInterval(int_rec);
      Play.start(Index);
    } else {
      Play.stop();
    }
  }

  function advance() {
    Meter.set(Index);
    Index = (++Index % Buffer.length);
  }

  const Buffer = {
    idx2pct: (num) => Math.min(Math.round(100 * num / Buffer.length), 100),
    pct2idx: (num) => Math.min(Math.round(num / 100 * Buffer.length), Buffer.length),
    arr: funky,
    get length() {
      return Buffer.arr.length;
    },
    get now() {
      return Buffer.arr[Index];
    },
    set now(val) {
      Buffer.arr[Index] = val;
    },
    push: function () {
      Buffer.arr.push.apply(Buffer.arr, arguments);
    },
    clear: function () {
      Buffer.arr.splice(0);
      Meter.focus();
      Meter.set(1);
    },
  };

  const Key = {
    delete: function () {
      Buffer.now = undefined;
    },
    record: function () {
      console.log('listening');
      if (!lastKey && !Buffer.length) return; // trim leading silence
      Buffer.push(lastKey);
      Key.clean(true); // reset
    },
    insert: function () {
      if (!lastKey) return;
      Buffer.now = lastKey;
      Key.clean(true); // reset
    },
    auto: function (key) {
      playSound({
        keyCode: key,
      });
      Key.clean();
    },
    clean: function (bool) {
      if (bool && lastKey) {
        console.log(Index, lastKey, Buffer.length);
      }
      lastKey = undefined;
    },
    bind: function () {
      window.addEventListener('keydown', keyPress);
    },
  };

  const Meter = {
    ele: document.querySelector('#Meter input'),
    del: document.querySelector('#Meter button'),
    set: function (num) {
      Meter.ele.value = Buffer.idx2pct(num || 0);
    },
    read: function () {
      Index = Buffer.pct2idx(Meter.ele.value);
    },
    focus: function () {
      Meter.ele.focus();
    },
    bind: function () {
      Meter.ele.addEventListener('mouseup', Meter.read);
      Meter.del.addEventListener('mouseup', Buffer.clear);
      Meter.set();
    },
  };

  const Play = {
    stop: function () {
      window.clearInterval(int_play);
      int_play = undefined;
    },
    start: function (num) {
      Index = num || 0;
      if (!int_play) {
        int_play = window.setInterval(Play.next, tempo);
      }
    },
    next: function () {
      Key.insert();
      advance();
      if (Buffer.now) {
        Key.auto(Buffer.now);
      }
    },
  };

  const Api = {
    Buffer, Key, Meter, Play,
  };

  Key.bind();
  Meter.bind();

  console.debug(Api);
  return Api;
}());

/*



*/
