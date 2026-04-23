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
	return IO(({ context }) => (
		Maybe.from(context.getElementById(id))
	));
}

function querySelector(selector) {
	return el => IO(() => (
		Maybe.from(el.querySelector(selector))
	));
}

function addClass(className) {
	return el => IO(() => el.classList.add(className));
}

function removeClass(className) {
	return el => IO(() => el.classList.remove(className));
}

function toggleClass(className) {
	return el => IO(() => el.classList.toggle(className));
}

function matches(selector) {
	return el => IO(() => el.matches(selector));
}

function createElement(elType) {
	return IO(({ context }) => context.createElement(elType));
}

function removeElement(el) {
	return IO(() => el.remove());
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
	return el => IO(() => parentEl.appendChild(el));
}

function addEventListener(evtName,handler) {
	return el => IO(env => (
		el.addEventListener(evtName,evt => (
			handler(evt)
				.run(env)
				.catch(handleError)
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
		s == "" ? Either.Left("Please enter some Todo text") :
		s.length > 50 ? Either.Left("Todo is too long") :
		Either.Right(s)
	);
}

function *onFormSubmit(evt) {
	yield *(haltEvent(evt));

	var { state: { newTodoInpEl } } = yield *(getReader());

	try {
		var newTodoText = (
			(yield *(getValue(newTodoInpEl))).trim()
		);

		// note: will throw if validation fails
		yield *(validateNewTodo(newTodoText));
	}
	catch (err) {
		yield *(displayError(err));
		return yield *(focusElement(newTodoInpEl));
	}

	var { id: todoID } = yield *(saveNewTodo(newTodoText));

	yield *(renderTodoElement(todoID,newTodoText));

	// reset input/form
	yield *(clearSuccessError());
	yield *(setValue("")(newTodoInpEl));
	return yield *(focusElement(newTodoInpEl));
}

function *renderTodoElement(todoID,todoText) {
	var { state: { todosEl } } = yield *(getReader());

	// render Todo <li> element (and scroll it into view)
	return yield *(
		createElement("li")
			.chain(tapIO(setAttr("data-id",todoID)))
			.chain(tapIO(addClass("todo")))
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
			.chain(tapIO(appendTo(todosEl)))
			.chain(tapIO(liEl => (
				expectElement(
					querySelector("label > span")(liEl),
					"Label Span element not found"
				)
					.chain(setProp("innerText",todoText))
			)))
			.chain(scrollToElement)
	);
}

function *onTodosClick(evt) {
	if (yield *(matches(".mark-todo")(evt.target))) {
		let todoID = Number(yield *getAttr("data-id")(evt.target));
		try {
			return yield *(toggleTodoComplete(todoID));
		}
		catch (err) {
			yield *(haltEvent(evt));
			yield *(displayError("Todo complete not toggled"));
			throw err;
		}
	}
	else if (yield *(matches(".btn-remove-todo")(evt.target))) {
		yield *(haltEvent(evt));
		let todoID = Number(yield *(getAttr("data-id")(evt.target)));
		try {
			return yield *(removeTodo(todoID));
		}
		catch (err) {
			yield *(displayError("Todo not removed"));
			throw err;
		}
	}
}

function *toggleTodoComplete(todoID) {
	// update state
	var { state: newState } = yield *(applyState(
		State.do(function*(){
			// find Todo record (throws if not found)
			var [ todoRecordIdx, todoRecord ] = (
				yield *(expectTodoEntry(
					todoID,
					`Todo (${todoID}) state record not found`
				)
			));

			// update Todo record
			var updatedTodoRecord = {
				...todoRecord,

				// toggle complete flag
				complete: !todoRecord.complete
			};

			// update state
			return yield *(State.modify(state => ({
				...state,

				// splice in updated Todo record
				todos: [
					...state.todos.slice(0,todoRecordIdx),
					updatedTodoRecord,
					...state.todos.slice(todoRecordIdx + 1)
				]
			})));
		})
	));

	// toggle completed visual marking for Todo element
	var todoElement = yield	*(expectElement(
		querySelector(`li[data-id='${todoID}']`)(newState.todosEl),
		`Todo (${todoID}) element not found`
	));
	return yield *(toggleClass("complete")(todoElement));
}

function *removeTodo(todoID) {
	// update state
	var {
		value: removedTodoRecord,
		state: newState
	} = yield *(applyState(
		State.do(function*(){
			// find Todo record (throws if not found)
			var [ todoRecordIdx, todoRecord ] = (
				yield *(expectTodoEntry(
					todoID,
					`Todo (${todoID}) state record not found`
				))
			);

			// update state
			yield *(State.modify(state => ({
				...state,

				// remove Todo record
				todos: [
					...state.todos.slice(0,todoRecordIdx),
					...state.todos.slice(todoRecordIdx + 1)
				]
			})));

			return todoRecord;
		})
	));

	// remove Todo element
	var todoElement = yield *(expectElement(
		querySelector(`li[data-id='${todoID}']`)(newState.todosEl),
		`Todo (${todoID}) element not found`
	));
	yield *(removeElement(todoElement));

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
		value: newTodoRecord,
		state: {
			...state,
			todos: [ ...state.todos, newTodoRecord ]
		}
	}));
}

function *saveNewTodo(newTodoText){
	// pull Todo entry from { value, state } result
	var { value: newTodoEntry } = yield *(
		applyState(
			State.do(function*(){
				var todoID = yield *(nextTodoID);
				var todoRecord = makeTodoRecord(newTodoText)(todoID);
				return yield *(appendTodoRecord(todoRecord));
			})
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
				expectElement(
					querySelector("#new-todo")(formEl),
					"New Todo input element missing"
				)
			))
			.chain(tapIO(focusElement))
	);

	var todosEl = yield *(
		// find Todos list element
		expectElement(
			getElementById("todos"),
			"Todos list element missing"
		)
			// setup click handler for todo items
			.chain(
				tapIO(addEventListener("click",evt => (
					IO.do(onTodosClick(evt))
				)))
			)
	);

	// initialize state
	return yield *(applyState(
		State.modify(state => {
			return {
				...state,
				todos: [],
				newTodoInpEl,
				todosEl
			};
		})
	));
}

function *clearSuccessError() {
	// hide/empty error notification
	yield *(
		expectElement(
			getElementById("error-msg"),
			"Error notification element missing"
		)
			.chain(tapIO(addClass("hidden")))
			.chain(setProp("innerText",""))
	);

	// hide/empty success notification
	return yield *(
		expectElement(
			getElementById("success-msg"),
			"Success notification element missing"
		)
			.chain(tapIO(addClass("hidden")))
			.chain(setProp("innerText",""))
	);
}

function *displaySuccess(msg) {
	// hide/empty error notification
	yield *(
		expectElement(
			getElementById("error-msg"),
			"Error notification element missing"
		)
			.chain(tapIO(addClass("hidden")))
			.chain(setProp("innerText",""))
	);

	// show/populate success notification
	return yield *(
		expectElement(
			getElementById("success-msg"),
			"Success notification element missing"
		)
			.chain(tapIO(removeClass("hidden")))
			.chain(tapIO(setProp("innerText",msg)))
			.chain(scrollToElement)
	);
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
		expectElement(
			getElementById("error-msg"),
			"Error notification element missing"
		)
			.chain(tapIO(removeClass("hidden")))
			.chain(tapIO(setProp("innerText",err)))
			.chain(scrollToElement)
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
	var curState = yield *(State.get());

	var recordIdx = curState.todos.findIndex(
		rec => rec.id == todoID
	);

	if (recordIdx == -1) {
		throw new Error(errMsg);
	}

	return [ recordIdx, curState.todos[recordIdx] ];
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
