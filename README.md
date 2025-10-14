# Exercise 8: "Todoovy" (FP: Zero To Monad - Workshop)

In this exercise, you'll be filling out the implementation details of a simple Todo app.

Unlike other exercises, this one is a fully web-based application/UI, so interaction is not on the command line, but in the browser. This is a "vanilla" HTML/CSS/JS app with no framework or build tools.

The focus of the exercise is wiring up IO, State, Either, and Maybe monads for the various tasks in this app. You don't need to invent the architecture/UX of the app, that's already done for you.

1. Pre-requisites: any recent Node and npm, modern browser with devtools.
2. Make sure to run `npm install` to install the `http-server` and Monio dependencies.
3. Run `npm start` from the command line to start a web file server at `http://localhost:8080`, then access that URL in the browser. Make sure to have devtools open while working on/debugging the app.
4. All your code edits are in `exercise.js`. You can consult `index.html`, `exercise.css`, and `test.js`, but you shouldn't need to make any edits to those.
5. There are a bunch of `TASK:` comments (like typical "TODO" comments) throughout the code that represent the exercise tasks for you to tackle.

    They should adequately describe what to do, and provide hints and/or pointers to the surrounding code for the patterns to approach.

    HINT: Pretty much everything that's asked for already has some (reduced) version of that already demonstrated somewhere within the program.
6. Start with the simple helper functions like `getElementById()` and `querySelector()`.
7. Fill out the implementation details of `clearSuccessError()`, `displaySuccess()`, and `displayError()`.
8. Implement `expectTodoEntry()`.
9. Fill out the implementation details of `defineApp()`.
10. Finish the rest of the "TASK:"-marked tasks as you see fit.
11. HINT: when dealing with monads and `console.log()`ing those values, if the value is a monad instance, use `._inspect()` on it to print a debug friendly version of that value.

## Tests

There's a basic "test suite" (also web based, at `/test.html`) included.

## License

All code and documentation are (c) 2025 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
