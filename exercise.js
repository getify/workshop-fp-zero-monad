import { Maybe, Either, IO, State } from "monio";
import { getReader, tap as tapIO } from "monio/io/helpers";


// *****************************************

const nextTodoID = State(state => {
	// TASK: this State program should increment
	// an existing `state.todoCounter` by 1
	// (with default if it doesn't yet exist),
	// set the updated counter into the `value`
	// slot, and append/update the `todoCounter`
	// property of the `state` slot
});

// TASK: use IO.do() to invoke `defineApp()`, run
// the IO, pass in context/state, and catch any
// errors on the returned promise


// *****************************************

function getElementById(id) {
	return IO(({ context }) => (
		Maybe.from(context.getElementById(id))
	));
}

// TASK: define the following helpers (using IO),
// as needed, similar to getElementById() above:
//   querySelector(), addClass(), removeClass(),
//   toggleClass(), matches(), createElement(),
//   removeElement(), getAttr(), setAttr(),
//   getProp(), setProp(), getValue(), setValue(),
//   appendTo(), addEventListener(), scrollToElement(),
//   and focusElement()

function *applyState(computeState) {
	var { state: curState } = yield *(getReader());
	var res = computeState.evaluate(curState);

	// empty existing state
	// note: willfully "unsafe" here; in-place
	// mutating a Reader cell (env.state)
	for (let key of Object.keys(curState)) {
		delete curState[key];
	}

	// preserve new state
	Object.assign(curState,res.state);

	return res;
}

function haltEvent(evt) {
	return IO(() => {
		evt.preventDefault();
		evt.stopPropagation();
		evt.stopImmediatePropagation();
	});
}

function validateNewTodo(s) {
	// TASK: lift `s` to an Either; validate it
	// (non-empty, <= 50 chars), return friendly
	// error messages as Either:Left, or the
	// validated value as Either:Right
}

function *onFormSubmit(evt) {
	// TASK: define do-either routine that pulls
	// the new Todo text from the <input> element,
	// validates it, saves it, renders the <li>
	// element, clears any success/error, clears
	// the <input> element, and focuses it
}

function *renderTodoElement(todoID,todoText) {
	// TASK: define IO do-routine to create and populate
	// <li> element for new Todo, making sure the
	// `todoID` is set into `data-id` attributes on the
	// <li>, the <input type=checkbox> element, and the
	// remove <button>; set the `todoText` via `innerText`
	// to avoid XSS injection; scroll to the new element
	//
	// innerHTML hint:
	//
	// <label
	// 	aria-label="Mark Todo Complete"
	// >
	// 	<input
	// 		type="checkbox"
	// 		data-id=".."
	// 		class="mark-todo"
	// 	>
	// 	<span></span>
	// </label>
	// <button
	// 	type="button"
	// 	data-id=".."
	// 	class="btn-remove-todo"
	// 	aria-label="Remove Todo"
	// >
	// 	🗑
	// </button>
}

function *onTodosClick(evt) {
	// TASK: define IO do-routine to handle clicks
	// on the `.mark-todo` and `.btn-remove-todo`
	// controls, respectively calling toggleTodoComplete()
	// or removeTodo(); display friendly error to user
	// if either fails; hint: pull out the `data-id` attr
	// value to pass to these functions
}

function *toggleTodoComplete(todoID) {
	// TASK: define IO do-routine that runs and applies
	// a State program to find and update the matching
	// record in `state.todos` (hint: `expectTodoEntry()`
	// and `State.modify()`); then find the <li> and
	// toggles its `complete` class name
}

function *removeTodo(todoID) {
	// TASK: define IO do-routine that runs and applies
	// a State program to find and remove the matching
	// record in `state.todos` (hint: `expectTodoEntry()`
	// and `State.modify()`); then find the <li> and
	// remove it from the DOM, and display a friendly
	// success message
}

function makeTodoRecord(newTodoText) {
	return todoID => ({
		id: todoID,
		todo: newTodoText,
		complete: false
	});
}

function appendTodoRecord(newTodoRecord) {
	return State(state => ({
		// TASK: define State program that returns
		// `newTodoRecord` in the `value` slot, and
		// appends it to the `state.todos` list
	}));
}

function saveNewTodo(newTodoText){
	// pull Todo entry from { value, state } result
	var { value: newTodoEntry } = yield *(
		applyState(
			// TASK: define State program (chain or State.do()
			// routine) that binds `nextTodoID` State program to get
			// a new `todoID`, call makeTodoRecord(), and finally
			// pass that to `appendTodoRecord()`
			// (hint: State.do())
		)
	);

	return newTodoEntry;
}

function *defineApp() {
	// TASK: define IO that finds the `#add-todo`
	// <form> element (hint: `getElementById()`),
	// adds a "submit" event handler (`onFormSubmit()`),
	// finds the `#new-todo` <input> element inside the
	// <form> and focuses it; keep a reference to
	// this <input> element to store in `state`

	// TASK: similarly, find the `#todos` <ul> element
	// and add a "click" event handler (`onTodosClick()`)

	// TASK: define and *apply* a State program that
	// initializes the Reader `state` with an empty
	// `todos` list, and stored references to the
	// <input> and <ul> elements
}

function *clearSuccessError() {
	// TASK: find `#error-msg` element, add
	// the "hidden" class, and empty its
	// `innerText` property

	// TASK: find `#success-msg` element, add
	// the "hidden" class, and empty its
	// `innerText` property
}

function *displaySuccess(msg) {
	// TASK: find `#error-msg` element, add
	// the "hidden" class, and empty its
	// `innerText` property

	// TASK: find `#success-msg` element,
	// remove the "hidden" class, set its
	// `innerText` property to `msg`, and
	// scroll to it
}

function *displayError(err) {
	// TASK: find `#success-msg` element, add
	// the "hidden" class, and empty its
	// `innerText` property

	// TASK: find `#error-msg` element,
	// remove the "hidden" class, set its
	// `innerText` property to `err`, and
	// scroll to it
}

function expectElement(elMIO,err) {
	return (
		"TASK:" // extract the Maybe<el> from
		// `elMIO`, and use fold() as a natural
		// transformation, to an IO<el>, or
		// `throw` an exception if not found
	);
}

function *expectTodoEntry(todoID,errMsg) {
	// TASK: look in the state (inherited from the
	// IO Reader context) for the `todos` array; if
	// not found, `throw new Error(errMsg)`; if found,
	// return the "entry" (array tuple `[ index, value ]`)
}

function handleError(err) {
	if (typeof err?._inspect == "function") {
		if (typeof err.fold == "function") {
			err.fold(
				handleError,
				handleError
			);
		}
		else {
			console.error(err._inspect());
		}
	}
	else {
		console.error(err?.stack ?? err?.toString?.());
	}
}
