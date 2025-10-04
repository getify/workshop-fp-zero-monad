import { users, runTests } from "./test.js";


runTests(selectUsers);


// *****************************************

function selectUsers(users) {
	var result = [];

	for (let user of users) {
		if (user.verified) {
			let newUser = { name: user.name, email: user.email };
			result = [ ...result, newUser ];
		}
	}

	result.sort((a,b) => (
		(a.name < b.name) ? -1 :
		(a.name > b.name) ? 1 :
		0
	));

	return result;
}
