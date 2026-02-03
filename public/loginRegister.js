// ./public/loginRegister.js

// Each of the div handling modules follow this pattern.
// Required imports (used when one div handler calls another) are resolved up front.
// Then, within the handler function, the div and its controls are defined. Also, within the handler function, an event handler is declared to handle mouse clicks within the div.

import { inputEnabled, setDiv } from "./index.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";

let loginRegisterDiv = null;

export const handleLoginRegister = () => {
	loginRegisterDiv = document.getElementById("logon-register");
	const login = document.getElementById("logon");
	const register = document.getElementById("register");

	loginRegisterDiv.addEventListener("click", (event) => {
		if (inputEnabled && event.target.nodeName === "BUTTON") {
			if (event.target === login) {
				showLogin();
			} else if (event.target === register) {
				showRegister();
			}
		}
	});
};

export const showLoginRegister = () => {
	setDiv(loginRegisterDiv);
};
