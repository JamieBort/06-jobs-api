// ./controllers/auth.js
// Handles authentication logic: user registration and login, returns JWTs for authenticated sessions.

const User = require("../models/User"); // Imports the User model to interact with user data in the database
// For reference https://www.npmjs.com/package/http-status-codes
// NOTE: Already instaleld when `npm  install` is run.
//       Because "http-status-codes" is alredy in the "dependencies" object of the package.json file.
const { StatusCodes } = require("http-status-codes"); // Imports standardized HTTP status codes for consistent responses
const { BadRequestError, UnauthenticatedError } = require("../errors"); // Imports custom error classes for clearer error handling

const register = async (req, res) => {
	// Defines an async controller to handle user registration
	const { name, email, password } = req.body; // Extracts required registration fields from the request body
	if (!name) throw new BadRequestError("Please provide name."); // Validates presence of name to prevent invalid user creation
	if (!email) throw new BadRequestError("Please provide email."); // Validates presence of email to ensure account identification
	if (!password) throw new BadRequestError("Please provide password."); // Validates presence of password for authentication

	const user = await User.create({ ...req.body }); // Creates a new user document in the database using provided data
	const token = user.createJWT(); // Generates a JWT for the newly created user to enable authenticated access
	res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token }); // Returns success response with user info and token
};

const login = async (req, res) => {
	// Defines an async controller to handle user login
	const { email, password } = req.body; // Extracts login credentials from the request body

	if (!email) throw new BadRequestError("Please provide email."); // Ensures an email is provided before querying the database
	if (!password) throw new BadRequestError("Please provide password."); // Ensures a password is provided before validation
	// NOTE: this method is build in with Mongoose: https://mongoosejs.com/docs/guide.html#methods -> "findOne()" in https://mongoosejs.com/docs/api/document.html
	const user = await User.findOne({ email }); // Looks up a user by email in the database
	if (!user) throw new UnauthenticatedError("The username is invalid."); // Rejects login if no matching user is found
	// NOTE: this method comes from the ./models/User.js file.
	const isPasswordCorrect = await user.comparePassword(password); // Compares provided password with the stored hashed password
	if (!isPasswordCorrect)
		throw new UnauthenticatedError("The password is invalid."); // Rejects login if the password does not match

	// compare password
	// NOTE: this method comes from the ./models/User.js file.
	const token = user.createJWT(); // Generates a JWT for the authenticated user
	res.status(StatusCodes.OK).json({ user: { name: user.name }, token }); // Sends success response with user info and token
};

module.exports = {
	register, // Exposes the register controller for use in routing
	login, // Exposes the login controller for use in routing
};
