export { runTests };


// *****************************************

function runTests(compute) {
	function approxEqual(a, b, epsilon = 1e-10) {
		return Math.abs(a - b) < epsilon;
	}

	console.assert(
		compute([2, "+", 3, "*", 4]) == 14,
		"Test 1 failed: 2 + 3 * 4 should equal 14"
	);

	console.assert(
		compute(["(", 2, "+", 3, ")", "*", 4]) == 20,
		"Test 2 failed: (2 + 3) * 4 should equal 20"
	);

	console.assert(
		compute([2, "*", 3, "+", 4]) == 10,
		"Test 3 failed: 2 * 3 + 4 should equal 10"
	);

	console.assert(
		compute([2]) == 2,
		"Test 4 failed: [2] should equal 2"
	);

	console.assert(
		compute([2, "+", 3]) == 5,
		"Test 5 failed: 2 + 3 should equal 5"
	);

	console.assert(
		compute([2, "+", 3, "-", 1]) == 4,
		"Test 6 failed: 2 + 3 - 1 should equal 4"
	);

	console.assert(
		compute([10, "/", 2]) == 5,
		"Test 7 failed: 10 / 2 should equal 5"
	);

	console.assert(
		compute(["(", 1, "+", "(", 2, "*", 3, ")", ")", "*", 4]) == 28,
		"Test 8 failed: (1 + (2 * 3)) * 4 should equal 28"
	);

	console.assert(
		compute([2, "+", 3, "*", 4, "/", 2]) == 8,
		"Test 9 failed: 2 + 3 * 4 / 2 should equal 8"
	);

	try {
		compute([2, "+", 3, "*", 4, 5]); // 5 is an extra token
		console.assert(false, "Test 10 failed: Expected error for extra tokens at the end");
	}
	catch (e) {
		console.assert(true, "Test 10 passed: Error thrown for extra tokens at the end");
	}

	try {
		compute(["(", 2, "+", 3, "*", 4]); // Missing closing ")"
		console.assert(false, "Test 11 failed: Expected error for missing closing parenthesis");
	}
	catch (e) {
		console.assert(true, "Test 11 passed: Error thrown for missing closing parenthesis");
	}

	try {
		compute([]);
		console.assert(false, "Test 12 failed: Expected error for empty input");
	}
	catch (e) {
		console.assert(true, "Test 12 passed: Error thrown for empty input");
	}

	console.assert(
		compute([10, "/", 0]) == Infinity,
		"Test 13 failed: 10 / 0 should equal Infinity"
	);

	console.assert(
		compute([-3, "*", 2]) == -6,
		"Test 14 failed: -3 * 2 should equal -6"
	);

	console.assert(
		approxEqual(compute([2.5, "*", 2]), 5),
		"Test 15 failed: 2.5 * 2 should equal 5 (approximately)"
	);

	console.assert(
		compute(["(", "(", "(", 1, "+", 2, ")", "*", 3, ")", "-", 4, ")"]) == 5,
		"Test 16 failed: (((1 + 2) * 3) - 4) should equal 5"
	);

	try {
		compute([2, "+", 3, ")"]);
		console.assert(false, "Test 17 failed: Expected error for unmatched closing parenthesis");
	}
	catch (err) {
		console.assert(true, "Test 17 passed: Error thrown for unmatched closing parenthesis");
	}

	try {
		compute([2, "+", "a"]);
		console.assert(false, "Test 18 failed: Expected error for invalid token 'a'");
	}
	catch (err) {
		console.assert(true, "Test 18 passed: Error thrown for invalid token 'a'");
	}

	console.assert(
		compute([6, "-", 2, "-", 1]) == 3,
		"Test 19 failed: 6 - 2 - 1 should equal 3"
	);

	console.assert(
		compute([20, "/", 2, "/", 2]) == 5,
		"Test 20 failed: 20 / 2 / 2 should equal 5"
	);

	console.assert(
		approxEqual(compute([2, "*", "(", 3, "+", 4, ")", "-", 5, "/", "(", 6, "-", 2, ")"]), 12.75),
		"Test 21 failed: 2 * (3 + 4) - 5 / (6 - 2) should equal approximately 12.75"
	);

	console.log("All tests finished.");
}
