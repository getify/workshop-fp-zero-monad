import { dataStore, userIDs, runTests } from "./test.js";


var lookupUser = id => dataStore[id];
var filterUser = user => [ "Admin", "Moderator" ].includes(user.role);
var markdownList = (markdown,user) => (
	`${
		markdown != "" ? `${markdown}\n` : ""
	}* ${user.name} (${user.role})`
);

runTests(buildMarkdownList);


// *****************************************

function buildMarkdownList(markdown,id) {
	// TODO: implement per requirements
}
