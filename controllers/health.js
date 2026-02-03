// ./controllers/health.js

const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes"); // Imports standardized HTTP status codes for consistent responses

// TODO: Clean this up. Specifically, modify the json object in the catch.
// Health check endpoint (MongoDB)
const healthCheck = async (req, res) => {
	try {
		// Ping the MongoDB server
		await mongoose.connection.db.admin().ping();

		res.json({ status: "ok", db: "connected" });
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: "error",
			db: "not connected",
			error: err.message,
		});
	}
};

module.exports = {
	healthCheck, // Exposes the register controller for use in routing
};
