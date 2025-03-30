export { virtualFS, runTests };


// *****************************************

var virtualFS = [
	[
		"logo.png",
		[
			"forest.jpg",
			"mountain.jpg",
			"river.png"
		],
		[
			"cityscape.jpg"
		]
	],
	[
		"thumb1.png",
		"thumb2.png"
	],
	[
		"profile.jpg",
		[
			"project1.png",
			"project2.png",
			"project3.png"
		],
		[
			"exhibit1.jpg",
			"exhibit2.jpg"
		],
		[
			"document.pdf"
		]
	]
];

function arraysEqualSorted(arr1, arr2) {
	if (!(Array.isArray(arr1) && Array.isArray(arr2))) return false;
	if (arr1.length != arr2.length) return false;
	let sorted1 = [...arr1].sort();
	let sorted2 = [...arr2].sort();
	for (let i = 0; i < sorted1.length; i++) {
		if (sorted1[i] != sorted2[i]) return false;
	}
	return true;
}

function runTests(collectFilenames) {
	const expectedAllFiles = [
		"logo.png",
		"forest.jpg",
		"mountain.jpg",
		"river.png",
		"cityscape.jpg",
		"thumb1.png",
		"thumb2.png",
		"profile.jpg",
		"project1.png",
		"project2.png",
		"project3.png",
		"exhibit1.jpg",
		"exhibit2.jpg",
		"document.pdf"
	];
	const expectedPngJpgFiles = [
		"logo.png",
		"forest.jpg",
		"mountain.jpg",
		"river.png",
		"cityscape.jpg",
		"thumb1.png",
		"thumb2.png",
		"profile.jpg",
		"project1.png",
		"project2.png",
		"project3.png",
		"exhibit1.jpg",
		"exhibit2.jpg"
	];
	const fsWithCase = [
		"image.JPG",
		"document.pdf",
		[ "photo.jPg", "diagram.PNG" ]
	];

	console.assert(
		arraysEqualSorted(collectFilenames(virtualFS),expectedAllFiles),
		"Test 1 Failed: Expected all files to be collected."
	);

	console.assert(
		arraysEqualSorted(collectFilenames(virtualFS,["png","jpg"]),expectedPngJpgFiles),
		"Test 2 Failed: Expected only png and jpg files to be collected."
	);

	console.assert(
		arraysEqualSorted(collectFilenames([]),[]),
		"Test 3 Failed: Expected empty array for an empty filesystem."
	);

	console.assert(
		arraysEqualSorted(collectFilenames(virtualFS,["txt"]),[]),
		"Test 4 Failed: Expected empty array when no files match the filter."
	);

	console.assert(
		arraysEqualSorted(collectFilenames(fsWithCase,["jpg"]),["image.JPG","photo.jPg"]),
		"Test 5a Failed: Expected jpg files regardless of case."
	);
	console.assert(
		arraysEqualSorted(collectFilenames(fsWithCase,["png"]),["diagram.PNG"]),
		"Test 5b Failed: Expected png files regardless of case."
	);

	console.log("All tests finished.");
}
