/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/3/19
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("utils", function () {
  "use strict";

  function curry(numParams, method) {
    function mergeParams(oldParams, newParams) {
      var params = [];

      oldParams.forEach(function (param) {
        if (param === _extra.utils.__ && newParams.length > 0) {
          params.push(newParams.shift());
        } else {
          params.push(param);
        }
      });

      return params.concat(newParams);
    }

    function getTrueParamsLength(params) {
      var acc = 0;

      params.forEach(function (value) {
        if (value !== _extra.utils.__) {
          acc++;
        }
      });

      return acc;
    }

    function innerCurry(params, args) {
      var argumentsArray = Array.prototype.slice.call(args);
      // If we have a length of zero, then the method was invoked without
      // sending in a parameter. But for the sake of expected behavior
      // we'll add one in here
      if (argumentsArray.length <= 0) argumentsArray.push(undefined);
      params = mergeParams(params, argumentsArray);

      if (getTrueParamsLength(params) >= numParams) {
        return method.apply(null, params);
      } else {
        return callInnerCurry(params);
      }
    }

    function callInnerCurry(params) {
      return function () {
        return innerCurry(params, arguments);
      };
    }

    return callInnerCurry([]);
  }

  ////////////////////////////////////////
  ////// Utils start

  _extra.utils = {
    __: {},
    map: curry(2, function (method, data) {
      return _extra.utils.callByType(data, {
        array: function () {
          var returnArray = [];

          _extra.utils.forEach(data, function (item) {
            var result = method(item);
            returnArray.push(result);
          });

          return returnArray;
        },

        object: function () {
          var returnObject = {};

          _extra.utils.forEach(data, function (key, item) {
            var result = method(item);
            returnObject[key] = result;
          });

          return returnObject;
        }
      });
    }),
    flatMap: curry(2, function (method, data) {
      return Array.prototype.concat.apply([], data.map(method));
    }),
    identity: function (value) {
      return value;
    },
    message: curry(2, function (message, value) {
      console.log(message);

      return value;
    }),
    tap: curry(2, function (method, value) {
      method(value);

      return value;
    }),
    always: function (value) {
      return function () {
        return value;
      };
    },
    pipeLog: function (value) {
      console.log(value);

      return value;
    },
    prop: curry(2, function (propertyName, data) {
      return data[propertyName];
    }),

    equals: curry(2, function (val1, val2) {
      return val1 === val2;
    }),

    gt: curry(2, function (val1, val2) {
      return val1 > val2;
    }),

    lt: curry(2, function (val1, val2) {
      return val1 < val2;
    }),

    gte: curry(2, function (val1, val2) {
      return val1 >= val2;
    }),

    lte: curry(2, function (val1, val2) {
      return val1 <= val2;
    }),

    isNil: function (value) {
      return (
        value === "" ||
        value === null ||
        value === undefined ||
        (isNaN(value) && typeof value === "number")
      );
    },

    apply: curry(2, function (props, method) {
      return method.apply(null, props);
    }),

    callIfDefined: function (method) {
      if (method) {
        var args = Array.prototype.slice.call(arguments);
        args = args.splice(1, args.length);
        return method.apply(null, args);
      }
    },
    callByType: function (parameter, methods) {
      if (_extra.utils.isNil(parameter)) return null;
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

    isEmpty: function (data) {
      if (_extra.utils.isNil(data)) return true;

      return _extra.utils.callByType(data, {
        array: function (ar) {
          return ar.length === 0;
        },
        object: function (obj) {
          return Object.keys(obj).length === 0;
        }
      });
    },

    forEach: curry(2, function (sequence, method) {
      _extra.utils.callByType(sequence, {
        array: function (array) {
          array.forEach(function (p) {
            method(p);
          });
        },
        object: function (object) {
          for (var key in object) {
            if (object.hasOwnProperty(key)) {
              method(key, object[key]);
            }
          }
        }
      });
    }),
    reduce: curry(3, function (method, initialValue, list) {
      _extra.utils.callByType(list, {
        array: function (array) {
          _extra.utils.forEach(array, function (value) {
            initialValue = method(value, initialValue);
          });
        },

        string: function (string) {
          for (var i = 0; i < string.length; i++) {
            initialValue = method(string[i], initialValue);
          }
        }
      });

      return initialValue;
    }),
    add: curry(2, function (n1, n2) {
      return n1 + n2;
    }),
    addIfDefined: function (itemToAdd, list) {
      if (itemToAdd !== null && itemToAdd !== undefined) {
        list.push(itemToAdd);
      }
    },

    indexOf: curry(2, function (item, list) {
      return _extra.utils.callByType(list, {
        string: function (string) {
          return string.indexOf(item);
        }
      });
    }),

    includes: curry(2, function (item, list) {
      return _extra.utils.indexOf(item, list) > -1;
    }),

    pipe: function () {
      var argumentsArray = Array.prototype.slice.call(arguments);
      return function (input) {
        return _extra.utils.reduce(
          function (method, input) {
            return method(input);
          },
          input,
          argumentsArray
        );
      };
    },
    ////////////////////////////////////////
    ////// Array
    head: function (array) {
      return array[0];
    },

    last: function (array) {
      return array[array.length - 1];
    },

    ////////////////////////////////////////
    ////// Conditionals
    ifElse: function (predicate, trueF, falseF) {
      return function () {
        if (predicate.apply(null, arguments)) {
          return trueF.apply(null, arguments);
        } else {
          return falseF.apply(null, arguments);
        }
      };
    },

    when: curry(2, function (predicate, method) {
      return _extra.utils.ifElse(predicate, method, _extra.utils.identity);
    }),
    unless: curry(2, function (predicate, method) {
      return _extra.utils.ifElse(predicate, _extra.utils.identity, method);
    }),

    cond: curry(2, function (conditions, input) {
      for (var i = 0; i < conditions.length; i += 1) {
        if (conditions[i][0](input)) return conditions[i][1](input);
      }
    }),

    T: function () {
      return true;
    },
    F: function () {
      return false;
    },
    nth: curry(2, function (num, list) {
      return list[num];
    }),
    and: curry(3, function (predicate1, predicate2, input) {
      return predicate1(input) && predicate2(input);
    }),
    typeIs: curry(2, function (intended, obj) {
      return typeof obj === intended;
    }),
    forEachUntil: curry(3, function (predicate, loop, list) {
      return _extra.utils.callByType(list, {
        array: function () {
          for (var i = 0; i < list.length; i += 1) {
            var result = loop(list[i]);

            if (predicate(result)) {
              return result;
            }
          }
        },

        object: function () {
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

    complement: function (method) {
      return function () {
        return !method.apply(null, arguments);
      };
    },
    ////////////////////////////////////////
    ////// Array Methods
    any: curry(2, function (predicate, list) {
      for (var i = 0; i < list.length; i += 1) {
        if (predicate(list[i])) return true;
      }
      return false;
    }),

    all: curry(2, function (predicate, list) {
      for (var i = 0; i < list.length; i += 1) {
        if (!predicate(list[i])) return false;
      }
      return true;
    }),

    allPass: curry(2, function (tests, obj) {
      return _extra.utils.pipe(
        _extra.utils.map(_extra.utils.apply([obj])),
        _extra.utils.all(_extra.utils.equals(true))
      )(tests);
    }),

    anyPass: curry(2, function (tests, obj) {
      return _extra.utils.pipe(
        _extra.utils.map(_extra.utils.apply([obj])),
        _extra.utils.any(_extra.utils.equals(true))
      )(tests);
    }),

    append: curry(2, function (value, array) {
      var a = array.concat([value]);

      return a;
    }),
    length: function (array) {
      return array.length;
    },
    indexEquals: curry(3, function (index, matches, array) {
      return array[index] === matches;
    }),
    without: curry(2, function (remove, a) {
      var l;
      var array = a.concat();

      for (var i = 0, l = array.length; i < l; i++) {
        if (_extra.utils.any(_extra.utils.equals(array[i]), remove)) {
          array.splice(i, 1);
        }
      }
      return array;
    }),

    ////////////////////////////////////////
    ////// String Methods
    split: curry(2, function (key, string) {
      return string.split(key);
    }),

    removeWhiteSpace: function (string) {
      // Remove spaces from value string
      return string.replace(/\s+/g, "");
    },

    startsWith: curry(2, function (start, string) {
      return string.substring(0, start.length) === start;
    }),

    endsWith: curry(2, function (end, string) {
      return (
        string.substring(string.length - end.length, string.length) === end
      );
    }),

    contains: curry(2, function (subString, string) {
      return string.indexOf(subString) !== -1;
    }),

    filter: curry(2, function (predicate, array) {
      var newArray = [];

      array.forEach(function (item) {
        if (predicate(item)) newArray.push(item);
      });

      return newArray;
    }),
    occurances: curry(2, function (char, string) {
      return string.split(char).length - 1;
    }),
    mergeRight: curry(2, function (left, right) {
      if (_extra.utils.isNil(right)) return left;

      var result = _extra.utils.clone(right);

      for (var key in left) {
        if (left.hasOwnProperty(key) && !right.hasOwnProperty(key)) {
          result[key] = left[key];
        }
      }

      return result;
    }),
    clone: function (obj) {
      if (_extra.$) return _extra.$.extend({}, obj);
      return JSON.parse(JSON.stringify(obj));
    },
    isTrue: function (value) {
      return value === true;
    },
    propEq: curry(3, function (property, value, obj) {
      if (!obj || typeof obj[property] === "undefined") return false;
      return obj[property] === value;
    }),
    getCriteriaAction: curry(2, function (criteria, objectData) {
      if (!criteria || !objectData) return;
      switch (criteria.toLowerCase()) {
        case "success":
          return objectData.successAction;

        case "failure":
        case "fail":
          return objectData.failureAction;

        case "focuslostaction":
          return objectData.focusLostAction;
      }
    }),
    getFilePath: curry(2, function (fileExtension, fullString) {
      // Add code here
      var u = _extra.utils;
      var isQuotationMark = u.equals("'");
      var containsExtension = u.contains(fileExtension);

      return u.pipe(
        u.reduce(function (char, acc) {
          // If already inside array, then we know this is complete
          if (u.typeIs("object", acc)) return acc;

          if (isQuotationMark(char)) {
            if (containsExtension(acc)) {
              // File path is now complete
              return [acc];
            } else {
              // Restart building file path
              return "";
            }

            // If not a quotation mark then we need to keep adding the string.
          } else {
            return acc + char;
          }
        }, ""),
        // If it's an object we know we have the correct string stored in an array
        // Otherwise, we have nothing.
        u.ifElse(u.typeIs("object"), u.nth(0), u.always(null))
      )(fullString);
    }),
    matchesQuery: curry(3, function (queryIcon, query, input) {
      var headStartsWith = _extra.utils.pipe(
        _extra.utils.last,
        _extra.utils.endsWith
      );

      var lastEndsWith = _extra.utils.pipe(
        _extra.utils.head,
        _extra.utils.startsWith
      );

      // Input: "f@bar"
      return _extra.utils.pipe(
        // ["f", "bar"]
        _extra.utils.split(queryIcon),
        // If the array is over 1 length
        // then we must have a query icon present
        _extra.utils.ifElse(
          // Checking the array length is what we expect
          _extra.utils.pipe(_extra.utils.length, _extra.utils.equals(2)),

          // So from here on out we are left with
          // something like: ["f", "bar"]
          // built from: "f@bar"

          //
          //
          // NOW START BUILDING THE PREDICATES
          //
          //

          _extra.utils.pipe(
            _extra.utils.cond([
              // ["", "bar"]
              [_extra.utils.indexEquals(0, ""), headStartsWith],
              // ["foo", ""]
              [_extra.utils.indexEquals(1, ""), lastEndsWith],
              [
                // ["f","bar"]
                _extra.utils.pipe(_extra.utils.length, _extra.utils.equals(2)),
                _extra.utils.and(lastEndsWith, headStartsWith)
              ]
            ]),

            //
            //
            // RUN PREDICATE OVER INPUT PARAMETER
            //
            //
            _extra.utils.apply([input])
          ),
          _extra.utils.F
        )
      )(query);
    })
  };
});
