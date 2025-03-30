import { runTests } from "./test.js";


runTests(compute);


// *****************************************

function compute(tokens) {
	var [ result, index ] = computeRec(tokens,0,0);

	// TODO: check `index` to detect if there are
	// any leftover tokens; throw an error

	return result;
}

function computeRec(tokens,index = 0,minPrec = 0) {
	// TODO: recursively compute left-hand side (LHS),
	// aka "Primary"
	//
	// TODO: along with LHS, now reduce the rest of
	// tokens (including an operator and right-hand
	// side (RHS), aka "Tail"), to compute the final
	// result
	//
	// TODO: to ensure tail call, remove this...
	return [ /*result*/, /*index*/ ];
}

function computeTail(tokens,index,lhs,minPrec) {
	if (index >= tokens.length) return [ lhs, index ];

	// look-ahead at next token after `lhs` to
	// see if we are done with this RHS/tail?
	var token = tokens[index];
	var isRecognizedOperator = [ "+", "-", "*", "/" ].includes(token);
	if (
		token == ")" ||
		!isRecognizedOperator ||
		precedence(token) < minPrec
	) {
		return [ lhs, index ];
	}

	// NOTE: `token` must be a non-number here;
	// verify it's a recognized operator
	if (!isRecognizedOperator) {
		throw new Error("Unknown operator: " + token);
	}

	// recognized operator must be a higher level of
	// of precedence than current
	var nextMinPrec = precedence(token) + 1;

	// TODO: since we're at a higher level of precedence
	// with this operator, recurse into next token(s) to
	// compute new RHS, taking into account new minimum
	// level of precedence
	var [ rhs, nextIndex ] = TODO(/* .. */);

	// now that we have an LHS, op (token), and an RHS,
	// compute the result as a new partial LHS/primary
	var newLHS = (
		token == "+" ? lhs + rhs :
		token == "-" ? lhs - rhs :
		token == "*" ? lhs * rhs :
		token == "/" ? lhs / rhs :

		/* will never get here */
		null
	);

	// TODO: self-recurse to keep reducing LHS/tail as
	// far as possible
	return TODO(/* .. */);
}

function computePrimary(tokens,index) {
	var token = tokens[index];
	if (token == "(") {
		// TODO: (mutually) recurse to compute a new
		// term that represents the entirety of the
		// operation(s) inside this ( ) grouping
		let [ val, nextIndex ] = TODO(/* .. */);

		// TODO: verify the next token is an expected
		// closing ")"; otherwise, throw error

		// TODO: return back partial primary result
		return [ /* val */, /* index */ ];
	}
	else if (typeof token == "number") {
		return [ token, index + 1 ];
	}
	else {
		throw new Error("Unexpected token: " + token);
	}
}

function precedence(op) {
	if (op == "+" || op == "-") return 1;
	if (op == "*" || op == "/") return 2;
	return 0;
}
