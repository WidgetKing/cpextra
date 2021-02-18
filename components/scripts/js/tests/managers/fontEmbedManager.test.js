fdescribe("fontEmbedManager.js", () => {
  var module = unitTests.getModule("fontEmbedManager"),
    utils = unitTests.getModule("utils"),
    $$,
    datas;

  function createData(name, successAction, failureAction, isInteractive) {
    if (isInteractive === undefined) isInteractive = true;
    datas[name] = {
      isInteractiveObject: isInteractive,
      successAction: successAction,
      failureAction: failureAction,
      name: name
    };
    return datas[name];
  }

  beforeEach(function() {
    datas = {};

    $$ = {
      appendTo: jasmine.createSpy()
    };

    window.$ = function() {
      return $$;
    };

    window.$.extend = Object.assign;
    window._extra = {
      error: jasmine.createSpy(),
      dataManager: {
        getSlideObjectDataByName: function(dataName) {
          return datas[dataName];
        }
      },
      $: window.$
    };

    spyOn(_extra, "$").and.callThrough();
    utils();
    module();
  });

  afterEach(function() {
    delete window._extra;
  });

  //////////////////////////////////////////////
  ////// TESTS BEGIN
  describe("_extra.fontEmbedManager.embed()", () => {
    it("should be defined", () => {
      expect(_extra.fontEmbedManager).toBeDefined();
      expect(_extra.fontEmbedManager.embed).toBeDefined();
    });

    it("should load font file at url", function() {
      _extra.fontEmbedManager.embed("Font Name", "font.tff");

      expect(_extra.$).toHaveBeenCalledWith(
        "<style>@font-face { font-family: 'Font Name'; src: url('font.tff')}</style>"
      );

      expect($$.appendTo).toHaveBeenCalledWith("head");
    });
  });

  describe("_extra.fontEmbedManager.embedFromAction", function() {
    const VALID_OBJECT = "validObject";
    const tffPath =
      "cp.openURL('fonts/OpenSansCondensed-Bold.ttf','_self');cp.actionChoiceContinueMovie();";
    const woffPath =
      "cp.openURL('fonts/Arial.woff','_self');cp.actionChoiceContinueMovie();";

    beforeEach(function() {
      createData(VALID_OBJECT, tffPath, woffPath);

      spyOn(_extra.fontEmbedManager, "embed");
    });

    it("should detect the file path in an action and forward it to embed()", function() {
      _extra.fontEmbedManager.embedFromAction(
        "foobar",
        VALID_OBJECT,
        "success"
      );

      expect(_extra.fontEmbedManager.embed).toHaveBeenCalledWith(
        "foobar",
        "fonts/OpenSansCondensed-Bold.ttf"
      );
    });

    it("should load woff files", function() {
      _extra.fontEmbedManager.embedFromAction(
        "barfoo",
        VALID_OBJECT,
        "failure"
      );

      expect(_extra.fontEmbedManager.embed).toHaveBeenCalledWith(
        "barfoo",
        "fonts/Arial.woff"
      );
    });
  });
});
