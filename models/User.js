// ./models/User.js
// Mongoose schema and model for users, includes password hashing, JWT generation, and password comparison methods.

const mongoose = require("mongoose"); // Imports Mongoose to define the User schema and interact with MongoDB
const bcrypt = require("bcryptjs"); // Library for hashing and comparing passwords securely
const jwt = require("jsonwebtoken"); // Library for creating and verifying JSON Web Tokens

const UserSchema = new mongoose.Schema({
	// Defines the schema for user documents
	name: {
		type: String, // Field type is string
		required: [true, "Please provide name"], // Name is required
		maxlength: 50, // Maximum length of 50 characters
		minlength: 3, // Minimum length of 3 characters
	},
	email: {
		type: String, // Field type is string
		required: [true, "Please provide email"], // Email is required
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please provide a valid email", // Ensures the email follows a valid format
		],
		unique: true, // Prevents duplicate email entries
	},

	password: {
		type: String, // Field type is string
		required: [true, "Please provide password"], // Password is required
		minlength: 6, // Minimum password length is 6 characters
	},
});

// https://mongoosejs.com/docs/middleware.html#pre
UserSchema.pre("save", async function () {
	// Pre-save middleware to hash passwords before saving
	const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds for hashing
	this.password = await bcrypt.hash(this.password, salt); // Hashes the password and replaces plain text
});

// https://mongoosejs.com/docs/guide.html#methods
UserSchema.methods.createJWT = function () {
	// Instance method to generate a JWT for the user
	return jwt.sign(
		{ userId: this._id, name: this.name }, // Payload includes user ID and name
		process.env.JWT_SECRET, // Secret key from environment variables
		{
			expiresIn: process.env.JWT_LIFETIME, // Token expiration configured via environment variables
		},
	);
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
	// Instance method to compare a provided password with the hashed password
	const isMatch = await bcrypt.compare(canditatePassword, this.password); // Uses bcrypt to verify password
	return isMatch; // Returns true if passwords match, false otherwise
};

module.exports = mongoose.model("User", UserSchema); // Creates and exports the User model for database operations
