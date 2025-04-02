# Exercise 1 (FP: Zero To Monad - Workshop)

In this exercise, you will fill out the implementation of `selectUsers()` to adhere to the following requirements:

1. accept the `users` array as its only parameter
2. return a new list of selected users, without modifying the original list
3. select only the entries which have `verified: true`
4. *copy* the contents of the entry to a new object (in the new list), including only the `name` and `email` properties
5. sort the new list alphabetically, on the `name` property (hint: array `sort(fn)`)

## Tests

The `runTests(selectUsers)` call invokes the tests (in `./test.js`). It should complete with no failures listed.

## License

All code and documentation are (c) 2025 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
