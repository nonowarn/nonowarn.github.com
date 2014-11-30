(function (global) {
  "use strict";

  var document   = global.document,
      setTimeout = global.setTimeout;

  function Scanview(el, reversed) {
    this._el         = el;
    this._frames     = el.dataset.frames,
    this._frameSize  = Number(el.dataset.frameSize),
    this._frameCount = Number(el.dataset.frameCount);

    this._frameEls     = [];
    this._index        = 1;
    this._framesLoaded = false;
    this._looping      = false;
    this._smoothed     = false;
    this._image        = null;
    this._reversed     = !!reversed;
  }

  Scanview.paused = function (el) {
    var scanview = new Scanview(el);
    scanview._loadingFrames(function () { scanview.go(0); });
    return scanview;
  };

  Scanview.reversed = function (el) {
    var scanview = new Scanview(el, true);
    scanview._loadingFrames(function () { scanview.go(0); });
    return scanview;
  };

  Scanview.prototype.index = function () {
    return this._index;
  };

  Scanview.prototype.frameCount = function () {
    return this._frameCount;
  };

  Scanview.prototype.frameSize = function () {
    return this._frameSize;
  };

  Scanview.prototype.eachFrame = function (proc) {
    var _this = this;

    _this._loadingFrames(function () {
      _this._frameEls.forEach(proc);
    });
  };

  Scanview.prototype.loop = function (fps) {
    var _this = this,
        interval = 1000 / (fps || 20);

    _this._loadingFrames(function () {
      if (_this._looping) {
        return;
      }

      _this._looping = true;

      setTimeout(function update() {
        nextFrame();
        setTimeout(update, interval);
      }, interval);

      function nextFrame() {
        _this.go((_this._index + 1) % _this._frameCount);
      }
    });
  };

  Scanview.prototype.go = function (index) {
    if (index < 0 || index >= this._frameCount || index === this._index) {
      return;
    }

    if (this._smoothed) {
      this._frameEls[0].style.backgroundPosition = this._bgAt(index);
    } else {
      this._frameEls[this._index].style.zIndex = -1;
      this._frameEls[index].style.zIndex       = 1;
    }

    this._index = index;
  };

  Scanview.prototype.smooth = function () {
    var _this = this;

    _this._smoothed = true;
    _this._loadingFrames(function () {
      _this._frameEls[0].style.zIndex = 10;
      _this._frameEls[0].style.backgroundPosition = _this._bgAt(_this._index);
    });
  };

  Scanview.prototype.unsmooth = function () {
    var _this = this;
    _this._smoothed = false;

    _this._loadingFrames(function () {
      _this._frameEls[_this._index].style.zIndex  = 1;
      _this._frameEls[0].style.zIndex             = -1;
      _this._frameEls[0].style.backgroundPosition = _this._bgAt(0);
    });
  };

  Scanview.prototype.goNext = function () {
    this.go(this._index + 1);
  };

  Scanview.prototype.goPrev = function () {
    this.go(this._index - 1);
  };

  Scanview.prototype._loadingFrames = function (cb) {
    var _this = this;

    if (_this._framesLoaded) {
      setTimeout(cb, 0);
      return;
    }

    if (_this._image) {
      _this._image.addEventListener("load", cb, false);
    } else {
      _this._image = new Image();
      _this._image.addEventListener("load", function () {
        var i, frame;

        for (i = 0; i < _this._frameCount; ++i) {
          frame = document.createElement("div");

          frame.style.width              = String(_this._frameSize) + "px";
          frame.style.height             = String(_this._frameSize) + "px";
          frame.style.position           = "absolute";
          frame.style.top                = "0px";
          frame.style.bottom             = "0px";
          frame.style.backgroundImage    = "url("+_this._frames+")";
          frame.style.backgroundPosition = _this._bgAt(i);
          frame.style.backgroundSize     = "auto " + String(_this._frameSize) + "px";

          _this._el.appendChild(frame);
          _this._frameEls.push(frame);
        }

        _this._framesLoaded = true;

        cb();
      }, false);

      _this._image.src = _this._frames;
    }
  };

  Scanview.prototype._bgAt = function (i) {
    if (this._reversed) {
      i = this._frameCount - (i + 1);
    }
    return "-" + (i * this._frameSize) + "px 0";
  };

  global.Scanview = Scanview;

})(this);
