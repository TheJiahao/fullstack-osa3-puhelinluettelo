require("dotenv").config();

import { Application } from "express";
import initialize_routes from "./routes";
import errorHandler from "./middlewares/errorHandler";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app: Application = express();
const PORT = process.env.PORT;

morgan.token("content", (request, respond) => {
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

initialize_routes(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
