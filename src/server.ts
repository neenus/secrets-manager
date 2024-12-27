import express, { Application } from 'express';
import helmet from "helmet";
import cors from "cors";
import { jsonToEnv } from "json-to-env-converter";
import connectDB from "@config/db";
import errorHandler from "@middleware/errorHandler";

import config from "@config/config.json";

// load environment variables
jsonToEnv(config);

// load routes
import usersRoutes from "@routes/users.routes";
import secretsRoutes from "@routes/secrets.routes";

const app: Application = express();
const PORT = parseInt(process.env.PORT as string, 10) || 8888;

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/secrets", secretsRoutes);

// error handler
app.use(errorHandler);

// start server
const server = app.listen(PORT, () => {
  // connect to database
  connectDB();


  const baseUrl = process.env.NODE_ENV === 'production' ?
    process.env.BASE_URL_PROD :
    `${process.env.BASE_URL_DEV}:${PORT}`;

  console.log(`Server is running in ${process.env.NODE_ENV} mode at ${baseUrl}`);
});

// handle unhandled promise rejections
process.on('unhandledRejection', (error: Error, promise) => {
  console.log(`Error: ${error.message}`);

  // close server & exit process
  server.close(() => process.exit(1));
});