// ./controllers/jobs.js
// Handles CRUD operations for job resources: create, read, update, delete, and list jobs for authenticated users.

const Job = require("../models/Job"); // Imports the Job model to interact with job documents in the database
// For reference https://www.npmjs.com/package/http-status-codes
const { StatusCodes } = require("http-status-codes"); // Imports standard HTTP status codes for consistent API responses
const { BadRequestError, NotFoundError } = require("../errors"); // Imports custom error classes for clear error handling

const getAllJobs = async (req, res) => {
	// Controller to retrieve all jobs created by the authenticated user
	const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt"); // Queries jobs by userId and sorts by creation date
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length }); // Returns jobs and their count with 200 OK
};

const getJob = async (req, res) => {
	// Controller to retrieve a single job by ID for the authenticated user
	const {
		user: { userId },
		params: { id: jobId },
	} = req; // Destructures userId from req.user and jobId from URL params

	const job = await Job.findOne({
		_id: jobId,
		createdBy: userId,
	}); // Finds a job matching both the ID and creator
	if (!job) throw new NotFoundError(`No job with id ${jobId}`); // Throws 404 if job does not exist
	res.status(StatusCodes.OK).json({ job }); // Returns the job with 200 OK
};

const createJob = async (req, res) => {
	// Controller to create a new job
	req.body.createdBy = req.user.userId; // Adds the authenticated user ID to the job document
	const job = await Job.create(req.body); // Creates the job in the database
	res.status(StatusCodes.CREATED).json({ job }); // Returns the newly created job with 201 Created
};

const updateJob = async (req, res) => {
	// Controller to update an existing job by ID
	const {
		body: { company, position },
		user: { userId },
		params: { id: jobId },
	} = req; // Destructures relevant fields from request body, user, and params

	if (company === "")
		throw new BadRequestError("Company field cannot be empty"); // Validates non-empty company

	if (position === "")
		throw new BadRequestError("Position field cannot be empty"); // Validates non-empty position

	const job = await Job.findByIdAndUpdate(
		{ _id: jobId, createdBy: userId },
		req.body,
		{ new: true, runValidators: true },
	); // Updates the job if it exists and was created by the user; returns the updated document
	if (!job) throw new NotFoundError(`No job with id ${jobId}`); // Throws 404 if job not found
	res.status(StatusCodes.OK).json({ job }); // Returns updated job with 200 OK
};

const deleteJob = async (req, res) => {
	// Controller to delete a job by ID
	const {
		user: { userId },
		params: { id: jobId },
	} = req; // Destructures userId and jobId from request

	const job = await Job.findByIdAndRemove({
		_id: jobId,
		createdBy: userId,
	}); // Deletes the job if it exists and belongs to the user
	if (!job) throw new NotFoundError(`No job with id ${jobId}`); // Throws 404 if job not found
	res.status(StatusCodes.OK).send(); // Sends 200 OK with no content to confirm deletion
};

module.exports = {
	createJob, // Exposes createJob controller
	deleteJob, // Exposes deleteJob controller
	getAllJobs, // Exposes getAllJobs controller
	updateJob, // Exposes updateJob controller
	getJob, // Exposes getJob controller
};
