// ./middleware/authentication.js
// Middleware to protect routes by verifying JWTs and attaching authenticated user info to requests.

// Purpose: Protects routes by verifying JWTs in the Authorization header.
// Adds authenticated user information to req.user or throws an UnauthenticatedError
// if no valid token is provided.

// const User = require("../models/User"); // Original code commented out
const jwt = require("jsonwebtoken"); // Imports JWT library to create and verify tokens
const { UnauthenticatedError } = require("../errors"); // Imports custom error for unauthorized access

// Middleware function to authenticate requests
const auth = async (req, res, next) => {
	// Check header
	const authHeader = req.headers.authorization; // Retrieves the Authorization header from the request
	if (!authHeader) throw new UnauthenticatedError("Authentication invalid"); // Rejects request if header is missing
	if (!authHeader.startsWith("Bearer "))
		throw new UnauthenticatedError("No token provided"); // Rejects request if header format is incorrect

	const token = authHeader.split(" ")[1]; // Extracts the JWT from the header after "Bearer"
	// eslint-disable-next-line no-console
	// console.log(token); // Logs token for debugging purposes

	// Verify token is valid.
	try {
		// NOTE: See .env.ctd-group-session
		// For reference https://www.npmjs.com/package/jsonwebtoken
		const payload = jwt.verify(token, process.env.JWT_SECRET); // Verifies token using the secret key and decodes payload
		req.user = { userId: payload.userId, name: payload.name }; // Extracts authenticated user information from the token payload and attaches it to request for downstream middleware/routes.
		next(); // Calls next middleware or route handler if authentication succeeds
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error); // Logs verification errors for debugging
		throw new UnauthenticatedError("Not authorized to access this route"); // Throws 401 error if token is invalid or expired
	}
};

// Export the middleware to use in protected routes
module.exports = auth; // Makes the authentication middleware available to other modules
