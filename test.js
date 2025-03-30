export { runTests };


// *****************************************

function runTests(curry,looseCurry) {
	function sum3(a,b,c) {
		return a + b + c;
	}
	var curriedSum3 = curry(sum3, 3);
	console.assert(
		typeof curriedSum3 == "function",
		"Test 1.1 Failed: curry() should return a function"
	);
	console.assert(
		typeof curriedSum3(1) == "function",
		"Test 1.2 Failed: After one argument, the result should be a function."
	);
	console.assert(
		typeof curriedSum3(1)(2) == "function",
		"Test 1.3 Failed: After two arguments, the result should be a function."
	);
	console.assert(
		curriedSum3(1)(2)(3) == 6,
		"Test 1.4 Failed: Expected curriedSum3(1)(2)(3) to equal 6."
	);
	console.assert(
		curriedSum3(1,2)(3,4)(5,6) == 9,
		"Test 1.5 Failed: Strict currying, expected curriedSum3(1,2)(3,4)(5,6) to equal 9."
	);

	function concat2(a,b) {
		return a + b;
	}
	var curriedConcat2 = curry(concat2, 2);
	console.assert(
		typeof curriedConcat2("Hello, ") == "function",
		"Test 2.1 Failed: After one argument, the result should be a function."
	);
	console.assert(
		curriedConcat2("Hello, ")("World!") == "Hello, World!",
		"Test 2.2 Failed: Expected curriedConcat2('Hello, ')('World!') to equal 'Hello, World!'."
	);

	function product4(a,b,c,d) {
		return a * b * c * d;
	}
	var curriedProduct4 = curry(product4, 4);
	console.assert(
		typeof curriedProduct4(2) == "function",
		"Test 3.1 Failed: After one argument, the result should be a function."
	);
	console.assert(
		typeof curriedProduct4(2)(3) == "function",
		"Test 3.2 Failed: After two arguments, the result should be a function."
	);
	console.assert(
		typeof curriedProduct4(2)(3)(4) == "function",
		"Test 3.3 Failed: After three arguments, the result should be a function."
	);
	console.assert(
		curriedProduct4(2)(3)(4)(5) == 120,
		"Test 3.4 Failed: Expected curriedProduct4(2)(3)(4)(5) to equal 120."
	);

	var partialSum = curriedSum3(10);
	var result1 = partialSum(20)(30);
	var result2 = partialSum(5)(15);
	console.assert(
		result1 == 60,
		"Test 4.1 Failed: Expected partialSum(20)(30) to equal 60."
	);
	console.assert(
		result2 == 30,
		"Test 4.2 Failed: Expected partialSum(5)(15) to equal 30."
	);

	var lcurriedSum3 = looseCurry(sum3,3);
	console.assert(
		typeof lcurriedSum3 == "function",
		"Test 5.1 Failed: looseCurry() should return a function"
	);
	console.assert(
		typeof lcurriedSum3(1) == "function",
		"Test 5.2 Failed: After one argument, the result should be a function."
	);
	console.assert(
		typeof lcurriedSum3(1)(2) == "function",
		"Test 5.3 Failed: After two arguments, the result should be a function."
	);
	console.assert(
		lcurriedSum3(1)(2)(3) == 6,
		"Test 5.4 Failed: Strict currying, expected lcurriedSum3(1)(2)(3) to equal 6."
	);
	console.assert(
		lcurriedSum3(1,2)(3) == 6,
		"Test 5.5 Failed: Loose currying, expected lcurriedSum3(1,2)(3) to equal 6."
	);
	console.assert(
		lcurriedSum3(1)(2,3) == 6,
		"Test 5.5 Failed: Loose currying, expected lcurriedSum3(1,2)(3) to equal 6."
	);
	console.assert(
		lcurriedSum3(1,2,3) == 6,
		"Test 5.5 Failed: Loose currying, expected lcurriedSum3(1,2,3) to equal 6."
	);

	var lpartialSum = lcurriedSum3(10);
	var result1 = lpartialSum(20,30);
	var result2 = lpartialSum(5,15);
	console.assert(
		result1 == 60,
		"Test 6.1 Failed: Expected lpartialSum(20,30) to equal 60."
	);
	console.assert(
		result2 == 30,
		"Test 6.2 Failed: Expected lpartialSum(5,15) to equal 30."
	);

	console.log("All tests finished.");
}
