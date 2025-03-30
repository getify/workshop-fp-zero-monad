# Exercise 5 (FP: Zero To Monad - Workshop)

In this exercise, you will fill out the implementation of `calc()` to adhere to the following requirements:

1. accepts a `token` parameter
2. should behave as strict, but variadic curried (see previous Exercise 4)
3. if the input is NOT the string `"="`, should collect the token into an array, and return a function expecting the next input
4. once the `"="` input is received, should pass all collected tokens (but not the `"="`) into the `compute()` function, as provided (same as from Exerise 3)

## Tests

The `runTests(calc)` call invokes the tests (in `./test.js`). It should complete with no failures listed.

## License

All code and documentation are (c) 2025 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
