# Exercise 6 (FP: Zero To Monad - Workshop)

In this exercise, you will fill out the implementation of `buildMarkdownList()` to adhere to the following requirements:

1. is a reducer, so accepts two parameters:
    - `markdown` (string) accumulator
    - `id` (number) user ID to look up
2. filter the list of user IDs and compile matching users into the markdown-style list (e.g., `* list item`)
3. use provided functions `lookupUser()`, `filterUser()`, and `markdownList()`

## Tests

The `runTests(buildMarkdownList)` call invokes the tests (in `./test.js`). It should complete with no failures listed.

## License

All code and documentation are (c) 2025 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
