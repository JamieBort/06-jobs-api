// ./public/register.js

// Each of the div handling modules follow this pattern.
// Required imports (used when one div handler calls another) are resolved up front.
// Then, within the handler function, the div and its controls are defined. Also, within the handler function, an event handler is declared to handle mouse clicks within the div.

import {
	inputEnabled,
	setDiv,
	message,
	token,
	enableInput,
	setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showJobs } from "./jobs.js";

let registerDiv = null;
let name = null;
let email1 = null;
let password1 = null;
let password2 = null;

export const handleRegister = () => {
	registerDiv = document.getElementById("register-div");
	name = document.getElementById("name");
	email1 = document.getElementById("email1");
	password1 = document.getElementById("password1");
	password2 = document.getElementById("password2");
	const registerButton = document.getElementById("register-button");
	const registerCancel = document.getElementById("register-cancel");

	registerDiv.addEventListener("click", (e) => {
		if (inputEnabled && e.target.nodeName === "BUTTON") {
			if (e.target === registerButton) {
				showJobs();
			} else if (e.target === registerCancel) {
				showLoginRegister();
			}
		}
	});
};

export const showRegister = () => {
	email1.value = null;
	password1.value = null;
	password2.value = null;
	setDiv(registerDiv);
};
