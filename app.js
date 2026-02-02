// ./app.js
// Main application entry point: sets up Express server, middleware, routes, and connects to the database.
// Correct order: all imports first, app creation second, middleware third, routes fourth, errors last.

require("dotenv").config(); // Loads environment variables from a .env file into process.env for configuration and secrets
// For reference https://www.npmjs.com/package/express-async-errors
require("express-async-errors"); // Extends Express to automatically forward async errors to the error handler

const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

// third-party middleware
const express = require("express"); // Imports the Express framework to create the web server
// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// Swagger
// const swaggerUI = require("swagger-ui-express"); // Original code commented out
// const YAML = require("yamljs"); // Original code commented out
// const swaggerDocument = YAML.load("./swagger.yaml"); // Original code commented out
const connectDB = require("./db/connect"); // Imports the database connection helper to initialize MongoDB
const authenticateUser = require("./middleware/authentication"); // Imports middleware to enforce authentication on protected routes

// routers
const authRouter = require("./routes/auth"); // Imports route handlers for authentication-related endpoints
const jobsRouter = require("./routes/jobs"); // Imports route handlers for job-related endpoints

// error handler middleware
const notFoundMiddleware = require("./middleware/not-found"); // Imports middleware to handle unmatched routes (404 errors)
const errorHandlerMiddleware = require("./middleware/error-handler"); // Imports centralized error handling logic

const app = express(); // Instantiates the Express application used to configure middleware and routes

app.set("trust proxy", 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
	}),
);
app.use(express.json()); // Enables parsing of incoming JSON payloads so req.body contains parsed data
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.static("public"));

// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument)); // Original code commented out

// TODO: Once `app.get("/health", async (req, res) => {}` is working, remove this line of code.
// A dummy GET route to verify everything is working once the app has been deployed.
app.get("/test", (req, res) => res.send("You've reached the Jobs API."));

// TODO: Clean this up. Specifically, modify the json object in the catch.
// Health check endpoint (MongoDB)
app.get("/health", async (req, res) => {
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
});

// routes
app.use("/api/v1/auth", authRouter); // Registers authentication routes under a versioned API path
app.use("/api/v1/jobs", authenticateUser, jobsRouter); // Secures job routes with authentication before handling requests

app.use(notFoundMiddleware); // Catches requests that did not match any defined route
app.use(errorHandlerMiddleware); // Handles and formats all errors passed through the middleware chain

const port = process.env.PORT || 3000; // Selects the server port from environment variables or defaults to 3000

const start = async () => {
	// Defines an async startup function to initialize dependencies before listening
	try {
		await connectDB(process.env.MONGO_URI); // Establishes a database connection using the configured MongoDB URI
		app.listen(
			port,
			() =>
				// eslint-disable-next-line no-console
				console.log(`Server is listening on port ${port}.`), // Starts the HTTP server and logs successful startup
		);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error); // Logs startup or connection errors to aid debugging
	}
};

start(); // Executes the startup routine to launch the application
