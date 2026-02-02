// ./public/addEdit.js

// TODO: change `e`, as in "e.target", to event (or something similar).

// TODO: Update the database password.

// TODO: Put the following comment in the files that contain the "div handling modules follow this pattern."

// Each of the div handling modules follow this pattern.
// Required imports (used when one div handler calls another) are resolved up front.
// Then, within the handler function, the div and its controls are defined. Also, within the handler function, an event handler is declared to handle mouse clicks within the div.

// TODO: Address the "Parsing error: 'import' and 'export' may appear only with 'sourceType: module'" warnings in these files.
import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";

let addEditDiv = null;
let company = null;
let position = null;
let status = null;
let addingJob = null;

export const handleAddEdit = () => {
	addEditDiv = document.getElementById("edit-job");
	company = document.getElementById("company");
	position = document.getElementById("position");
	status = document.getElementById("status");
	addingJob = document.getElementById("adding-job");
	const editCancel = document.getElementById("edit-cancel");

	addEditDiv.addEventListener("click", async (e) => {
		if (inputEnabled && e.target.nodeName === "BUTTON") {
			if (e.target === addingJob) {
				enableInput(false);

				let method = "POST";
				let url = "/api/v1/jobs";

				if (addingJob.textContent === "update") {
					method = "PATCH";
					url = `/api/v1/jobs/${addEditDiv.dataset.id}`;
				}

				try {
					const response = await fetch(url, {
						method: method,
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							company: company.value,
							position: position.value,
							status: status.value,
						}),
					});

					const data = await response.json();
					if (response.status === 200 || response.status === 201) {
						if (response.status === 200) {
							// a 200 is expected for a successful update
							message.textContent = "The job entry was updated.";
						} else {
							// a 201 is expected for a successful create
							message.textContent = "The job entry was created.";
						}

						company.value = "";
						position.value = "";
						status.value = "pending";
						showJobs();
					} else {
						message.textContent = data.msg;
					}
				} catch (err) {
					console.log(err);
					message.textContent = "A communication error occurred.";
				}
				enableInput(true);
			}
		}
	});
};

export const showAddEdit = async (jobId) => {
	if (!jobId) {
		company.value = "";
		position.value = "";
		status.value = "pending";
		addingJob.textContent = "add";
		message.textContent = "";

		setDiv(addEditDiv);
	} else {
		enableInput(false);

		try {
			const response = await fetch(`/api/v1/jobs/${jobId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();
			if (response.status === 200) {
				company.value = data.job.company;
				position.value = data.job.position;
				status.value = data.job.status;
				addingJob.textContent = "update";
				message.textContent = "";
				addEditDiv.dataset.id = jobId;

				setDiv(addEditDiv);
			} else {
				// might happen if the list has been updated since last display
				message.textContent = "The jobs entry was not found";
				showJobs();
			}
		} catch (err) {
			console.log(err);
			message.textContent = "A communications error has occurred.";
			showJobs();
		}

		enableInput(true);
	}
};
