const User = require("../models/User");
const { StatusCodes } = require("http-status-codes"); // Original code commented out
const { BadRequestError, UnauthenticatedError } = require("../errors"); // Original code commented out

const register = async (req, res) => {
	const { name, email, password } = req.body;
	if (!name) throw new BadRequestError("Please provide name.");
	if (!email) throw new BadRequestError("Please provide email.");
	if (!password) throw new BadRequestError("Please provide password.");

	const user = await User.create({ ...req.body });
	const token = user.createJWT();
	res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email) throw new BadRequestError("Please provide email.");
	if (!password) throw new BadRequestError("Please provide password.");
	const user = await User.findOne({ email });
	if (!user) throw new UnauthenticatedError("The username is invalid.");
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect)
		throw new UnauthenticatedError("The password is invalid.");

	// compare password
	const token = user.createJWT();
	res.status(StatusCodes.OK).json({ user: { name: user.name }, token });

	/* *** Original code commented out ***
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
*/
};

module.exports = {
	register,
	login,
};
