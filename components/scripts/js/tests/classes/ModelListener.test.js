/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/10/15
 * Time: 1:56 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the ModelListener class", function () {

    "use strict";

    beforeEach(function () {

        window._extra = {
            "classes":unitTests.classes
        };

        this.model = new unitTests.classes.Model();

        this.modelListener = new unitTests.classes.ModelListener("name", this.model);
    });

    afterEach(function () {
        delete window._extra;
    });




    it("should add itself to the model callback", function () {
        expect(this.model.updateCallback.hasCallbackFor("name")).toBe(true);
    });

    it("should allow us to add properties for the module", function () {

        var onChange = jasmine.createSpy("onChange");

        this.modelListener.addProperty("prop", onChange, "default");
        expect(this.model.retrieve("name","prop")).toBe("default");
        expect(onChange).toHaveBeenCalledWith(null, "default");

        onChange.calls.reset();
        this.model.write("name","prop","new");

        expect(onChange).toHaveBeenCalledWith("default","new");
    });

    it("should not overwrite a pre-existing value in the model with the default value", function () {

        var onChange = jasmine.createSpy("onChange");

        this.model.write("name", "prop", "freshValue");

        this.modelListener.addProperty("prop", onChange, "default");

        expect(this.model.retrieve("name", "prop")).toBe("freshValue");
    });

    it("should expose the model it is linked to", function () {
        expect(this.modelListener.model).toEqual(this.model);
    });

    it("should be able to unload itself", function () {
        this.modelListener.unload();
        expect(this.model.updateCallback.hasCallbackFor("name")).toBe(false);
    });

    it("should allow us not to set a default", function () {
        var onChange = jasmine.createSpy("onChange");

        this.modelListener.addProperty("prop", onChange);
        expect(this.model.retrieve("name", "prop")).toBe(undefined);
        expect(onChange).not.toHaveBeenCalled();

        this.model.write("name", "prop2", "foobar");
        this.modelListener.addProperty("prop2", onChange);
        expect(onChange).toHaveBeenCalled();
    });

    it("should allow false to be a value that should be activated", function () {

        var onChange = jasmine.createSpy("onChange");

        this.model.write("name","prop",false);

        this.modelListener.addProperty("prop", onChange);

        expect(onChange).toHaveBeenCalled();

    });

});