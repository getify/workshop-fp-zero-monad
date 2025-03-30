# Exercise 3 (FP: Zero To Monad - Workshop)

In this exercise, you will fill out the implementation of `computeRec()` (and other functions, as noted with TODO comments) to adhere to the following requirements:

1. accepts an array of values (named `tokens`) as its first parameter, which may include:
    - numbers (`3`, `-7`)
    - arithmetic operators (`"+"`, `"-"`, `"*"`, `"/"`)
    - grouping operators (`"("`, `")"`)
2. the values in this array represent math operations in "infix order" (e.g., `2 + 3 * 4` -- which results in `14`)
3. compute the result of all the math operations (as if entered into a calculator), respecting the grouping precedence as well as operator precedence -- (multiplication/division are higher precedence than addition/subtration) -- and otherwise operates left-to-right
4. If unexpected values or operators (e.g., unbalanced parentheses) are encountered, throw an error
5. Use mutual tail recursion as the primary technique here; THAT is the main exercise focus
6. HINT: think "binary tree" recursion, handling the "left" and "right" sides of any operator, and then the operator's operation itself
7. HINT: achieve tail-recursion by computing operations (e.g., "1 + 2" => "3") which reduce the token list / input set, and passing along the progressively more computed result with fewer tokens at each step
8. NOTE: a "recursive descent" parser like this is fairly challenging and advanced, so don't get discouraged if the domain of this exercise is an uncomfortable stretch. FOCUS ON THE (MUTUAL) RECURSION TASK and understanding how to wire that up.

## Tests

The `runTests(compute)` call invokes the tests (in `./test.js`). It should complete with no failures listed.

## License

All code and documentation are (c) 2025 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
