import { Application } from "express";
import { Model } from "mongoose";
import Person from "./interfaces/Person";

const mongoose = require("mongoose");
const person: Model<Person> = require("./models/person");

const initialize_routes = (app: Application) => {
  initialize_get_all_persons(app);
  initialize_delete_person(app);
  initialize_info_page(app);
  initialize_get_person_by_id(app);
  initialize_create_person(app);
};

const initialize_get_all_persons = (app: Application) => {
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

const initialize_delete_person = (app: Application) => {
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
      })
      .catch((error) => console.log("Error retrieving persons from DB", error));
  });
};

const initialize_get_person_by_id = (app: Application) => {
  app.get("/api/persons/:id", (request, response) => {
    let id = request.params.id;
    console.log("id as string", id);

    try {
      id = new mongoose.Types.ObjectId(request.params.id);

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
        .catch(() => console.log("Delete failed"));
    } catch (error) {
      console.log(`Invalid id ${id}:`, error);

      response.status(404).end();
    }
  });
};

const initialize_create_person = (app: Application) => {
  app.post("/api/persons", (request, response) => {
    const body = request.body;
    console.log("Person in request", body);

    if (!("number" in body && "name" in body)) {
      response.status(400);
      response.send({ error: "Name or number missing." }).end();

      return;
    }

    new person({ name: body.name, number: body.number })
      .save()
      .then((savedPerson) => {
        response.json(savedPerson).end();
      })
      .catch((error) => {
        console.log("Add person failed:", error);

        response.status(500).end();
      });
  });
};

export default initialize_routes;
