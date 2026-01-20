// Purpose: Protects routes by verifying JWTs in the Authorization header.
// Adds authenticated user information to req.user or throws an UnauthenticatedError
// if no valid token is provided.

// const User = require("../models/User"); // Original code commented out
const jwt = require("jsonwebtoken"); // Library for creating and verifying JWTs
const { UnauthenticatedError } = require("../errors"); // Custom error for 401 Unauthorized

// Middleware function to authenticate requests
const auth = async (req, res, next) => {
	// Check header
	const authHeader = req.headers.authorization; // Get the Authorization header
	if (!authHeader) throw new UnauthenticatedError("Authentication invalide");
	if (!authHeader.startsWith("Bearer "))
		throw new UnauthenticatedError("No token provided");

	const token = authHeader.split(" ")[1]; // Extract the token from the header
	// eslint-disable-next-line no-console
	console.log(token);

	// Verify token is valid.
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const { id, username } = payload; // Extract payload
		req.user = { id, username }; // Attach user info to request
		next(); // Proceed to next middleware/route handler
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error); // Log error for debugging
		throw new UnauthenticatedError("Not authorized to access this route"); // Throw error if the token is invalid
	}
};

// Export the middleware to use in protected routes
module.exports = auth;
