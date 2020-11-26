exports.callWithCooldown = (method, miliseconds = 300) => {
  // Recording whether we're waiting for a timeout.
  var timeout;

  return prop => {
    // If still waiting for timeout, do nothing.
    if (timeout) return;

    timeout = setTimeout(() => {
      timeout = null;
      // Final Call
      method(prop);
    }, miliseconds);
  };
};
