/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/09/15
 * Time: 10:24 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite to test local and session storage variable saving", function () {
    "use strict";

    var module = unitTests.getModule("localStorageManager"),
        queryEngine = unitTests.getModule("queryManager"),
        variables = {
            "ls_localStorage":"local_storage_value",
            "ss_sessionStorage":"session_storage_value",
            "ls_localStorage1":"ls_localStorage1",
            "ls_localStorage2":"ls_localStorage2",
            "ss_sessionStorage1":"ss_sessionStorage1",
            "ss_sessionStorage2":"ss_sessionStorage2"
        };

    function Storage(type) {
        var store = {};
        this.getItem = jasmine.createSpy(type + "Storage.getItem").and.callFake(function (index) {
            return store[index];
        });
        this.setItem = jasmine.createSpy(type + "Storage.setItem").and.callFake(function (index, value) {
            store[index] = value;
        });
        this.removeItem = jasmine.createSpy(type + "Storage.removeItem");
        this.clear = jasmine.createSpy(type + "Storage.clear");
        // Used to pass test.
        this.getItem.call = function () {};
    }

    beforeEach(function () {
        window._extra = {
            "w":{
                "localStorage": new Storage("local"),
                "sessionStorage": new Storage("session"),
                "isNaN":isNaN,
                "parseFloat":parseFloat,
                "Array":Array
            },
            "variableManager": {
                "prefixCallback": new unitTests.classes.Callback(),
                "getVariableValue":function (variableName) {
                    return variables[variableName];
                },
                "setVariableValue":function (variableName, value) {
                    variables[variableName] = value;
                }
            },
            "createEvent": function (name) {
                return new unitTests.classes.CustomEvent(name);
            },
            "error":jasmine.createSpy("_extra.error")
        };

        queryEngine();
        module();
    });

    afterEach(function () {
        delete window._extra;
    });





    it("should define a method that allows us to trigger writing to local storage", function () {
        expect(_extra.variableManager.saveStorageVariables).toBeDefined();
    });

    function testStorage(storageName,testVariable,prefix) {

        describe("A test suite for " + storageName + "storage", function () {

            var storage;

            beforeEach(function () {
                storage = _extra.w[storageName];
            });

            it("should be able to register local storage variables and then write them to local storage", function () {

                _extra.variableManager.prefixCallback.sendToCallback(prefix,testVariable);
                _extra.variableManager.saveStorageVariables();

                expect(storage.setItem).toHaveBeenCalledWith(testVariable, variables[testVariable]);

            });

            it("should retrieve variable value from local storage", function () {

                storage.setItem(testVariable, "foobar");
                _extra.variableManager.prefixCallback.sendToCallback(prefix,testVariable);
                expect(variables[testVariable]).toEqual("foobar");

            });

            it("should convert string local storage values into numbers if valid", function () {

                storage.setItem(testVariable, "100.5");
                _extra.variableManager.prefixCallback.sendToCallback(prefix,testVariable);
                expect(typeof variables[testVariable]).toEqual("number");

            });

            it("should allow us to clear a variable from storage and then have that variable NOT be saved", function () {

                // Make sure the storage has registered this variable.
                storage.setItem(testVariable, "foobar");
                storage.setItem.calls.reset();
                _extra.variableManager.prefixCallback.sendToCallback(prefix,testVariable);
                // Test removing the item
                _extra.variableManager.flushStorage(testVariable);
                expect(storage.removeItem).toHaveBeenCalledWith(testVariable);
                // Test it not being saved
                _extra.variableManager.saveStorageVariables();
                expect(storage.setItem).not.toHaveBeenCalledWith(testVariable, jasmine.anything());

                // Testing ERROR!
                _extra.variableManager.flushStorage("invalid");
                expect(_extra.error.calls.argsFor(0)[0]).toBe("CV060", jasmine.any(String));

            });

            it("should allow us to flush out an entire storage section", function () {

                // Make sure the storage has registered this variable.
                storage.setItem(testVariable, "foobar");
                storage.setItem.calls.reset();
                _extra.variableManager.prefixCallback.sendToCallback(prefix,testVariable);


                // Test removing the item
                // DIFFERENT POINT HERE! We're sending the name of the storage instead of the name of a variable
                _extra.variableManager.flushStorage(storageName.toUpperCase());
                expect(storage.clear).toHaveBeenCalled();

                // Test it not being saved
                _extra.variableManager.saveStorageVariables();
                expect(storage.setItem).not.toHaveBeenCalledWith(testVariable, jasmine.anything());

            });

            it("should allow us to save an individual variable without saving all of them", function () {

                _extra.variableManager.prefixCallback.sendToCallback(prefix, testVariable + "1");
                _extra.variableManager.prefixCallback.sendToCallback(prefix, testVariable + "2");

                _extra.variableManager.saveStorageVariable(testVariable + "1");
                expect(storage.setItem).toHaveBeenCalledWith(testVariable + "1", jasmine.anything());
                expect(storage.setItem).not.toHaveBeenCalledWith(testVariable + "2", jasmine.anything());

            });

            it("shouldn't save individual variables if we've flushed this storage", function () {

                _extra.variableManager.prefixCallback.sendToCallback(prefix, testVariable);

                _extra.variableManager.flushStorage(storageName);

                _extra.variableManager.saveStorageVariable(testVariable);
                expect(storage.setItem).not.toHaveBeenCalled();

            });

            it("shouldn't save individual variable if we've flushed that specific variable", function () {

                _extra.variableManager.prefixCallback.sendToCallback(prefix, testVariable);

                _extra.variableManager.flushStorage(testVariable);

                _extra.variableManager.saveStorageVariable(testVariable);
                expect(storage.setItem).not.toHaveBeenCalled();

            });

            it("should be able to save a 0 value", function () {

                _extra.variableManager.prefixCallback.sendToCallback(prefix,testVariable);

                variables[testVariable] = 0;

                _extra.variableManager.saveStorageVariables();

                expect(storage.setItem).toHaveBeenCalledWith(testVariable, 0);

            });

        });



    }

    testStorage("localStorage", "ls_localStorage", "ls");
    testStorage("sessionStorage", "ss_sessionStorage", "ss");

    it("should allow us to flush all storages using the ALL keyword", function () {

        // Make sure the storage has registered this variable.
        _extra.w.localStorage.setItem("ls_localStorage", "foobar");
        _extra.w.localStorage.setItem.calls.reset();
        _extra.w.sessionStorage.setItem("ss_localStorage", "foobar");
        _extra.w.sessionStorage.setItem.calls.reset();
        _extra.variableManager.prefixCallback.sendToCallback("ls", "ls_localStorage");
        _extra.variableManager.prefixCallback.sendToCallback("ss", "ss_localStorage");

        // Test removing the item
        // DIFFERENT POINT HERE! We're using the 'ALL' keyword to clear all the storages.
        _extra.variableManager.flushStorage("ALL");
        expect(_extra.w.localStorage.clear).toHaveBeenCalled();
        expect(_extra.w.sessionStorage.clear).toHaveBeenCalled();

        // Test it not being saved
        _extra.variableManager.saveStorageVariables();
        expect(_extra.w.localStorage.setItem).not.toHaveBeenCalledWith("ls_localStorage", jasmine.anything());
        expect(_extra.w.sessionStorage.setItem).not.toHaveBeenCalledWith("ss_localStorage", jasmine.anything());

    });


});