import { Model, Schema } from "mongoose";
import Person from "../interfaces/Person";

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);
mongoose
  .connect(url)
  .then((result) => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error.message));

const personSchema: Schema<Person> = new mongoose.Schema({
  name: String,
  number: Number,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person: Model<Person> = mongoose.model("Person", personSchema);

module.exports = Person;
