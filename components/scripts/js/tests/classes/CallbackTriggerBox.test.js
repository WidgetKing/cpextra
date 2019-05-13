describe("CallbackTriggerBox", function() {

	////////////////////////////////////////
	////// Varaibles
	var instance;
	var callback;

	////////////////////////////////////////
	////// BeforeEach
	beforeEach(function() {

		callback = new unitTests.classes.Callback();
        instance = new unitTests.classes.CallbackTriggerBox(callback);

	});

	it("should send information through to callback when triggered", function () {

		// 1: SETUP
		var spy = jasmine.createSpy("spy")
		
		instance.add("foobar", spy);

		// 2: TEST
		callback.sendToCallback("foobar")

		// 3: ASSERT
		expect(spy).toHaveBeenCalled();

	});

	it("should call the updated callback only", function () {

		// 1: SETUP
		var spy1 = jasmine.createSpy("spy1");
		var spy2 = jasmine.createSpy("spy2");
		
		instance.add("foobar", spy1);

		// 2: TEST
		instance.add("foobar", spy2);
		callback.sendToCallback("foobar");

		// 3: ASSERT
		expect(spy1).not.toHaveBeenCalled();
		expect(spy2).toHaveBeenCalled();

	});
	
	describe(".remove()", function () {
		
		it("should remove callback", function () {

			// 1: SETUP
			var spy = jasmine.createSpy("spy")
			
			instance.add("foobar", spy);

			// 2: TEST
			instance.remove("foobar");
			callback.sendToCallback("foobar")

			// 3: ASSERT
			expect(spy).not.toHaveBeenCalled();

		});

		it("should not cause an error when removing something that doesn't exist", function () {

			// 1: SETUP
			var spy = jasmine.createSpy("spy")
			
			instance.add("foobar", spy);

			callback.sendToCallback("foobar")
			// 2: TEST
			

			// 3: ASSERT
			expect(function () {

				instance.remove("foobar");

			}).not.toThrow();
		});
		
		
	});

	it("should inform us if we have callbacks with .has()", function () {

		// 1: SETUP
		var spy = jasmine.createSpy("spy")
		
		instance.add("foobar", spy);

		// 2: TEST
		var validResult = instance.has("foobar");
		var invalidResult = instance.has("invalid");

		// 3: ASSERT
		expect(validResult).toBe(true);
		expect(invalidResult).toBe(false);

	});
	
	it("should not dispatch the method of a removed callback", function () {

		// 1: SETUP
		var spy = jasmine.createSpy("spy");

		instance.add("foobar", spy);

		// 2: TEST
		instance.remove("foobar");

		expect(function () {

			callback.sendToCallback("foobar");

		}).not.toThrow();

		// 3: ASSERT
		expect(spy).not.toHaveBeenCalled();

	});
	
});
