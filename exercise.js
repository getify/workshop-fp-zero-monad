import { runTests } from "./test.js";


runTests(curry,looseCurry);


// *****************************************

function curry(fn,n) {
	return (function curried(prevArgs){
		return arg => {
			var args = [ ...prevArgs, arg ];
			if (args.length == n) {
				return fn(...args);
			}
			else {
				return curried(args);
			}
		};
	})([]);
}

function looseCurry(fn,n) {
	return (function curried(prevArgs){
		return (...nextArgs) => {
			var args = [ ...prevArgs, ...nextArgs ];
			if (args.length >= n) {
				return fn(...args);
			}
			else {
				return curried(args);
			}
		};
	})([]);
}
