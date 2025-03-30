# Exercise 2 (FP: Zero To Monad - Workshop)

In this exercise, you will fill out the implementation of `collectFilenames()` to adhere to the following requirements:

1. accepts the `virtualFS` array as its first parameter, and an optional `allowedExtensions` (array) parameter
2. unary, tail-call, self-recursion, depth-first traversal
3. if an entry is itself an array, this represents a sub-directory, so recurse into it
4. if an entry is a string, it's a filename in the current directory
5. if `allowedExtensions` is omitted, all filenames should be selected
6. if `allowedExtensions` is specified as an array of strings (e.g., `["png","gif"]`), then only filenames with a matching `.{EXT}` on the end should be included; make sure the extension matching is case-insensitive (e.g., "PNG" matches "png", etc)

## Tests

The `runTests(collectFilenames)` call invokes the tests (in `./test.js`). It should complete with no failures listed.

## License

All code and documentation are (c) 2025 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
