export { runTests };


// *****************************************

function runTests(calc) {
	console.assert(typeof calc(2) == "function", "Test 1 Failed: Expected calc(2) to return a function");

	console.assert(calc(2)("+")(3)("=") == 5, "Test 2 Failed: Expected calc(2)('+')(3)('=') to equal 5");

	var twoPlus = calc(2)("+");
	console.assert(twoPlus(3)("=") == 5, "Test 3 Failed: Expected twoPlus(3)('=') to equal 5");
	console.assert(twoPlus(4)("=") == 6, "Test 4 Failed: Expected twoPlus(4)('=') to equal 6");

	console.assert(calc(2)("+")(3)("*")(4)("=") == 14, "Test 5 Failed: Expected calc(2)('+')(3)('*')(4)('=') to equal 14");

	var exprA = calc(10)("-")(2);
	var exprB = calc(10)("-")(3);
	console.assert(exprA("=") == 8, "Test 6 Failed: Expected exprA('=') to equal 8");
	console.assert(exprB("=") == 7, "Test 7 Failed: Expected exprB('=') to equal 7");

	console.log("All tests finished.");
}
