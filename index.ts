import { Application } from "express";

const express = require("express");
const app: Application = express();

let persons = [
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
  response.json(persons);
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

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log("Deleting id", id);

  persons = persons.filter((person) => person.id !== id);
  console.log("Persons", persons);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const currentTime = new Date();
  console.log(currentTime);

  response.send(
    [
      `<p>Phonebook has info for ${persons.length} people</p>`,
      `<p>${currentTime.toString()}</p>`,
    ].join("\n")
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
