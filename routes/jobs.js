// ./routes/jobs.js
// Defines Express routes for job-related endpoints and maps them to corresponding controller functions.

const express = require("express"); // Imports the Express framework to create a modular router

const router = express.Router(); // Creates a new router instance to define job-related routes
const {
	createJob,
	deleteJob,
	getAllJobs,
	updateJob,
	getJob,
} = require("../controllers/jobs"); // Imports controller functions that implement job CRUD logic

router.route("/").post(createJob).get(getAllJobs); // Maps POST to create a job and GET to list all jobs at the root jobs path

router.route("/:id").get(getJob).delete(deleteJob).patch(updateJob); // Maps GET, DELETE, and PATCH to operate on a single job by ID

module.exports = router; // Exports the router so it can be mounted in the main application
