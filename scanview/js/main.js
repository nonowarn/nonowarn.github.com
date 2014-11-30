(function (window) {
  var FRAME_Z_MARGIN = 130;

  var se3El = window.document.getElementById("se3"),
      se5El = window.document.getElementById("se5");

  initScanview(se3El);
  initScanview(se5El, true);

  function initScanview(el, reverse) {
    var sv = reverse ? window.Scanview.reversed(el) : window.Scanview.paused(el),
        expanded = false,
        pageX  = inPage("offsetLeft"),
        pageY  = inPage("offsetTop");

    sv.smooth();

    el.addEventListener("click", function (e) {
      if (expanded) {
        shrink();
      } else {
        expand();
      }

      expanded = !expanded;
    }, true);

    el.addEventListener("mousemove", (function () {
      var wait = false;

      return function (e) {
        if (expanded || wait) {
          return;
        }

        setTimeout(function () {
          wait = false;
        }, 50);

        wait = true;

        var x = e.pageX - pageX,
            y = e.pageY - pageY,
            nextIndex = ~~(y / sv.frameSize() * sv.frameCount());

        sv.go(nextIndex);
      };
    })(), true);

    function expand() {
      sv.unsmooth();

      el.classList.add("rotate");

      sv.eachFrame(function (frameEl, i) {
        frameEl.style.transform = frameEl.style.webkitTransform =
          "translateZ("
          + String(FRAME_Z_MARGIN * (sv.index() - i))
          + "px)";
      });
    }

    function shrink() {
      sv.smooth();

      el.classList.remove("rotate");

      sv.eachFrame(function (frameEl, i) {
        frameEl.style.transform = frameEl.style.webkitTransform = "none";
      });
    }

    function inPage(prop) {
      var current = el,
          value = 0;

      while (current) {
        value += current[prop];
        current = current.offsetParent;
      }

      return value;
    }
  }
})(this);
