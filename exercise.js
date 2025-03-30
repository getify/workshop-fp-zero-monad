import { Maybe, Either, IO } from "monio";
import { $ } from "monio/util";
import { runTests } from "./test.js";


runTests(defineApp);


// *****************************************

function *defineApp() {
	try {
		// TODO: implement per requirements
	}
	catch (err) {
		return yield *(displayError(err));
	}
}

function requireField(maybe,msg) {
	return maybe.fold(
		() => Either.Left(msg),
		Either.Right
	);
}

function *validateInput() {
	var email = yield *(getElementValueById("email"));

	// validate email
	email = yield *(
		requireField(email,"Email missing.")
			.map(emailAddr => emailAddr.trim())
			.chain(emailAddr => (
				/^[^@]+@[^@.]+(\.[^@.]+)+$/.test(emailAddr) ?
					Either.Right(emailAddr) :
					Either.Left("Email invalid.")
			))
	);

	// TODO: implement per requirements

	return { email };
}

function displayError(err) {
	return IO(env => {
		env["error-msg"] = err;
		return env;
	});
}

function displaySuccess(email) {
	return IO(env => {
		env["success-msg"] = `Email '${email}' registered!`;
		return env;
	});
}

function submitRegistration(email,password) {
	// mock/fake delay
	return IO(() => new Promise(res => setTimeout(res,250)));
}

function getElementValueById(id) {
	return IO(env => Maybe.from(env[id]));
}
