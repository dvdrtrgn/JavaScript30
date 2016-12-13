var Record = (function () {

  var recording;
  var playing;
  var buffer = [];
  var index = -1;

  function hitSpace(e) {
    if (e.keyCode !== 32) return;

    if (!buffer.length) {
      recording = window.setInterval(recordKey, 100);
    } else if (!playing) {
      window.clearInterval(recording);
      startPlaying();
    } else {
      stopPlaying();
    }
    console.log(buffer);
  }

  function playNext() {
    insertKey();
    index = (++index % buffer.length);
    if (buffer[index]) {
      autoKey(buffer[index]);
    }
  }

  function recordKey() {
    if (!lastKey && !buffer.length) return;
    // trims leading silence

    buffer.push(lastKey);
    cleanKey(); // reset
  }

  function insertKey() {
    if (!lastKey) return;
    buffer[index] = lastKey;
    cleanKey(); // reset
  }

  function autoKey(key) {
    playSound({
      keyCode: key,
    });
    cleanKey();
  }

  function stopPlaying() {
    window.clearInterval(playing);
    playing = undefined;
  }

  function startPlaying(num) {
    index = num || -1;
    if (!playing) {
      playing = window.setInterval(playNext, 100);
    }
  }

  function cleanKey() {
    if (lastKey) console.log(lastKey);
    lastKey = undefined;
  }

  window.addEventListener('keydown', hitSpace);

  return {
    addToBuffer: (...arr) => buffer.push(...arr),
  };
}());

// cool beat
// [75, 76, 75, 65, 70, 74, 71, undefined, 83, undefined, 72, 76, 74, 76, 76, 71, 74, 83, 76, 71, 75, 76, 65, 65, 74, 74, 75, 68, 83, undefined, 83, 68, 71, undefined]
/*

progress bar show how far the buffer pointer is

*/
