// ./routes/auth.js
// Defines Express routes for authentication endpoints and maps them to register and login controllers.

const express = require("express"); // Imports Express to create a router for authentication routes
const router = express.Router(); // Creates a new router instance to define auth-related endpoints
const { register, login } = require("../controllers/auth"); // Imports the register and login controller functions

router.post("/register", register); // Defines POST /register route to create a new user account
router.post("/login", login); // Defines POST /login route to authenticate an existing user

module.exports = router; // Exports the router to be mounted in the main application
