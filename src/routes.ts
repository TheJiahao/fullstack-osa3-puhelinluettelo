import { Application } from "express";
import { Model } from "mongoose";
import Person from "./interfaces/Person";

const mongoose = require("mongoose");
const person: Model<Person> = require("./models/person");

const initialize_routes = (app: Application) => {
  initialize_get_all_persons(app);
  initialize_delete_person(app);
  initialize_info_page(app);
};

const initialize_get_all_persons = (app: Application) => {
  app.get("/api/persons", (request, response) => {
    person.find({}).then((result) => {
      const persons = result;
      console.log("Persons from DB", persons);

      response.json(persons).end();
    });
  });
};

const initialize_delete_person = (app: Application) => {
  app.delete("/api/persons/:id", (request, response) => {
    console.log("id as string", request.params.id);
    const id = new mongoose.Types.ObjectId(request.params.id);

    console.log("id as ObjectId", id);

    person
      .deleteOne({ _id: id })
      .then(() => {
        mongoose.connection.close();
        console.log("Deleted");
      })
      .catch(() => console.log("Delete failed"));

    response.status(204).end();
  });
};

const initialize_info_page = (app: Application) => {
  app.get("/info", (request, response) => {
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

        mongoose.connection.close();
      })
      .catch((error) => console.log("Error retrieving persons from DB", error));
  });
};

export default initialize_routes;
