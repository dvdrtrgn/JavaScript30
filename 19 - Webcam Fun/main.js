'use strict';

require.config({
  baseUrl: '.',
  paths: {
    lib: '../libs/',
  },
});

function init($, Ival, V) {

  var cfg = {
    _: 'init()',
    $play: $('button.play'),
    $photo: $('canvas.photo'),
    $video: $('video.player'),
    $snap: $('button.shot'),
    interval: Ival.create($.noop, 999),
    cameraObj: null,
    canvasObj: null,
  };

  cfg.cameraObj = V.pipeCameraTo(cfg.$video);

  cfg.$video.addEventListener('canplay', evt => {
    if (!cfg.canvasObj) {
      cfg.canvasObj = V.video2canvas(cfg.$video, cfg.$photo);
      cfg.interval.setAction(cfg.canvasObj.draw);
    }
  });

  cfg.$play.addEventListener('click', evt => {
    if (!cfg.cameraObj.playing) {
      cfg.cameraObj.start();
    } else {
      cfg.cameraObj.stop();
    }
  });

  cfg.$snap.setAttribute('onclick', '');
  cfg.$snap.addEventListener('click', evt => {
    let name = `snapCanvas@${Date.now()}`;
    cfg[name] = V.snapCanvas(cfg.$photo, name);
    console.log(cfg);
  });

  window.drt = cfg;
  return cfg;
}

require(['lib/util', 'lib/interval', 'vid'], init);
