import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError") {
    response.status(400).send("Malformatted id").end();
    return;
  }

  next(error);
};

export default errorHandler;
