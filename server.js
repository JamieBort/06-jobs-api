// ./server.js

// Main application entry point for the application.
// Responsible for setting up and starting the server and connecting to MongoDB.

require("dotenv").config(); // Loads environment variables from .env file into process.env for configuration and secrets

const app = require("./app"); // Import the configured Express app
const connectDB = require("./db/connect"); // Imports the database connection helper to initialize MongoDB
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
