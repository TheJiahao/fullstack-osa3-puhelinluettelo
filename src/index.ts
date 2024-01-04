import dotenv = require("dotenv");
dotenv.config();

import { Application } from "express";
import initializeRoutes from "./routes";
import errorHandler from "./middlewares/errorHandler";

import express = require("express");
import cors = require("cors");
import morgan = require("morgan");

const app: Application = express();
const PORT = process.env.PORT;

morgan.token("content", (request) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
});

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);
app.use(cors());
app.use(express.static("dist"));

initializeRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
