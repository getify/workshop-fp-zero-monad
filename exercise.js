import { runTests } from "./test.js";


runTests(compute);


// *****************************************

function compute(tokens) {
	var [ result, index ] = computeRec(tokens,0,0);

	// check `index` to detect if there are
	// any leftover tokens
	if (index != tokens.length) {
		throw new Error("Extra tokens at the end");
	}

	return result;
}

function computeRec(tokens,index = 0,minPrec = 0) {
	// recursively compute left-hand side (LHS),
	// aka "Primary"
	var [ lhs, i ] = computePrimary(tokens,index);

	// along with LHS, now reduce the rest of tokens
	// (including an operator and right-hand side (RHS),
	// aka "Tail"), to compute the final result
	return computeTail(tokens,i,lhs,minPrec);
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

	// recurse into next token(s) to compute new RHS,
	// taking into account new minimum level of precedence
	var [ rhs, nextIndex ] = computeRec(tokens,index + 1,nextMinPrec);

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

	// self-recurse to keep reducing LHS/tail as
	// far as possible
	return computeTail(tokens,nextIndex,newLHS,minPrec);
}

function computePrimary(tokens,index) {
	var token = tokens[index];
	if (token == "(") {
		// (mutually) recurse to compute a new
		// term that represents the entirety of the
		// operation(s) inside this ( ) grouping
		let [ val, nextIndex ] = computeRec(tokens,index + 1,0);

		// verify the next token is an expected
		// closing ")"
		if (tokens[nextIndex] != ")") {
			throw new Error("Missing closing parenthesis");
		}

		// return back partial primary result
		return [ val, nextIndex + 1 ];
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
