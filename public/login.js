// ./public/login.js

// Each of the div handling modules follow this pattern.
// Required imports (used when one div handler calls another) are resolved up front.
// Then, within the handler function, the div and its controls are defined. Also, within the handler function, an event handler is declared to handle mouse clicks within the div.

import {
	inputEnabled,
	setDiv,
	// token, // NOTE: not used.
	message,
	enableInput,
	setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showJobs } from "./jobs.js";

let loginDiv = null;
let email = null;
let password = null;

export const handleLogin = () => {
	loginDiv = document.getElementById("logon-div");
	email = document.getElementById("email");
	password = document.getElementById("password");
	const logonButton = document.getElementById("logon-button");
	const logonCancel = document.getElementById("logon-cancel");

	loginDiv.addEventListener("click", async (event) => {
		if (inputEnabled && event.target.nodeName === "BUTTON") {
			if (event.target === logonButton) {
				enableInput(false);

				try {
					const response = await fetch("/api/v1/auth/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email: email.value,
							password: password.value,
						}),
					});

					const data = await response.json();
					if (response.status === 200) {
						message.textContent = `Logon successful.  Welcome ${data.user.name}`;
						setToken(data.token);

						email.value = "";
						password.value = "";

						showJobs();
					} else {
						message.textContent = data.msg;
					}
				} catch (err) {
					// eslint-disable-next-line no-console
					console.error(err);
					message.textContent = "A communications error occurred.";
				}

				enableInput(true);
			} else if (event.target === logonCancel) {
				email.value = "";
				password.value = "";
				showLoginRegister();
			}
		}
	});
};

export const showLogin = () => {
	email.value = null;
	password.value = null;
	setDiv(loginDiv);
};
