_extra.registerModule("CallbackTriggerBox", function() {
  /**
   * The original purpose of this class was for the stageManager.js file's 'change' method
   * where we needed to keep track of changing states of objects when they appeared on the
   * timeline. This required some trickery with the callbacks that I thought was best
   * abstracted out into a different file, rather than incorporated into the
   * stateManager.js
   */
  function CallbackTriggerBox(callback) {
    this.callback = callback;

    // Holds the functions that the CallbackTriggerBox adds to the callback
    this.callbackHandlers = {};

    // The callbacks added by the add function
    this.methods = {};
  }

  _extra.registerClass("CallbackTriggerBox", CallbackTriggerBox);

  ////////////////////////////////////////
  ////// CLASS METHODS

  CallbackTriggerBox.prototype.add = function(name, method) {
    // For the callbackHandler method
    var that = this;

    // Save so we can access it in the callbackHandler
    this.methods[name] = method;

    // If we already have a listener, we don't have to do anything more
    // If we don't. Then we need to add the listener to the callback
    if (!this.callbackHandlers.hasOwnProperty(name)) {
      // This is the method that we'll eventually call
      function callbackHandler() {
        // Our job is done
        if (that.methods.hasOwnProperty(name)) that.methods[name]();

        // Stop this method from being called again
        that.remove(name);
      }

      this.callbackHandlers[name] = callbackHandler;

      this.callback.addCallback(name, callbackHandler);
    }
  };

  CallbackTriggerBox.prototype.remove = function(name) {
    if (this.has(name)) {
      this.callback.removeCallback(name, this.callbackHandlers[name]);
      delete this.callbackHandlers[name];
      delete this.methods[name];
    }
  };

  CallbackTriggerBox.prototype.has = function(name) {
    return this.methods.hasOwnProperty(name);
  };
});
