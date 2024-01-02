import { Application } from "express";
import Person from "./interfaces/Person";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app: Application = express();
const PORT = 3001;

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

let persons: Person[] = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons).end();
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log("Requested id", id);

  const person = persons.find((person) => person.id === id);
  console.log("Requested person", person);

  if (!person) {
    response.status(404).end();
    return;
  }

  response.json(person).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log("Deleting id", id);

  persons = persons.filter((person) => person.id !== id);
  console.log("Persons", persons);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const person = { ...request.body };
  console.log("Person in request", person);

  if (!("number" in person && "name" in person)) {
    response.status(400);
    response.send({ error: "Name or number missing." }).end();

    return;
  }

  if (persons.map((person) => person.name).includes(person.name)) {
    response.status(409);
    response.send({ error: "Name already added." }).end();
  }

  person.id = Math.floor(Math.random() * 10000000);

  persons = persons.concat(person);
  console.log("Added person", person);

  response.end();
});

app.get("/info", (request, response) => {
  const currentTime = new Date();
  console.log(currentTime);

  response
    .send(
      [
        `<p>Phonebook has info for ${persons.length} people</p>`,
        `<p>${currentTime.toString()}</p>`,
      ].join("\n")
    )
    .end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
