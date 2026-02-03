// ./public/jobs.js

// Each of the div handling modules follow this pattern.
// Required imports (used when one div handler calls another) are resolved up front.
// Then, within the handler function, the div and its controls are defined. Also, within the handler function, an event handler is declared to handle mouse clicks within the div.

import {
	inputEnabled,
	setDiv,
	message,
	setToken,
	token,
	enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit, deleteJob } from "./addEdit.js";

let jobsDiv = null;
let jobsTable = null;
let jobsTableHeader = null;

export const handleJobs = () => {
	jobsDiv = document.getElementById("jobs");
	const logoff = document.getElementById("logoff");
	const addJob = document.getElementById("add-job");
	jobsTable = document.getElementById("jobs-table");
	jobsTableHeader = document.getElementById("jobs-table-header");

	jobsDiv.addEventListener("click", (event) => {
		if (inputEnabled && event.target.nodeName === "BUTTON") {
			if (event.target === addJob) {
				showAddEdit(null);
			} else if (event.target.classList.contains("editButton")) {
				message.textContent = "";
				showAddEdit(event.target.dataset.id);
			} else if (event.target.classList.contains("deleteButton")) {
				// console.log("Attempting to delete from jobs.js file.");
				deleteJob(event.target.dataset.id);
			} else if (event.target === logoff) {
				setToken(null);

				message.textContent = "You have been logged off.";

				jobsTable.replaceChildren([jobsTableHeader]);

				showLoginRegister();
			}
		}
	});
};

export const showJobs = async () => {
	try {
		enableInput(false);

		const response = await fetch("/api/v1/jobs", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		const data = await response.json();
		let children = [jobsTableHeader];

		if (response.status === 200) {
			if (data.count === 0) {
				jobsTable.replaceChildren(...children); // clear this for safety
			} else {
				for (let i = 0; i < data.jobs.length; i++) {
					let rowEntry = document.createElement("tr");

					let editButton = `<td><button type="button" class="editButton" data-id=${data.jobs[i]._id}>edit</button></td>`;
					let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.jobs[i]._id}>delete</button></td>`;
					let rowHTML = `
            <td>${data.jobs[i].company}</td>
            <td>${data.jobs[i].position}</td>
            <td>${data.jobs[i].status}</td>
            <div>${editButton}${deleteButton}</div>`;

					rowEntry.innerHTML = rowHTML;
					children.push(rowEntry);
				}
				jobsTable.replaceChildren(...children);
			}
		} else {
			message.textContent = data.msg;
		}
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log(err);
		message.textContent = "A communication error occurred.";
	}
	enableInput(true);
	setDiv(jobsDiv);
};
