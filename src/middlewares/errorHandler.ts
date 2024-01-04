import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError") {
    response.status(400).send("Malformatted id").end();
    return;
  } else {
    response.status(500).send("Unknown error").end();
  }

  next(error);
};

export default errorHandler;
