'use strict';

require.config({
  baseUrl: '../libs',
  paths: {
    lodash: '../vendors/lodash.js/lodash',
  },
  shim: {
    foo: {
      deps: ['lodash'],
      exports: 'Foo',
    },
  },
});

function init($, V) {
  var cfg = {
    _: 'init()',
    $play: $('button.play'),
    $photo: $('canvas.photo'),
    $video: $('video.player'),
    $snap: $('button.shot'),
  };

  cfg.camera2video = V.camera2video(cfg.$video);

  cfg.$video.addEventListener('canplay', evt => {
    if (!cfg.video2canvas) {
      cfg.video2canvas = V.video2canvas(cfg.$video, cfg.$photo);
    }
  });

  cfg.$play.addEventListener('click', evt => {
    if (!cfg.camera2video.playing) {
      cfg.camera2video.start();
    } else {
      cfg.camera2video.stop();
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

require(['./util', './vid'], init);
