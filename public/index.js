// ./public/index.js

// We need to keep track of the active div so that we know which one to disable when switching between them, and that is stored in the variable activeDiv.
// We don’t need to export that variable since it’s only used here in the index script by the setDiv function.
// We export a function that sets the active div, making it visible and hiding the previous active div.
let activeDiv = null;
export const setDiv = (newDiv) => {
	if (newDiv != activeDiv) {
		if (activeDiv) {
			activeDiv.style.display = "none";
		}
		newDiv.style.display = "block";
		activeDiv = newDiv;
	}
};

// We also have to have a means of enabling or disabling input.
// This is because we will use asynchronous functions, and the application can get confused if more input comes in while the previous requests are in progress.
export let inputEnabled = true;
export const enableInput = (state) => {
	inputEnabled = state;
};

// We also have to keep track of whether the user is logged in.
// We do that in a token variable that we store in the browser’s local storage (although this creates security risks as previously described.)
// When local storage is used, the user remains logged in even if the page is refreshed.
// If the function is called with a null token, then we remove the token from local storage instead.
export let token = null;
export const setToken = (value) => {
	token = value;
	if (value) {
		localStorage.setItem("token", value);
	} else {
		localStorage.removeItem("token");
	}
};

// When the user takes actions we may want to display a message on the page.
// We store the value of that message here in the index script in the message variable, so that it can easily be updated by any of the other modules.
export let message = null;

// Then, if the user is logged in, we display the list of jobs. If the user is not logged in, we display the initial panel with a button for logon and a button for register.
// Note that we need to provide and to export functions to set the enabled flag and the token.
// This is because one can’t write directly to variables from other modules.
// Once a variable is imported in a module, it is treated as a const variable in that module, so you cannot reassign values to that variable directly.
import { showJobs, handleJobs } from "./jobs.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister } from "./register.js";

// Once the DOM is loaded, we load the token (if it exists already) from the browser’s local storage and initialize the handlers for each of the divs.
document.addEventListener("DOMContentLoaded", () => {
	token = localStorage.getItem("token");
	message = document.getElementById("message");
	handleLoginRegister();
	handleLogin();
	handleJobs();
	handleRegister();
	handleAddEdit();
	if (token) {
		showJobs();
	} else {
		showLoginRegister();
	}
});
