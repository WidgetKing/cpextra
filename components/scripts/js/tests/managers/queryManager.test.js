/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/12/15
 * Time: 7:53 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.queryArray", function () {

    "use strict";

    var module = unitTests.getModule("queryManager");

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "w":{
                "Array":Array
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.queryArray method", function () {
        expect(_extra.queryList).toBeDefined();
        expect(_extra.WILDCARD_CHARACTER).toBeDefined();
        expect(_extra.GLOBAL_WILDCARD_CHARACTER).toBeDefined();
    });

    it("should return a list with matching suffixes", function () {

        var list = ["my_test","simple_test","invalid_invalid"];
        expect(_extra.queryList("@_test", list)).toEqual(["my_test","simple_test"]);

    });

    it("should automatically search for the GLOBAL_WILDCARD_CHARACTER", function () {

        var list = ["my_test","simple_test","invalid_invalid"];
        _extra.GLOBAL_WILDCARD_CHARACTER = "%";
        expect(_extra.queryList("%_test", list)).toEqual(["my_test","simple_test"]);

    });

    it("should allow us to set what the wildcard character is", function () {

        var list = ["my_test","simple_test","invalid_invalid"];
        expect(_extra.queryList("%_test", list, "%")).toEqual(["my_test","simple_test"]);

    });

    it("should return a list with matching prefixes", function () {

        var list = ["test_my","invalid_invalid","test_simple"];
        expect(_extra.queryList("test_@", list)).toEqual(["test_my","test_simple"]);

    });

    it("should return a list with matching prefixes and suffixes", function () {

        var list = ["hello_foo_world","invalid_world","hello_bar_world"];
        expect(_extra.queryList("hello_@_world", list)).toEqual(["hello_foo_world","hello_bar_world"]);

    });

    it("should return null if nothing matches", function () {

        var list = ["test_my","invalid_invalid","test_simple"];
        expect(_extra.queryList("test_@_Suffix", list)).toEqual(null);

    });

    it("should return null if we give it a name that has no query", function () {

        var list = ["test_my","invalid_invalid","test_simple"];
        expect(_extra.queryList("test", list)).toEqual(null);

    });

    it("should be able to tell us if a string is a LOCAL query", function () {

        expect(_extra.isLocalQuery("test_@")).toBe(true);
        expect(_extra.isLocalQuery("test_#")).toBe(false);
        _extra.WILDCARD_CHARACTER = "#";
        expect(_extra.isLocalQuery("test_#")).toBe(true);

    });

    it("should be able to tell us if a string is a GLOBAL query", function () {

        expect(_extra.isGlobalQuery("test_#")).toBe(true);
        expect(_extra.isGlobalQuery("test_@")).toBe(false);
        _extra.GLOBAL_WILDCARD_CHARACTER = "@";
        expect(_extra.isGlobalQuery("test_@")).toBe(true);

    });

    it("should be able to tell us if a string is ANY KIND of query", function () {

        expect(_extra.isQuery("test_#")).toBe(true);
        expect(_extra.isQuery("test_@")).toBe(true);
        expect(_extra.isQuery("test_%")).toBe(false);
        _extra.GLOBAL_WILDCARD_CHARACTER = "%";
        expect(_extra.isQuery("test_%")).toBe(true);

    });

    it("should be able to tell us what query character can be found in a string", function () {

        expect(_extra.getQueryType("test_#")).toBe("#");
        expect(_extra.getQueryType("test_@")).toBe("@");
        expect(_extra.getQueryType("test_%")).toBe(false);
        _extra.GLOBAL_WILDCARD_CHARACTER = "%";
        expect(_extra.getQueryType("test_%")).toBe("%");

    });

    it("should be able to see object keys as a list, ignoring their values", function () {

        var object = {
            "test_my":true,
            "test_simple": 0,
            "invalid":"invalid",
            "test_test":null
        };

        expect(_extra.queryList("test_@", object)).toEqual(["test_my","test_simple","test_test"]);

    });
});