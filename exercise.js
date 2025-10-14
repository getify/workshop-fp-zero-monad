import { runTests } from "./test.js";


runTests(compute);


// *****************************************

function compute(tokens) {
	var [ result, index ] = computeRec(tokens,0,0);
	return result;
}

function computeRec(/* TODO */) {
	// TODO
	// computePrimary(..)
	// computeTail(..)
}

function precedence(op) {
	if (op == "+" || op == "-") return 1;
	if (op == "*" || op == "/") return 2;
	return 0;
}
