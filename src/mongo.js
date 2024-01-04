const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.4ycmx2w.mongodb.net/personApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length <= 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");

    for (const person of result) {
      console.log(`${person.name} ${person.number}`);
    }

    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({ name, number });

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);

    mongoose.connection.close();
  });
}
