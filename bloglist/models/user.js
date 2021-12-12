const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userScheme = mongoose.Schema({
  username: { type: String, unique: true, required: true, minLength: 3 },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true, minLength: 3 },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userScheme.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id;
    delete returnedObj._id;
    delete returnedObj.__v;
    delete returnedObj.passwordHash;
  },
});

userScheme.plugin(uniqueValidator);

module.exports = new mongoose.model("User", userScheme);
