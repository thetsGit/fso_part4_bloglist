const User = require("../models/user");

const initialUsers = [
  {
    username: "thethan123",
    name: "thetlinhan",
    passwordHash:
      "$2b$09$CGKMZ8ASoNkWYkdnOupWY.1PI33NJEd1iPtgG1BhJpjHdReA.3dby",
  },
  {
    username: "thirihan",
    name: "thetthirihan",
    passwordHash:
      "$2b$09$CsnBUuwjzt04pN5LZTaW4uyqmoFD.2xr.r/4mGSNX5KX1q4aKf.Iu",
    _id: "61b5eb0853a5cb9bfc379d8e",
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialUsers,
  usersInDb,
};
