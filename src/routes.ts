import { Application } from "express";
import { Model } from "mongoose";
import Person from "./interfaces/Person";

const mongoose = require("mongoose");
const person: Model<Person> = require("./models/person");

const initializeRoutes = (app: Application) => {
  initializeGetAllPersons(app);
  initializeDeletePerson(app);
  initializeInfoPage(app);
  initializeGetPersonById(app);
  initializeCreatePerson(app);
  initializeUpdatePerson(app);
};

const initializeGetAllPersons = (app: Application) => {
  app.get("/api/persons", (request, response, next) => {
    person
      .find({})
      .then((result) => {
        const persons = result;
        console.log("Persons from DB", persons);

        response.json(persons).end();
      })
      .catch((error) => next(error));
  });
};

const initializeDeletePerson = (app: Application) => {
  app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;

    person
      .findByIdAndDelete(id)
      .then(() => {
        console.log("Deleted", id);
        response.status(204).end();
      })
      .catch((error) => next(error));
  });
};

const initializeInfoPage = (app: Application) => {
  app.get("/info", (request, response, next) => {
    const currentTime = new Date();
    console.log(currentTime);

    person
      .find({})
      .then((result) => {
        console.log("Persons from database", result);

        response
          .send(
            [
              `<p>Phonebook has info for ${result.length} people</p>`,
              `<p>${currentTime.toString()}</p>`,
            ].join("\n")
          )
          .end();
      })
      .catch((error) => next(error));
  });
};

const initializeGetPersonById = (app: Application) => {
  app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;

    person
      .findById(id)
      .then((result) => {
        console.log("Returned person", result);

        if (!result) {
          response.status(404).end();
          return;
        }

        response.json(result).end();
      })
      .catch((error) => next(error));
  });
};

const initializeCreatePerson = (app: Application) => {
  app.post("/api/persons", (request, response, next) => {
    const body = request.body;
    console.log("Person in request", body);

    new person({ name: body.name, number: body.number })
      .save()
      .then((savedPerson) => {
        response.json(savedPerson).end();
      })
      .catch((error) => {
        console.log("Add person failed:");
        next(error);
      });
  });
};

const initializeUpdatePerson = (app: Application) => {
  app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const newPerson = { name: body.name, number: body.number };
    console.log("Person in request", body);

    const id = request.params.id;

    person
      .findByIdAndUpdate(id, newPerson, { new: true })
      .then((updatedPerson) => {
        console.log("Updated", updatedPerson);
        response.json(updatedPerson).end();
      })
      .catch((error) => next(error));
  });
};

export default initializeRoutes;
