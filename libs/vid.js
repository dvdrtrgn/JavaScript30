define(['util'], function ($) {

  function pipeCameraTo(_video = {}) {
    if (_video.tagName !== 'VIDEO') {
      throw Error('Pipes only to video elements');
    }
    var self = {
      stop: foo => {
        self.stream.getTracks().map(x => x.stop());
        self.playing = false;
        _video.src = '';
        return self;
      },
      pipe: stream => {
        self.stream = stream;
        self.source = window.URL.createObjectURL(stream);
        self.playing = true;
        _video.src = self.source;
        _video.play();
        return self;
      },
      start: foo => {
        navigator.mediaDevices.getUserMedia({
          video: true,
        }).then(self.pipe).catch(err => console.error(err));
        return self;
      },
    };

    return self.start();
  }

  function video2canvas(_video, _canvas) {
    var context, height, width;

    context = _canvas.getContext('2d');
    height = _canvas.height = _video.videoHeight;
    width = _canvas.width = _video.videoWidth;
    _video.hidden = true;

    return {
      _: 'video2canvas',
      _video, _canvas, context, height, width,
      draw: foo => {
        context.drawImage(_video, 0, 0, width, height);
      },
    };
  }

  function snapCanvas(_canvas, _blurb) {
    var data, link;

    data = _canvas.toDataURL('image/jpeg');
    link = document.createElement('a');

    link.href = data;
    link.setAttribute('download', _blurb);
    link.innerHTML = `<image src="${data}" alt="${_blurb}" width=100>`;

    $('body').insertBefore(link, $('body').firstChild);

    return {
      _: 'snapCanvas',
      _canvas, _blurb, data, link,
    };
  }

  return {
    pipeCameraTo,
    video2canvas,
    snapCanvas,
  };
});
