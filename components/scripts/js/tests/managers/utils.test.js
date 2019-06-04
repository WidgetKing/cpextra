/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/3/19
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.utils", function () {

    "use strict";

    var module = unitTests.getModule("utils");

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "w": window
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.utils", function () {
        expect(_extra.utils).toBeDefined();
    });

    describe("_extra.utils.addIfDefined", function () {

        it("should only add elements to an array if they exist", function () {

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

    describe("_extra.utils.map()", function () {

		it("should opperate a method over each element of an array, saving the returned result", function () {

			// 1: SETUP
			var inc = value => value + 1;

			var data = [1, 2, 3];

			// 2: TEST
			var result = _extra.utils.map(inc, data);

			// 3: ASSERT
			expect(result).toEqual([2, 3, 4]);
			expect(result).not.toBe(data);

		});

		it("should also work on objects", function () {

			// 1: SETUP
			var inc = value => value + 1;

			var data = {
				"a":1,
				"b":2,
				"c":3
			}

			// 2: TEST
			var result = _extra.utils.map(inc, data);

			// 3: ASSERT
			expect(result).toEqual(jasmine.objectContaining({
				"a":2,
				"b":3,
				"c":4
			}));

			expect(result).not.toBe(data);
		});
	});


});
