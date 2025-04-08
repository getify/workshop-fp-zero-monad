import { runTests } from "./test.js";
import { compute } from "./ex-3-solution.js";


runTests(calc);


// *****************************************

function calc(token) {
	return function next(tokens) {
		if (tokens[tokens.length - 1] == "=") {
			return compute(tokens.slice(0,-1));
		}
		else {
			return token => {
				return next([ ...tokens, token ]);
			};
		}
	}([ token ]);
}
