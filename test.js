export { users, runTests };


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

function deepClone(obj) {
	if (obj == null || typeof obj != "object") return obj;
	if (Array.isArray(obj)) {
		return obj.map(deepClone);
	}
	let clone = {};
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			clone[key] = deepClone(obj[key]);
		}
	}
	return clone;
}

var users = [
	{ name: "Bob", email: "bob@example.com", verified: false },
	{ name: "Charlie", email: "charlie@example.com", verified: true }
	{ name: "Alice", email: "alice@example.com", verified: true },
];

function runTests(selectUsers) {
	var originalUsers = deepClone(users);

	var result = selectUsers(users);

	var expected = [
		{ name: "Alice", email: "alice@example.com" },
		{ name: "Charlie", email: "charlie@example.com" }
	];

	console.assert(deepEqual(result, expected),
		"Test 1 Failed: Output does not match expected result.");

	console.assert(deepEqual(users, originalUsers),
		"Test 2 Failed: Original users array was mutated.");

	result?.forEach(function(user) {
		var origUser = users.find(function(u) { return u.name == user.name; });
		console.assert(user != origUser,
			"Test 3 Failed: Returned object is the same reference as an input object.");
	});

	console.log("All tests finished.");
}
