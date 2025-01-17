_extra.registerModule(
  "xprefWakeLock",
  ["slideObjectManager_global", "utils"],
  function() {
    "use strict";

    ////////////////////////////////////////
    ////////// NO SLEEP
    ////////////////////////////////////////
    /*! NoSleep.min.js v0.11.0 - git.io/vfn01 - Rich Tibbett - MIT license */

    function localLog(message) {
      //console.log(message);
    }

    function initNoSleep() {
      !(function(A, e) {
        "object" == typeof exports && "object" == typeof module
          ? (module.exports = e())
          : "function" == typeof define && define.amd
          ? define([], e)
          : "object" == typeof exports
          ? (exports.NoSleep = e())
          : (A.NoSleep = e());
      })(window, function() {
        return (function(A) {
          var e = {};

          function o(n) {
            if (e[n]) return e[n].exports;
            var t = (e[n] = {
              i: n,
              l: !1,
              exports: {}
            });
            return A[n].call(t.exports, t, t.exports, o), (t.l = !0), t.exports;
          }
          return (
            (o.m = A),
            (o.c = e),
            (o.d = function(A, e, n) {
              o.o(A, e) ||
                Object.defineProperty(A, e, {
                  enumerable: !0,
                  get: n
                });
            }),
            (o.r = function(A) {
              "undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(A, Symbol.toStringTag, {
                  value: "Module"
                }),
                Object.defineProperty(A, "__esModule", {
                  value: !0
                });
            }),
            (o.t = function(A, e) {
              if ((1 & e && (A = o(A)), 8 & e)) return A;
              if (4 & e && "object" == typeof A && A && A.__esModule) return A;
              var n = Object.create(null);
              if (
                (o.r(n),
                Object.defineProperty(n, "default", {
                  enumerable: !0,
                  value: A
                }),
                2 & e && "string" != typeof A)
              )
                for (var t in A)
                  o.d(
                    n,
                    t,
                    function(e) {
                      return A[e];
                    }.bind(null, t)
                  );
              return n;
            }),
            (o.n = function(A) {
              var e =
                A && A.__esModule
                  ? function() {
                      return A.default;
                    }
                  : function() {
                      return A;
                    };
              return o.d(e, "a", e), e;
            }),
            (o.o = function(A, e) {
              return Object.prototype.hasOwnProperty.call(A, e);
            }),
            (o.p = ""),
            o((o.s = 0))
          );
        })([
          function(A, e, o) {
            "use strict";
            var n = (function() {
              function A(A, e) {
                for (var o = 0; o < e.length; o++) {
                  var n = e[o];
                  (n.enumerable = n.enumerable || !1),
                    (n.configurable = !0),
                    "value" in n && (n.writable = !0),
                    Object.defineProperty(A, n.key, n);
                }
              }
              return function(e, o, n) {
                return o && A(e.prototype, o), n && A(e, n), e;
              };
            })();
            var t = o(1),
              B = t.webm,
              Q = t.mp4,
              c =
                "undefined" != typeof navigator &&
                parseFloat(
                  (
                    "" +
                    (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(
                      navigator.userAgent
                    ) || [0, ""])[1]
                  )
                    .replace("undefined", "3_2")
                    .replace("_", ".")
                    .replace("_", "")
                ) < 10 &&
                !window.MSStream,
              i = "wakeLock" in navigator,
              a = (function() {
                function A() {
                  var e = this;
                  if (
                    ((function(A, e) {
                      if (!(A instanceof e))
                        throw new TypeError(
                          "Cannot call a class as a function"
                        );
                    })(this, A),
                    i)
                  ) {
                    this._wakeLock = null;
                    var o = function() {
                      null !== e._wakeLock &&
                        "visible" === document.visibilityState &&
                        e.enable();
                    };
                    document.addEventListener("visibilitychange", o),
                      document.addEventListener("fullscreenchange", o);
                  } else
                    c
                      ? (this.noSleepTimer = null)
                      : ((this.noSleepVideo = document.createElement("video")),
                        this.noSleepVideo.setAttribute("title", "No Sleep"),
                        this.noSleepVideo.setAttribute("playsinline", ""),
                        this._addSourceToVideo(this.noSleepVideo, "webm", B),
                        this._addSourceToVideo(this.noSleepVideo, "mp4", Q),
                        this.noSleepVideo.addEventListener(
                          "loadedmetadata",
                          function() {
                            e.noSleepVideo.duration <= 1
                              ? e.noSleepVideo.setAttribute("loop", "")
                              : e.noSleepVideo.addEventListener(
                                  "timeupdate",
                                  function() {
                                    e.noSleepVideo.currentTime > 0.5 &&
                                      (e.noSleepVideo.currentTime = Math.random());
                                  }
                                );
                          }
                        ));
                }
                return (
                  n(A, [
                    {
                      key: "_addSourceToVideo",
                      value: function(A, e, o) {
                        var n = document.createElement("source");
                        (n.src = o), (n.type = "video/" + e), A.appendChild(n);
                      }
                    },
                    {
                      key: "enable",
                      value: function() {
                        var A = this;
                        i
                          ? navigator.wakeLock
                              .request("screen")
                              .then(function(e) {
                                (A._wakeLock = e),
                                  localLog("Wake Lock active."),
                                  A._wakeLock.addEventListener(
                                    "release",
                                    function() {
                                      localLog("Wake Lock released.");
                                    }
                                  );
                              })
                              .catch(function(A) {
                                console.error(A.name + ", " + A.message);
                              })
                          : c
                          ? (this.disable(),
                            console.warn(
                              "\n        NoSleep enabled for older iOS devices. This can interrupt\n        active or long-running network requests from completing successfully.\n        See https://github.com/richtr/NoSleep.js/issues/15 for more details.\n      "
                            ),
                            (this.noSleepTimer = window.setInterval(function() {
                              document.hidden ||
                                ((window.location.href = window.location.href.split(
                                  "#"
                                )[0]),
                                window.setTimeout(window.stop, 0));
                            }, 15e3)))
                          : this.noSleepVideo.play();
                      }
                    },
                    {
                      key: "disable",
                      value: function() {
                        i
                          ? (this._wakeLock.release(), (this._wakeLock = null))
                          : c
                          ? this.noSleepTimer &&
                            (console.warn(
                              "\n          NoSleep now disabled for older iOS devices.\n        "
                            ),
                            window.clearInterval(this.noSleepTimer),
                            (this.noSleepTimer = null))
                          : this.noSleepVideo.pause();
                      }
                    }
                  ]),
                  A
                );
              })();
            A.exports = a;
          },
          function(A, e, o) {
            "use strict";
            A.exports = {
              webm:
                "data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA=",
              mp4:
                "data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQAD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"
            };
          }
        ]);
      });
    }

    ////////////////////////////////////////
    ////////// MY CODE
    ////////////////////////////////////////

    ////////////////////////////////////////
    ////// VARIABLES
    var R = _extra.utils;
    var noSleep;
    var enabled = false;

    ////////////////////////////////////////
    ////// INIT
    function init() {
      initNoSleep();
      _extra.w.addEventListener("touchstart", touchClickHandler);
      _extra.w.addEventListener("mousedown", touchClickHandler);
    }

    function touchClickHandler() {
      if (enabled) {
        if (noSleep) noSleep.disable();
        noSleep = new _extra.w.NoSleep();
        noSleep.enable();
      }
    }

    ////////////////////////////////////////
    ////// PREFERENCE DATA
    var preferenceData = {
      enable: function() {
        enabled = true;
      },

      disable: function() {
        enabled = false;
        if (noSleep) noSleep.disable();
      },

      default: false
    };
    ////////////////////////////////////////
    ////// ENTRY POINT
    R.when(
      // True/False regarding whether the preference variable exists
      R.identity,

      // Listen for web objects
      // This will cause onNewWebObject to be called with
      // web object names
      init
    )(register());

    function register() {
      return _extra.preferenceManager.registerPreferenceModule(
        "WakeLock",
        preferenceData
      );
    }
  }
);
