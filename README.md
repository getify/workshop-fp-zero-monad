# Exercise 4 (FP: Zero To Monad - Workshop)

In this exercise, you will fill out the implementations of `curry()` and `looseCurry()` to adhere to the following requirements:

1. accepts a `fn` parameter (function to curry) and an `n` parameter (count of inputs to expect)
2. for `curry()`, the returned function should expect exactly one argument at a time; it should keep returning such a function until the `n` count of inputs have been provided
3. for `looseCurry()`, the returned function should accept 0 or more arguments at a time; it should keep returning such a function until the `n` count of inputs have been provided
4. once all inputs are provided, the underlying `fn` function should be called with all these arguments passed individually, in order, and the result returned
5. each intermediate returned curried function (e.g., `curry(fn,5)(1)(2)`) must keep its own state (via closure), such that this function could be stored and called multiple times with different subsequent inputs -- no mutation over the closure state allowed!

## Tests

The `runTests(curry,looseCurry)` call invokes the tests (in `./test.js`). It should complete with no failures listed.

## License

All code and documentation are (c) 2025 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
