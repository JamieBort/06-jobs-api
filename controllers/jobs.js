// ./controllers/jobs.js
// Handles CRUD operations for job resources: create, read, update, delete, and list jobs for authenticated users.

const Job = require("../models/Job"); // Imports the Job model to interact with job documents in the database
// For reference https://www.npmjs.com/package/http-status-codes
const { StatusCodes } = require("http-status-codes"); // Imports standard HTTP status codes for consistent API responses
const { BadRequestError, NotFoundError } = require("../errors"); // Imports custom error classes for clear error handling

// Controller to retrieve all jobs created by the authenticated user
const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt"); // Queries jobs by userId and sorts by creation date
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length }); // Returns jobs and their count with 200 OK

	/*
	NOTE: This might not be needed

  	const { search, status, jobType, sort } = req.query;

	const queryObject = {
		createdBy: req.user.userId,
	};

	if (search) {
		queryObject.position = { $regex: search, $options: "i" };
	}
	if (status && status !== "all") {
		queryObject.status = status;
	}
	if (jobType && jobType !== "all") {
		queryObject.jobType = jobType;
	}
	let result = Job.find(queryObject);

	if (sort === "latest") {
		result = result.sort("-createdAt");
	}
	if (sort === "oldest") {
		result = result.sort("createdAt");
	}
	if (sort === "a-z") {
		result = result.sort("position");
	}
	if (sort === "z-a") {
		result = result.sort("-position");
	}

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	result = result.skip(skip).limit(limit);

	const jobs = await result;

	const totalJobs = await Job.countDocuments(queryObject);
	const numOfPages = Math.ceil(totalJobs / limit);

	res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
	*/
};

// Controller to retrieve a single job by ID for the authenticated user
const getJob = async (req, res) => {
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

// Controller to create a new job
const createJob = async (req, res) => {
	req.body.createdBy = req.user.userId; // Adds the authenticated user ID to the job document
	const job = await Job.create(req.body); // Creates the job in the database
	res.status(StatusCodes.CREATED).json({ job }); // Returns the newly created job with 201 Created
};

// Controller to update an existing job by ID
const updateJob = async (req, res) => {
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

// Controller to delete a job by ID
const deleteJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req; // Destructures userId and jobId from request

	const job = await Job.findByIdAndRemove({
		_id: jobId,
		createdBy: userId,
	}); // Deletes the job if it exists and belongs to the user

	if (!job) throw new NotFoundError(`No job with id ${jobId}`); // Throws 404 if job not found
	res.status(StatusCodes.OK).send("Deleted that job."); // Sends 200 OK ~~with no content to confirm deletion~~
};

module.exports = {
	createJob, // Exposes createJob controller
	deleteJob, // Exposes deleteJob controller
	getAllJobs, // Exposes getAllJobs controller
	updateJob, // Exposes updateJob controller
	getJob, // Exposes getJob controller
};
