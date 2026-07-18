const fs = require("fs");

const FILE = "users.json";

if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, "{}");
}

function getUsers() {
  return JSON.parse(fs.readFileSync(FILE));
}

function addUser(id, fullName, username) {
  const users = getUsers();

  users[id] = {
    fullName,
    username
  };

  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

module.exports = {
  getUsers,
  addUser
};
