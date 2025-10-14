const iframe = document.getElementById("app-frame");
const resultsEl = document.getElementById("results");
const summaryEl = document.getElementById("summary");
const resetBtn = document.getElementById("reset-app");
const runAllBtn = document.getElementById("run-all");
const modeIndicatorEl = document.getElementById("mode-indicator");
const tests = [];

// handler
resetBtn?.addEventListener("click", async () => {
  resetBtn.disabled = true;
  try { await reloadApp(); } finally { resetBtn.disabled = false; }
});
runAllBtn?.addEventListener("click", () => setParam("t", null));

export function test(name, fn) { tests.push({ name, fn }); }
export { run };

// -------------------- tiny asserts --------------------
const fmt = v => (typeof v === "string" ? `"${v}"` : JSON.stringify(v));
const assert = {
	ok(cond, msg = "expected truthy") {
		if (!cond) throw new Error(msg);
	},
	equal(actual, expected, msg) {
		// Intentional loose eq to align with your workshop style
		if (actual != expected) {
			throw new Error(msg || `expected ${fmt(expected)}, got ${fmt(actual)}`);
		}
	},
	strictEqual(actual, expected, msg) {
		if (actual !== expected) {
			throw new Error(msg || `expected (===) ${fmt(expected)}, got ${fmt(actual)}`);
		}
	},
	deepEqual(actual, expected, msg) {
		const a = JSON.stringify(actual);
		const b = JSON.stringify(expected);
		if (a !== b) throw new Error(msg || `expected ${b}, got ${a}`);
	},
};

// -------------------- URL helpers --------------------
function getParam(name) {
	return new URLSearchParams(location.search).get(name);
}
function setParam(name, value) {
	const u = new URL(location.href);
	if (value === null || value === undefined) u.searchParams.delete(name);
	else u.searchParams.set(name, value);
	location.href = u.toString();
}
function inSingleMode() {
	const t = getParam("t");
	return t !== null && t !== "";
}

// -------------------- per-test app boot/reset --------------------
function reloadApp() {
	return new Promise((resolve) => {
		const onLoad = () => {
			iframe.removeEventListener("load", onLoad);
			resolve(iframe.contentWindow);
		};
		iframe.addEventListener("load", onLoad, { once: true });
		// force reload even if same src
		const url = new URL(iframe.src, location.href);
		url.searchParams.set("_t", String(Date.now()));
		iframe.src = url.toString();
	});
}

// -------------------- DOM driver utilities --------------------
function q(win, sel, root) { return (root || win.document).querySelector(sel); }
function qa(win, sel, root) { return [...(root || win.document).querySelectorAll(sel)]; }

async function waitFor(win, sel, { timeout = 1000, root } = {}) {
	const start = performance.now();
	for (;;) {
		const el = q(win, sel, root);
		if (el) return el;
		if (performance.now() - start > timeout) throw new Error(`waitFor timeout: ${sel}`);
		await tick();
	}
}
function tick() { return new Promise(r => setTimeout(r, 0)); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function type(win, el, value, { clear = true, enter = false } = {}) {
	if (clear) el.value = "";
	el.value = value;
	el.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
	if (enter) {
		el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
		el.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
	}
	await tick();
}
async function click(win, el) {
	el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
	await tick();
}
async function submit(win, form) {
	form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
	await tick();
}

function readTodos(win) {
	const items = qa(win, "ul#todos > li.todo");
	return items.map(li => ({
		id: Number(li.getAttribute("data-id")),
		text: (li.querySelector("label > span") || {}).innerText || "",
		complete: li.classList.contains("complete"),
	}));
}
function readMessages(win) {
	const succ = q(win, "#success-msg");
	const err = q(win, "#error-msg");
	const visibleText = el => el && !el.classList.contains("hidden") ? el.innerText : "";
	return { success: visibleText(succ), error: visibleText(err) };
}

// Export driver for test cases to use
export const driver = {
	tick, sleep,
	// The rest are injected per test with bound `win` for safety.
};

// reporter
function reportItem({ index, name, err }) {
	const wrapper = document.createElement("div");
	const actions = document.createElement("span");
	actions.className = "test-actions";

	const rerunBtn = document.createElement("button");
	rerunBtn.textContent = "Run";
	rerunBtn.title = "Run this test only";
	rerunBtn.addEventListener("click", () => setParam("t", String(index)));

	actions.appendChild(rerunBtn);

	if (err) {
		wrapper.className = "fail";
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		summary.textContent = `✗ [${index}] ${name}`;
		const pre = document.createElement("pre");
		pre.textContent = (err && (err.stack || err.message || String(err))) || "Unknown error";
		details.appendChild(summary);
		details.appendChild(pre);
		details.appendChild(actions);
		wrapper.appendChild(details);
	} else {
		wrapper.className = "pass";
		const line = document.createElement("div");
		line.textContent = `✓ [${index}] ${name}`;
		line.appendChild(actions);
		wrapper.appendChild(line);
	}
	resultsEl.appendChild(wrapper);
}

function setModeIndicator() {
	const t = getParam("t");
	if (inSingleMode()) {
		modeIndicatorEl.textContent = `Single-test mode (t=${t})`;
		runAllBtn.style.display = "";
	} else {
		modeIndicatorEl.textContent = "Suite mode";
		runAllBtn.style.display = "none";
	}
}

// test runner
async function run() {
	setModeIndicator();
	resultsEl.textContent = "";
	summaryEl.textContent = "—";

	const only = getParam("t");
	let plan = [];

	if (only !== null) {
		const idx = Number(only);
		if (!Number.isInteger(idx) || idx < 0 || idx >= tests.length) {
			reportItem({ index: -1, name: "invalid selection", err: new Error(`No test at index ${only}`) });
			summaryEl.textContent = `0 passed, 1 failed, 1 total`;
			return;
		}
		plan = [{ index: idx, ...tests[idx] }];
	} else {
		plan = tests.map((t, i) => ({ index: i, ...t }));
	}

	let pass = 0, fail = 0;

	for (const { index, name, fn } of plan) {
		try {
			const win = await reloadApp();
			await fn({
				win,
				q: (sel, root) => q(win, sel, root),
				qa: (sel, root) => qa(win, sel, root),
				waitFor: (sel, opts) => waitFor(win, sel, opts),
				type: (el, v, opts) => type(win, el, opts ? v : v, opts), // keep arg order
				click: el => click(win, el),
				submit: form => submit(win, form),
				readTodos: () => readTodos(win),
				readMessages: () => readMessages(win),
				tick, sleep,
				assert,
			});
			reportItem({ index, name });
			pass++;
		} catch (err) {
			reportItem({ index, name, err });
			fail++;
		}
	}

	if (only == null) {
		await reloadApp();
	}

	summaryEl.textContent = `${pass} passed, ${fail} failed, ${plan.length} total`;
	if (fail) console.error(`${fail} test(s) failed`);
	else console.log(`All ${pass} test(s) passed`);
}
