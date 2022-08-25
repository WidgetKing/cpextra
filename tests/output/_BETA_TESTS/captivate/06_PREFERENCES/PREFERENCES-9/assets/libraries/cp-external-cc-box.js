

(function () {

	function editCC() {

		var mainContainer = document.getElementById("main_container");
		var ccContainer = document.getElementById("cc");
		var originalProjectWidth;
		var originalCCWidth;

		function calculateFullWidth() {
			return (originalProjectWidth + originalCCWidth) + "px"
		}

		function showCC() {

			// console.log("CC WIDTH: " + originalCCWidth);
			// console.log("Project WIDTH: " + originalProjectWidth);

			// console.log("SHOW: " + calculateFullWidth());

			$("#cc").appendTo("#main_container").css({
				"float": "right",
				"inset": "auto",
				"right": "0px",
				"width": originalCCWidth + "px"
			});

			mainContainer.style.width = calculateFullWidth();
		}

		function hideCC() {
			// console.log("HIDE");
			mainContainer.style.width = originalProjectWidth + "px";
		}


		cpAPIEventEmitter.addEventListener("CPAPI_VARIABLEVALUECHANGED",
			function (event) {

				if (!originalProjectWidth) originalProjectWidth = parseFloat(mainContainer.style.width);
				if (!originalCCWidth) originalCCWidth = ccContainer.clientWidth;

				if (event.cpData.newVal === 1) {
					showCC();
				} else {
					hideCC();
				}
				if (cp.shouldScale) cp.SetScaleAndPosition();

			}, "cpCmndCC");
	}




	function runOnInit(method) {

		if (cpAPIEventEmitter) {
			method();
		} else {
			// Not yet loaded
			var originalComplete = cp.complete;
			cp.complete = function () {
				cp.complete = originalComplete;
				originalComplete();
				method();
			}
		}
	}

	runOnInit(editCC);


}());




