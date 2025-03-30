export { dataStore, userIDs, runTests };


// *****************************************

var dataStore = {
	101: { name: "Alice", role: "Admin" },
	102: { name: "Bob", role: "User" },
	103: { name: "Charlie", role: "Moderator" },
	104: { name: "Diana", role: "User" }
};

var userIDs = [101, 103, 104];

function runTests(reducer) {
	var expectedOutput = (
		"* Alice (Admin)\n* Charlie (Moderator)"
	);

	var formattedUsers = userIDs.reduce(reducer,"");

	console.assert(formattedUsers == expectedOutput, "Test 1 Failed: Expected formatted markdown list with Alice and Charlie only")

	console.log("All tests finished.");
}
