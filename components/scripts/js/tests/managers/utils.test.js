/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/3/19
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.utils", function() {
  "use strict";

  var module = unitTests.getModule("utils");

  beforeEach(function() {
    window._extra = {
      classes: unitTests.classes,
      w: window
    };

    module();
  });

  afterEach(function() {
    delete window._extra;
  });

  it("should define _extra.utils", function() {
    expect(_extra.utils).toBeDefined();
  });

  describe("_extra.utils.addIfDefined", function() {
    it("should only add elements to an array if they exist", function() {
      var array = [];

      _extra.utils.addIfDefined(true, array);
      expect(array[0]).toBe(true);
      expect(array.length).toBe(1);

      _extra.utils.addIfDefined(false, array);
      expect(array[1]).toBe(false);
      expect(array.length).toBe(2);

      _extra.utils.addIfDefined(undefined, array);
      expect(array.length).toBe(2);

      _extra.utils.addIfDefined(null, array);
      expect(array.length).toBe(2);
    });
  });

  describe("_extra.utils.map()", function() {
    it("should opperate a method over each element of an array, saving the returned result", function() {
      // 1: SETUP
      var inc = value => value + 1;

      var data = [1, 2, 3];

      // 2: TEST
      var result = _extra.utils.map(inc, data);

      // 3: ASSERT
      expect(result).toEqual([2, 3, 4]);
      expect(result).not.toBe(data);
    });

    it("should also work on objects", function() {
      // 1: SETUP
      var inc = value => value + 1;

      var data = {
        a: 1,
        b: 2,
        c: 3
      };

      // 2: TEST
      var result = _extra.utils.map(inc, data);

      // 3: ASSERT
      expect(result).toEqual(
        jasmine.objectContaining({
          a: 2,
          b: 3,
          c: 4
        })
      );

      expect(result).not.toBe(data);
    });
  });

  describe("_extra.utils.any()", function() {
    it("should return true if all items match the predicate", function() {
      // 1: SETUP
      var list = [true, true, true];
      var predicate = _extra.utils.equals(true);

      // 2: TEST
      var result = _extra.utils.any(predicate, list);

      // 3: ASSERT
      expect(result).toBe(true);
    });

    it("should return true if only one item matches the predicate", function() {
      // 1: SETUP
      var list = [false, false, true];
      var predicate = _extra.utils.equals(true);

      // 2: TEST
      var result = _extra.utils.any(predicate, list);

      // 3: ASSERT
      expect(result).toBe(true);
    });

    it("should return false if all items don't match the predicate", function() {
      // 1: SETUP
      var list = [false, false, false];
      var predicate = _extra.utils.equals(true);

      // 2: TEST
      var result = _extra.utils.all(predicate, list);

      // 3: ASSERT
      expect(result).toBe(false);
    });
  });
  describe("_extra.utils.all()", function() {
    it("should return true if all items match the predicate", function() {
      // 1: SETUP
      var list = [true, true, true];
      var predicate = _extra.utils.equals(true);

      // 2: TEST
      var result = _extra.utils.all(predicate, list);

      // 3: ASSERT
      expect(result).toBe(true);
    });

    it("should return false if any items don't match the predicate", function() {
      // 1: SETUP
      var list = [true, true, false];
      var predicate = _extra.utils.equals(true);

      // 2: TEST
      var result = _extra.utils.all(predicate, list);

      // 3: ASSERT
      expect(result).toBe(false);
    });
  });

  describe("_extra.utils.allPass()", function() {
    it("should return true if all methods return true", function() {
      // 1: SETUP
      var a = {
        prop1: true,
        prop2: true
      };
      var tests = [_extra.utils.prop("prop1"), _extra.utils.prop("prop2")];

      // 2: TEST
      var result = _extra.utils.allPass(tests, a);

      // 3: ASSERT
      expect(result).toEqual(true);
    });

    it("should return false if any methods return false", function() {
      // 1: SETUP
      var a = {
        prop1: false,
        prop2: true
      };
      var tests = [_extra.utils.prop("prop1"), _extra.utils.prop("prop2")];

      // 2: TEST
      var result = _extra.utils.allPass(tests, a);

      // 3: ASSERT
      expect(result).toEqual(false);
    });
  });

  describe("_extra.utils.anyPass()", function() {
    it("should return true if all methods return true", function() {
      // 1: SETUP
      var a = {
        prop1: true,
        prop2: true
      };
      var tests = [_extra.utils.prop("prop1"), _extra.utils.prop("prop2")];

      // 2: TEST
      var result = _extra.utils.anyPass(tests, a);

      // 3: ASSERT
      expect(result).toEqual(true);
    });

    it("should return true if any methods return true", function() {
      // 1: SETUP
      var a = {
        prop1: false,
        prop2: true
      };
      var tests = [_extra.utils.prop("prop1"), _extra.utils.prop("prop2")];

      // 2: TEST
      var result = _extra.utils.anyPass(tests, a);

      // 3: ASSERT
      expect(result).toEqual(true);
    });

    it("should return false if all methods return false", function() {
      // 1: SETUP
      var a = {
        prop1: false,
        prop2: false
      };
      var tests = [_extra.utils.prop("prop1"), _extra.utils.prop("prop2")];

      // 2: TEST
      var result = _extra.utils.anyPass(tests, a);

      // 3: ASSERT
      expect(result).toEqual(false);
    });
  });

  describe("_extra.utils.message()", function() {
    it("should curry correctly", function() {
      // 1: SETUP
      spyOn(console, "log");

      // 2: TEST
      var a = _extra.utils.message("hello");
      a();

      // 3: ASSERT
      expect(console.log).toHaveBeenCalledWith("hello");
    });
  });
  describe("_extra.utils.split()", function() {
    it("should split a string into an array based on the input key", function() {
      // 1: SETUP
      var string = "1,2,3";
      var key = ",";

      // 2: TEST
      var result = _extra.utils.split(key, string);

      // 3: ASSERT
      expect(result).toEqual(["1", "2", "3"]);
    });
  });

  describe("_extra.utils.removeWhiteSpace()", function() {
    it("should remove taps and spaces from a string", function() {
      // 1: SETUP
      var string = "A B C	D	E";

      // 2: TEST
      var result = _extra.utils.removeWhiteSpace(string);

      // 3: ASSERT
      expect(result).toEqual("ABCDE");
    });
  });

  describe("_extra.utils.includes()", function() {
    it("should tell us if a substring exists in a string", function() {
      // 1: SETUP
      var list1 = "banana";
      var item1 = "ana";
      var list2 = "foo";
      var item2 = "bar";

      // 2: TEST
      var result1 = _extra.utils.includes(item1, list1);
      var result2 = _extra.utils.includes(item2, list2);

      // 3: ASSERT
      expect(result1).toEqual(true);
      expect(result2).toEqual(false);
    });
  });

  describe("_extra.utils.head()", function() {
    it("should work with arrays", function() {
      // 1: SETUP
      var array = [1, 2, 3];

      // 2: TEST
      var result = _extra.utils.head(array);

      // 3: ASSERT
      expect(result).toBe(1);
    });
  });

  describe("_extra.utils.head()", function() {
    it("should work with arrays", function() {
      // 1: SETUP
      var array = [1, 2, 3];

      // 2: TEST
      var result = _extra.utils.last(array);

      // 3: ASSERT
      expect(result).toBe(3);
    });
  });

  describe("_extra.utils.startsWith()", function() {
    it("should return true if a string starts with what we pass in", function() {
      // 1: SETUP
      var start = "foo";
      var string = "foobar";

      // 2: TEST
      var result = _extra.utils.startsWith(start, string);

      // 3: ASSERT
      expect(result).toBe(true);
    });

    it("should return false if a string does not start with what we pass in", function() {
      // 1: SETUP
      var start = "foo";
      var string = "bar";

      // 2: TEST
      var result = _extra.utils.startsWith(start, string);

      // 3: ASSERT
      expect(result).toBe(false);
    });
  });

  describe("_extra.utils.endsWith()", function() {
    it("should return true if a string starts with what we pass in", function() {
      // 1: SETUP
      var end = "bar";
      var string = "foobar";

      // 2: TEST
      var result = _extra.utils.endsWith(end, string);

      // 3: ASSERT
      expect(result).toBe(true);
    });

    it("should return false if a string does not start with what we pass in", function() {
      // 1: SETUP
      var end = "foo";
      var string = "bar";

      // 2: TEST
      var result = _extra.utils.endsWith(end, string);

      // 3: ASSERT
      expect(result).toBe(false);
    });
  });
  describe("_extra.utils.cond()", function() {
    it("should run a function depending on whether its condition is met", function() {
      // 1: SETUP
      var condition = [
        [_extra.utils.equals("A"), _extra.utils.always("Adam")],
        [_extra.utils.equals("B"), _extra.utils.always("Betty")],
        [_extra.utils.T, _extra.utils.always("Tristan")]
      ];

      // 2: TEST
      var tester = _extra.utils.cond(condition);

      // 3: ASSERT
      expect(tester("A")).toBe("Adam");
      expect(tester("B")).toBe("Betty");
      expect(tester("R")).toBe("Tristan");
    });
  });

  describe("_extra.utils.indexOf()", function() {
    it("should tell us the index of a substring in a string", function() {
      // 1: SETUP
      var string = "foobar";

      // 2: TEST
      var index = _extra.utils.indexOf("b", "foobar");

      // 3: ASSERT
      expect(index).toBe(3);
    });
  });

  describe("_extra.utils.matchesQuery()", function() {
    it("should match foobar with foo@", function() {
      // 1: SETUP
      var queryIcon = "@";
      var query = "foo@";
      var input = "foobar";

      // 2: TEST
      var result = _extra.utils.matchesQuery(queryIcon, query, input);

      // 3: ASSERT
      expect(result).toBe(true);
    });

    it("should match foobar with @bar", function() {
      // 1: SETUP
      var queryIcon = "@";
      var query = "@bar";
      var input = "foobar";

      // 2: TEST
      var result = _extra.utils.matchesQuery(queryIcon, query, input);

      // 3: ASSERT
      expect(result).toBe(true);
    });

    it("should match foobar with f@bar", function() {
      // 1: SETUP
      var queryIcon = "@";
      var query = "f@bar";
      var input = "foobar";

      // 2: TEST
      var result = _extra.utils.matchesQuery(queryIcon, query, input);

      // 3: ASSERT
      expect(result).toBe(true);
    });

    it("should not match foo@ with fizzbuzz", function() {
      // 1: SETUP
      var queryIcon = "@";
      var query = "foo@";
      var input = "fizzbuzz";

      // 2: TEST
      var result = _extra.utils.matchesQuery(queryIcon, query, input);

      // 3: ASSERT
      expect(result).toBe(false);
    });

    it("should return false if no query icon in query", function() {
      // 1: SETUP
      var queryIcon = "@";
      var query = "foo";
      var input = "foobar";

      // 2: TEST
      var result = _extra.utils.matchesQuery(queryIcon, query, input);

      // 3: ASSERT
      expect(result).toBe(false);
    });

    it("should return false if too many query icons were in the query", function() {
      // 1: SETUP
      var queryIcon = "@";
      var query = "f@b@";
      var input = "foobar";

      // 2: TEST
      var result = _extra.utils.matchesQuery(queryIcon, query, input);

      // 3: ASSERT
      expect(result).toBe(false);
    });
  });
});
