import { Model, Schema } from "mongoose";
import Person from "../interfaces/Person";

import mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);
mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error.message));

const personSchema: Schema<Person> = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: (value) => /^\d{2,3}-\d+$/.test(value),
      message: ({ value }) => `${value} is not valid phone number.`,
    },
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    console.log("Transforming person", returnedObject);

    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person: Model<Person> = mongoose.model("Person", personSchema);

export = Person;
