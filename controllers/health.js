// ./controllers/health.js

const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes"); // Imports standardized HTTP status codes for consistent responses

// Health check endpoint (MongoDB)
const healthCheck = async (req, res) => {
	try {
		// Ping the MongoDB server
		await mongoose.connection.db.admin().ping();
		res.json({ status: "ok", db: "Connected to the database." });
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: "error",
			db: "Database is not connected.",
			error: err.message,
		});
	}
};

module.exports = {
	healthCheck, // Exposes the register controller for use in routing
};
