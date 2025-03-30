import { IO } from "monio";


export { runTests };


// *****************************************

function deepEqual(a,b) {
	if (a == b) return true;
	if (typeof a != "object" || a == null ||
			typeof b != "object" || b == null) {
		return false;
	}
	let keysA = Object.keys(a);
	let keysB = Object.keys(b);
	if (keysA.length != keysB.length) return false;
	for (let key of keysA) {
		if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
	}
	return true;
}

async function runTests(app) {
	await IO.doEither(function*(){
		var expected = {
			email: "joe@nobody.tld",
			password: "3vA39-$4})}~",
			"success-msg": "Email 'joe@nobody.tld' registered!"
		};

		try {
			var result = yield *(app());
			console.assert(deepEqual(expected,result),"Test 1 Failed: registration did not succeed");
		}
		catch (err) {
			console.log(`Test 1 Failed: ${err}`);
		}
	})
	.run({
		email: "joe@nobody.tld",
		password: "3vA39-$4})}~"
	});

	await IO.doEither(function*(){
		var expected = {
			email: "joe@nobody.tld",
			"error-msg": "Password missing."
		};

		try {
			var result = yield *(app());
			console.assert(deepEqual(expected,result),"Test 2 Failed: validation, missing password");
		}
		catch (err) {
			console.log(`Test 2 Failed: ${err}`);
		}
	})
	.run({
		email: "joe@nobody.tld",
	});

	await IO.doEither(function*(){
		var expected = {
			email: "joe@nobody.tld",
			password: "abc123",
			"error-msg": "Password insufficient."
		};

		try {
			var result = yield *(app());
			console.assert(deepEqual(expected,result),"Test 3 Failed: validation, insufficient password");
		}
		catch (err) {
			console.log(`Test 3 Failed: ${err}`);
		}
	})
	.run({
		email: "joe@nobody.tld",
		password: "abc123"
	});

	console.log("All tests finished.");
}
