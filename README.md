# Exercise 7 (FP: Zero To Monad - Workshop)

In this exercise, you will fill out the implementations of `defineApp()` and `validateInput()` (as noted by `// TODO ...` comments) to adhere to the following requirements:

1. if using **node** / **npm**, you'll need to `npm install monio` dependency, or the equivalent for your own environment
2. `validateInput()` already has validation rules for the `email` field, but needs similar rules for `password`:
    - check that `password` is present, and if not, issue an error: `"Password missing."`
    - check that `password` is at least 12 characters long, and if not, issue an error: `"Password insufficient."`
3. `defineApp()` needs to call `validateInput()` (hint: don't forget to `yield *`), and destructure the return to local variables `email` and `password`
4. `defineApp()` then needs to call `submitRegistration()` and `displaySuccess()`, passing expected input arguments

## Tests

The `runTests(defineApp)` call invokes the tests (in `./test.js`). It should complete with no failures listed.

## License

All code and documentation are (c) 2025 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
