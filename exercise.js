// TASK: these comments define the exercise tasks
// to complete (like typical "TODO" comments)

import { Maybe, Either, IO, State } from "monio";
import { getReader, tap as tapIO } from "monio/io/helpers";


// *****************************************

const nextTodoID = State(state => {
	var todoCounter = (state.todoCounter ?? 0) + 1;
	return {
		value: todoCounter,
		state: {
			...state,
			todoCounter
		}
	};
});

IO.do(defineApp)
	.run({
		context: document,
		state: {}
	})
	.catch(handleError);


// *****************************************

function getElementById(id) {
	// TASK: define IO that pulls out `context` from
	// its Reader env (aka `document`), invokes
	// `context.getElementById()`, and wraps the result
	// in a `Maybe` (hint: `from()`)
}

function querySelector(selector) {
	// TASK: like `getElementById()`, but with
	// `el.querySelector()`
}

function addClass(className) {
	return el => IO(() => el.classList.add(className));
}

function removeClass(className) {
	// TASK: implement like `addClass()`, but with
	// `.remove()`
}

function toggleClass(className) {
	// TASK: implement like `addClass()`, but with
	// `.toggle()`
}

function matches(selector) {
	return el => IO(() => el.matches(selector));
}

function createElement(elType) {
	return IO(({ context }) => context.createElement(elType));
}

function removeElement(el) {
	// TASK: define an IO that calls `el.remove()`
}

function getAttr(attrName) {
	return el => IO(() => el.getAttribute(attrName));
}

function setAttr(attrName,attrVal) {
	return el => IO(() => (
		el.setAttribute(attrName,attrVal)
	));
}

function setProp(propName,propVal) {
	return el => IO(() => el[propName] = propVal);
}

function getProp(propName) {
	return el => IO(() => el[propName]);
}

function setValue(val) {
	return setProp("value",val);
}

function getValue(el) {
	return getProp("value")(el);
}

function appendTo(parentEl) {
	// TASK: return a function that receives `el`,
	// then defines an IO calls `parentEl.appendChild()`
	// with it
}

function addEventListener(evtName,handler) {
	return el => IO(env => (
		el.addEventListener(evtName,evt => (
			"TASK:" // invoke `handler()`, then invoke the
			// the returned IO's `run()`, and `catch()`
			// any promise exception with `handleError()`
		))
	));
}

function scrollToElement(el) {
	return IO(() => el.scrollIntoView());
}

function focusElement(el) {
	return IO(() => el.focus());
}

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
	return (
		"TASK:" // validate the `s` is non-empty, and <= 50
		// char length; return friendly error messages for
		// *either* case with `Either.Left()`; if validated,
		// wrap `s` in `Either:Right()`
		//
		// NOTE: this is a pure function only, no IO's,
		// side effects, thrown exceptions, etc
	);
}

function *onFormSubmit(evt) {
	yield *(haltEvent(evt));

	// TASK: bind `getReader()` and extract the
	// `state.newTodoInpEl` value from, assign to
	// `newTodoInpEl` variable

	try {
		var newTodoText = (
			"TASK:" // bind `getValue()` for `newTodoInpEl`,
			// and `trim()` its string value
		);

		// note: will throw if validation fails
		yield *(validateNewTodo(newTodoText));
	}
	catch (err) {
		// TASK: display the friendly validation error
		// to the user, then focus the `newTodoInpEl`
		// element
	}

	// TASK: bind `saveNewTodo()` and extract the `id`
	// from its return to assign to `todoID`
	// (hint: yield*)

	yield *(renderTodoElement(todoID,newTodoText));

	// TASK: clear the success/error messages, empty
	// the `newTodoInpEl` element's `value`, and focus
	// the element
}

function *renderTodoElement(todoID,todoText) {
	// TASK: bind `getReader()` and extract the
	// `state.todosEl` value from, assign to `todosEl`
	// variable

	// render Todo <li> element (and scroll it into view)
	return yield *(
		createElement("li")
			.chain(tapIO(setAttr("data-id",todoID)))

			// TASK: add a chain() step that adds the
			// `todo` class to the DOM element, and passes
			// along that element (hint: `tapIO()`)

			.chain(
				tapIO(setProp(
					"innerHTML",
					`<label
						aria-label="Mark Todo Complete"
					>
						<input
							type="checkbox"
							data-id="${todoID}"
							class="mark-todo"
						>
						<span></span>
					</label>
					<button
						type="button"
						data-id="${todoID}"
						class="btn-remove-todo"
						aria-label="Remove Todo"
					>
						🗑
					</button>`
				))
			)

			// TASK: add a chain() step that appends this
			// new DOM element to `todosEl`, and passes
			// along that appended element (hint: `tapIO()`)

			.chain(tapIO(liEl => (
				"TASK:" // find `label > span` child DOM element
				// via `querySelector()` and `liEl`, and set
				// its `innerText` property to `todoText`
			)))
			.chain(scrollToElement)
	);
}

function *onTodosClick(evt) {
	if (yield *(matches(".mark-todo")(evt.target))) {
		let todoID = Number(yield *(getAttr("data-id")(evt.target)));

		// TASK: bind `toggleTodoComplete(todoID)` and
		// catch any exception; halt the event handling
		// display a friendly error: "Todo complete not
		// toggled", then re-throw the exception
		// (hint: return yield *)
	}
	else if (yield *(matches(".btn-remove-todo")(evt.target))) {
		yield *(haltEvent(evt));
		let todoID = Number(yield *(getAttr("data-id")(evt.target)));

		// TASK: bind `removeTodo(todoID)` and catch
		// any exception; display a friendly error: "Todo
		// not removed", then re-throw the exception
		// (hint: return yield *)
	}
}

function *toggleTodoComplete(todoID) {
	// update state
	var { state: newState } = yield *(applyState(
		State.do(function*(){
			// TASK: bind `expectTodoEntry()` to find
			// entry by ID, assign tuple contents as
			// [ `todoRecordIdx`, `todoRecord` ]

			// TASK: define updated Todo record with
			// `complete` boolean flag flipped

			return yield *(State.modify(state => ({
				// TASK: copy existing state contents, and
				// redefine `todos` array to splice in (by
				// index) the updated Todo record (from above),
				// replacing the old record
			})));
		})
	));

	// TASK: find (via `querySelector()` / `newState.todosEl`)
	// the `<li>` with a matching `data-id` (to `todoID`)

	// TASK: toggle the `complete` class on the found `<li>`
	// DOM element
}

function *removeTodo(todoID) {
	// update state
	var {
		value: removedTodoRecord,
		state: newState
	} = yield *(applyState(
		// TASK: similar to `toggleTodoComplete()`, define
		// a State program (chain or State.do() routine)
		// that finds the Todo entry (idx,record), *modifies*
		// the state to remove (by index) the Todo record
		// from the `state.todos` array, and finally returns
		// the removed Todo record
	));

	// TASK: find (via `querySelector()` / `newState.todosEl`)
	// the `<li>` with a matching `data-id` (to `todoID`),
	// and remove if (if found)

	return yield *(
		displaySuccess(`Todo ('${removedTodoRecord.todo}') removed`)
	);
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
		// TASK: define a { value, state } tuple
		// that sets `newTodoRecord` to value
		// and also appends it to the end of
		// the `state.todos` array
	}));
}

function *saveNewTodo(newTodoText){
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
	var newTodoInpEl = yield *(
		// find new-todo form
		expectElement(
			getElementById("add-todo"),
			"Add Todo form missing"
		)
			// setup form submit event handler
			.chain(
				tapIO(addEventListener("submit",evt => (
					IO.doEither(onFormSubmit(evt))
				)))
			)

			// find and focus new-todo input
			.chain(formEl => (
				"TASK:" // find `#new-todo` <input> element
				// using `querySelector()` on the `formEl`
			))
			.chain(tapIO(focusElement))
	);

	var todosEl = yield *(
		"TASK:" // define an IO that finds the `#todos` DOM
		// element, adds a "click" event listener to call
		// the `onTodosClick()` handler, and returns the
		// DOM element back to `todosEl` (hint: `tapIO()`)
	);

	// initialize state
	return yield *(applyState(
		"TASK:" // pass a State program that *modifies*
		// the existing state (inherited from IO Reader
		// context), adding `todos: []`, `newTodoInpEl`,
		// and `todosEl`
	));
}

function *clearSuccessError() {
	// TASK: like `displayError()` and `displaySuccess()`,
	// find both `#success-msg` and `#error-msg` DOM
	// elements, add the `hidden` class, and empty their
	// `innerText` property, respectively
}

function *displaySuccess(msg) {
	// TASK: symmetric with `displayError()`, find the
	// `#error-msg` DOM element, add the `hidden` class
	// to it, and empty its `innerText` property; then
	// find the `#success-msg` DOM element, remove the
	// `hidden` class, set its `innerText` property,
	// and then scroll to the DOM element
}

function *displayError(err) {
	// hide/empty success notification
	yield *(
		expectElement(
			getElementById("success-msg"),
			"Success notification element missing"
		)
			.chain(tapIO(addClass("hidden")))
			.chain(setProp("innerText",""))
	);

	// show/populate error notification
	return yield *(
		"TASK:" // like the block above, define an IO
		// (chain or IO.do() routine) that finds the
		// `#error-msg` DOM element, removes the
		// `hidden` class, and sets the `innerText`
		// property to `err`, and then scrolls to the
		// DOM element
	);
}

function expectElement(elMIO,err) {
	return (
		// bind IO to get element-maybe
		elMIO
			// unwrap element from Maybe
			.chain(elM => elM.fold(
				// element missing? fatal exception
				() => { throw new Error(err); },

				IO.of
			))
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
