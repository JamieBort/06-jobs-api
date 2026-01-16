require("dotenv").config();
require("express-async-errors");

// extra security packages
// const helmet = require("helmet"); // Original code commented out
// const cors = require("cors"); // Original code commented out
// const xss = require("xss-clean"); // Original code commented out
// const rateLimiter = require("express-rate-limit"); // Original code commented out

// Swagger
// const swaggerUI = require("swagger-ui-express"); // Original code commented out
// const YAML = require("yamljs"); // Original code commented out
// const swaggerDocument = YAML.load("./swagger.yaml"); // Original code commented out

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// app.set("trust proxy", 1); // Original code commented out
// app.use( // Original code commented out
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );
app.use(express.json());
// extra packages
// app.use(helmet()); // Original code commented out
// app.use(cors()); // Original code commented out
// app.use(xss()); // Original code commented out

// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument)); // Original code commented out

// routes
app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/jobs", authenticateUser, jobsRouter); // Original code commented out
app.use("/api/v1/jobs", jobsRouter); // NEW code

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI); // Original code commented out
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
