import { virtualFS, runTests } from "./test.js";


runTests(collectFilenames);


// *****************************************

function strLower(str) { return str?.toLowerCase(); }

function collectFilenames(fs,allowedExtensions,filenames = []) {
	if (fs.length == 0) return filenames;
	if (allowedExtensions != null) {
		allowedExtensions = allowedExtensions.map(strLower);
	}

	var [ entry, ...tail ] = fs;

	if (Array.isArray(entry)) {
		return collectFilenames([ ...entry, ...tail ],allowedExtensions,filenames);
	}
	else if (typeof entry == "string") {
		let entryExt = strLower(entry.match(/\.(.+)$/)?.[1]);
		if (
			!allowedExtensions ||
			allowedExtensions.includes(entryExt)
		) {
			filenames = [ ...filenames, entry ];
		}

		return collectFilenames(tail,allowedExtensions,filenames);
	}
}
