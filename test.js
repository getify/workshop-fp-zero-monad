import { test, run, driver } from "./test-runner.js";


// -------------------- test cases --------------------

test("initial UI loads", async ({ waitFor, q, assert }) => {
	await waitFor("form#add-todo");
	assert.ok(q("ul#todos"), "missing todos list");
	assert.ok(q("#success-msg") && q("#error-msg"), "missing message blocks");
});

test("add a todo shows it in the list", async ({ waitFor, type, submit, readTodos, assert }) => {
	const form = await waitFor("form#add-todo");
	const input = await waitFor("#new-todo");
	await type(input, "buy milk");
	await submit(form);
	const todos = readTodos();
	assert.strictEqual(todos.length, 1);
	assert.strictEqual(todos[0].text, "buy milk");
	assert.strictEqual(todos[0].complete, false, "should be incomplete");
});

test("add multiple todos shows them in the list", async ({ waitFor, type, submit, readTodos, assert }) => {
	const form = await waitFor("form#add-todo");
	const input = await waitFor("#new-todo");
	await type(input, "buy milk");
	await submit(form);
	await type(input, "call mom");
	await submit(form);
	await type(input, "trash me");
	await submit(form);

	const todos = readTodos();
	assert.strictEqual(todos.length, 3);
	assert.strictEqual(todos[0].id, 1, "id should be 1");
	assert.strictEqual(todos[0].text, "buy milk");
	assert.strictEqual(todos[0].complete, false, "should be incomplete");
	assert.strictEqual(todos[1].id, 2, "id should be 2");
	assert.strictEqual(todos[1].text, "call mom");
	assert.strictEqual(todos[1].complete, false, "should be incomplete");
	assert.strictEqual(todos[2].id, 3, "id should be 3");
	assert.strictEqual(todos[2].text, "trash me");
	assert.strictEqual(todos[2].complete, false, "should be incomplete");
});

test("toggle marks complete, then unmarks", async ({ waitFor, type, submit, click, readTodos, assert }) => {
	const form = await waitFor("form#add-todo");
	const input = await waitFor("#new-todo");
	await type(input, "call mom");
	await submit(form);

	const cb = await waitFor("ul#todos li.todo input.mark-todo");
	await click(cb);

	let [t] = readTodos();
	assert.ok(t.complete, "todo should be complete after toggle");

	await click(cb);
	[t] = readTodos();
	assert.ok(!t.complete, "todo should now be incomplete after another toggle");
});

test("remove deletes the item and shows success", async ({ waitFor, type, submit, click, readTodos, readMessages, assert }) => {
	const form = await waitFor("form#add-todo");
	const input = await waitFor("#new-todo");
	await type(input, "trash me");
	await submit(form);

	const btn = await waitFor("ul#todos li.todo button.btn-remove-todo");
	await click(btn);

	assert.strictEqual(readTodos().length, 0, "no more todos in list");
	const msg = readMessages();
	assert.ok(msg.success.includes("removed"), "expected a success removal message");
});

test("mark/unmark todo complete in multiple todos list", async ({ waitFor, type, submit, click, readTodos, assert }) => {
	const form = await waitFor("form#add-todo");
	const input = await waitFor("#new-todo");
	await type(input, "buy milk");
	await submit(form);
	await type(input, "call mom");
	await submit(form);
	await type(input, "trash me");
	await submit(form);

	// note: DOM/CSS indexes are 1-based
	const cb = await waitFor("ul#todos li.todo:nth-child(2) input.mark-todo");
	await click(cb);

	let todos = readTodos();
	assert.strictEqual(todos.length, 3);
	assert.strictEqual(todos[0].complete, false, "should be incomplete");
	assert.strictEqual(todos[1].complete, true, "should be complete");
	assert.strictEqual(todos[2].complete, false, "should be incomplete");

	await click(cb);

	todos = readTodos();
	assert.strictEqual(todos.length, 3);
	assert.strictEqual(todos[0].complete, false, "should be incomplete");
	assert.strictEqual(todos[1].complete, false, "should be incomplete");
	assert.strictEqual(todos[2].complete, false, "should be incomplete");
});

test("remove todo from multiple todos list", async ({ waitFor, type, submit, click, readTodos, assert }) => {
	const form = await waitFor("form#add-todo");
	const input = await waitFor("#new-todo");
	await type(input, "buy milk");
	await submit(form);
	await type(input, "call mom");
	await submit(form);
	await type(input, "trash me");
	await submit(form);

	// note: DOM/CSS indexes are 1-based
	const btn = await waitFor("ul#todos li.todo:nth-child(2) button.btn-remove-todo");
	await click(btn);

	let todos = readTodos();
	assert.strictEqual(todos.length, 2);
	assert.strictEqual(todos[0].text, "buy milk");
	assert.strictEqual(todos[1].text, "trash me");
});

test("todo ids always unique", async ({ waitFor, type, submit, click, readTodos, assert }) => {
	const form = await waitFor("form#add-todo");
	const input = await waitFor("#new-todo");
	await type(input, "buy milk");
	await submit(form);
	await type(input, "call mom");
	await submit(form);

	// note: DOM/CSS indexes are 1-based
	const btn = await waitFor("ul#todos li.todo:nth-child(2) button.btn-remove-todo");
	await click(btn);

	await type(input, "trash me");
	await submit(form);

	let todos = readTodos();
	assert.strictEqual(todos.length, 2);
	assert.strictEqual(todos[0].id, 1, "id should be 1");
	assert.strictEqual(todos[0].text, "buy milk");
	assert.strictEqual(todos[1].id, 3, "id should be 3");
	assert.strictEqual(todos[1].text, "trash me");
});

test("add '' (empty) todo shows error", async ({ waitFor, type, submit, readTodos, readMessages, assert }) => {
	const form = await waitFor("form#add-todo");
	const input = await waitFor("#new-todo");
	await submit(form);

	let todos = readTodos();
	assert.strictEqual(todos.length, 0);

	let msg = readMessages();
	assert.ok(msg.error.includes("Please enter some Todo text"), "expected an error message");
});

test("add ' ' (whitespace-only) todo shows error", async ({ waitFor, type, submit, readTodos, readMessages, assert }) => {
	const form = await waitFor("form#add-todo");
	const input = await waitFor("#new-todo");
	await type(input, "  	   ");
	await submit(form);

	let todos = readTodos();
	assert.strictEqual(todos.length, 0);

	let msg = readMessages();
	assert.ok(msg.error.includes("Please enter some Todo text"), "expected an error message");
});


test("add too-long todo shows error", async ({ waitFor, type, submit, readTodos, readMessages, assert }) => {
	const form = await waitFor("form#add-todo");
	const input = await waitFor("#new-todo");
	await type(input, "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz");
	await submit(form);

	let todos = readTodos();
	assert.strictEqual(todos.length, 0);

	let msg = readMessages();
	assert.ok(msg.error.includes("Todo is too long"), "expected an error message");
});

// -------------------- kick off all tests --------------------

run();
