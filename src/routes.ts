import { Application } from "express";
import { Model } from "mongoose";
import Person from "./interfaces/Person";

const person: Model<Person> = require("./models/person");

const initialize_routes = (app: Application) => {
  initialize_get_all_persons(app);
};

const initialize_get_all_persons = (app: Application) => {
  app.get("/api/persons", (request, response) => {
    person.find({}).then((result) => {
      const persons = result;

      response.json(persons).end();
    });
  });
};

export default initialize_routes;
