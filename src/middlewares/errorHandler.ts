import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError") {
    response.status(400).send({ error: "Malformatted id" }).end();
    return;
  } else if (error.name === "ValidationError") {
    response.status(400).send(error.message);
  } else {
    response.status(500).send({ error: "Unknown error" }).end();
  }

  next(error);
};

export default errorHandler;
