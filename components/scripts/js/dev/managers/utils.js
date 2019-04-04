/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/3/19
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("utils", function() {
  "use strict";

  function curry(numParams, method) {
    function mergeParams(oldParams, newParams) {
      var params = [];

      oldParams.forEach(function(param) {
        if (param === _extra.utils.__ && newParams.length > 0) {
          params.push(newParams.shift());
        } else {
          params.push(param);
        }
      });

      return params.concat(newParams);
    }

    function getTrueParamsLength(params) {
      return _extra.utils.reduce(
        function(value, acc) {
          if (value === _extra.utils.__) {
            return acc;
          } else {
            return acc + 1;
          }
        },
        0,
        params
      );
    }

    function innerCurry(params, args) {
      var argumentsArray = Array.prototype.slice.call(args);
      params = mergeParams(params, argumentsArray);

      if (getTrueParamsLength(params) >= numParams) {
        return method.apply(null, params);
      } else {
        return callInnerCurry(params);
      }
    }

    function callInnerCurry(params) {
      return function() {
        return innerCurry(params, arguments);
      };
    }

    return callInnerCurry([]);
  }

  ////////////////////////////////////////
  ////// Utils start

  _extra.utils = {
    __: {},
    identity: function(value) {
      return value;
    },
    message: curry(2, function(message, value) {
      console.log(message);

      return value;
    }),
    tap: curry(2, function(method, value) {
      method(value);

      return value;
    }),
    always: function(value) {
      return function() {
        return value;
      };
    },
    pipeLog: function(value) {
      console.log(value);

      return value;
    },
    prop: curry(2, function(propertyName, data) {
      return data[propertyName];
    }),

    equals: curry(2, function(val1, val2) {
      return val1 === val2;
    }),

    isNil: function(value) {
      return (
        value === "" ||
        value === null ||
        value === undefined ||
        (isNaN(value) && typeof value === "number")
      );
    },

    apply: curry(2, function(props, method) {
      return method.apply(null, props);
    }),

    callIfDefined: function(method) {
      if (method) {
        var args = Array.prototype.slice.call(arguments);
        args = args.splice(1, args.length);
        return method.apply(null, args);
      }
    },
    callByType: function(parameter, methods) {
      switch (typeof parameter) {
        case "string":
          return _extra.utils.callIfDefined(methods.string, parameter);
        case "number":
          return _extra.utils.callIfDefined(methods.number, parameter);
        case "object":
          if (parameter.constructor === Array) {
            return _extra.utils.callIfDefined(methods.array, parameter);
          } else {
            return _extra.utils.callIfDefined(methods.object, parameter);
          }
      }
    },
    forEach: function(sequence, method) {
      _extra.utils.callByType(sequence, {
        array: function(array) {
          array.forEach(method);
        },
        object: function(object) {
          for (var key in object) {
            if (object.hasOwnProperty(key)) {
              method(key, object[key]);
            }
          }
        }
      });
    },
    reduce: function(method, initialValue, list) {
      _extra.utils.forEach(list, function(value) {
        initialValue = method(value, initialValue);
      });
      return initialValue;
    },
    addIfDefined: function(itemToAdd, list) {
      if (itemToAdd !== null && itemToAdd !== undefined) {
        list.push(itemToAdd);
      }
    },
    pipe: function() {
      var argumentsArray = Array.prototype.slice.call(arguments);
      return function(input) {
        return _extra.utils.reduce(
          function(method, input) {
            return method(input);
          },
          input,
          argumentsArray
        );
      };
    },
    ifElse: function(predicate, trueF, falseF) {
      return function() {
        if (predicate.apply(null, arguments)) {
          return trueF.apply(null, arguments);
        } else {
          return falseF.apply(null, arguments);
        }
      };
    },

    when: function(predicate, method) {
      return _extra.utils.ifElse(predicate, method, _extra.utils.identity);
    },
    unless: function(predicate, method) {
      return _extra.utils.ifElse(predicate, _extra.utils.identity, method);
    },
    T: function() {
      return true;
    },
    F: function() {
      return false;
    },
    forEachUntil: curry(3, function(predicate, loop, list) {
      return _extra.utils.callByType(list, {
        array: function() {
          for (var i = 0; i < list.length; i += 1) {
            var result = loop(list[i]);

            if (predicate(result)) {
              return result;
            }
          }
        },

        object: function() {
          for (var key in list) {
            if (list.hasOwnProperty(key)) {
              var result = loop(list[key]);

              if (predicate(result)) {
                return result;
              }
            }
          }
        }
      });
    }),

    ////////////////////////////////////////
    ////// Array Methods
    any: curry(2, function(predicate, list) {
      return _extra.utils.pipe(
        _extra.utils.forEachUntil(_extra.utils.identity, predicate),
        _extra.utils.when(_extra.utils.isNil, _extra.utils.F)
      )(list);
    }),

    append: curry(2, function(value, array) {
      var a = array.concat([value]);

      return a;
    }),
	  length: function (array) {

	  	return array.length;

	  },
    without: curry(2, function(remove, a) {
		var l;
      var array = a.concat();

      for (var i = 0, l = array.length; i < l; i++) {
        if (_extra.utils.any(_extra.utils.equals(array[i]), remove)) {
          array.splice(i, 1);
        }
      }
      return array;
    })
  };
});
