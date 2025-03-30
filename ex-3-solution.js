export { compute };


// *****************************************

function compute(tokens) {
	var [ result, index ] = computeRec(tokens,0,0);
	if (index != tokens.length) {
		throw new Error("Extra tokens at the end");
	}
	return result;
}

function computeRec(tokens,index = 0,minPrec = 0) {
	var [ lhs, i ] = computePrimary(tokens,index);
	return computeTail(tokens,i,lhs,minPrec);
}

function computeTail(tokens,index,lhs,minPrec) {
	if (index >= tokens.length) return [ lhs, index ];

	var token = tokens[index];
	if (
		token == ")" ||
		![ "+", "-", "*", "/" ].includes(token) ||
		precedence(token) < minPrec
	) {
		return [ lhs, index ];
	}

	var tokenPrec = precedence(token);
	var nextMinPrec = tokenPrec + 1;
	var [ rhs, nextIndex ] = computeRec(tokens,index + 1,nextMinPrec);
	var newLHS = (
		token == "+" ? lhs + rhs :
		token == "-" ? lhs - rhs :
		token == "*" ? lhs * rhs :
		token == "/" ? lhs / rhs :
		null
	);
	if (newLHS == null) {
		throw new Error("Unknown operator: " + token);
	}

	return computeTail(tokens,nextIndex,newLHS,minPrec);
}

function computePrimary(tokens,index) {
	var token = tokens[index];
	if (token == "(") {
		let [ val, nextIndex ] = computeRec(tokens,index + 1,0);
		if (tokens[nextIndex] != ")") {
			throw new Error("Missing closing parenthesis");
		}
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
