// ./routes/health.js

const express = require("express"); // Imports Express to create a router for authentication routes
const router = express.Router(); // Creates a new router instance to define auth-related endpoints
const { healthCheck } = require("../controllers/health"); // Imports the register and login controller functions

/* TODO: delete this block
// router.post("/register", register); // Defines POST /register route to create a new user account
// router.post("/login", login); // Defines POST /login route to authenticate an existing user
*/

// Health check endpoint (MongoDB)
router.get("/", healthCheck);

module.exports = router; // Exports the router to be mounted in the main application
