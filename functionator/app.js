;(function (win, doc, undefined) {
  "use strict";

  var target = doc.getElementById("target"),
      result = doc.getElementById("result"),
      menu = doc.getElementById("menu"),
      tip = doc.getElementById("tip"),
      startTime = null,
      gameEnded = false;

  function formatTime(ms) {
    return Math.floor(ms/1000) + "." + (ms%1000) + "sec";
  }

  function tweetScore(score) {
    var text = encodeURIComponent("Functionator " + score),
        url = encodeURIComponent("http://nonowarn.jp/functionator");
    return "https://platform.twitter.com/widgets/tweet_button.html?count=none&text="
      + text + "&url=" + url + "&size=l";
  }

  function retryWith(clear) {
    result.className = "";
    menu.className = "";
    tip.className = "";
    startTime = null;
    gameEnded = false;
    clear();
    return false;
  }

  function clearTarget() {
    var removeChar = function () {
      setTimeout(function () {
        target.value = target.value.replace(/.$/, "");
        if (target.value === "") {
          target.disabled = false;
          target.focus();
        } else {
          removeChar();
        }
      }, 30);
    };
    removeChar();
  }

  function clearTargetImmediately() {
    target.value = "";
    target.disabled = false;
    target.focus();
  }

  target.addEventListener("keydown", function (e) {
    if (startTime === null) {
      startTime = Date.now();
    }
  }, false);

  // Change doesn't fire until enter key pressed
  target.addEventListener("keyup", function (e) {
    if (startTime !== null && target.value === "function" && !gameEnded) {
      var endTime = Date.now(),
          record = endTime - startTime,
          formattedRecord = formatTime(record);
      target.disabled = true;
      target.blur();
      result.className = "visible";
      result.innerHTML = formattedRecord;
      gameEnded = true;

      var tweetButtonFrame = menu.querySelector(".tweet-button");
      tweetButtonFrame.onload = function () {
        setTimeout(function () {
          menu.className = "visible";
          tip.className = "visible";
        }, 500);
      };
      tweetButtonFrame.src = tweetScore(formattedRecord);
    }
  }, false);

  retry.addEventListener("click", function (e) {
    return retryWith(clearTarget);
  }, false);

  // On game was ended and pressed 'r' w/o modifiers, restart game immediately
  win.addEventListener("keydown", function (e) {
    if (gameEnded && e.which === 82 && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      retryWith(clearTargetImmediately);
    }
  }, false);

}(this, document));
