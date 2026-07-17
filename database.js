const fs = require("fs");

const file = "kinolar.json";

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, JSON.stringify({
    movies: {},
    users: {}
  }, null, 2));
}

function loadDB() {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  getMovies() {
    return loadDB().movies;
  },

  addMovie(code, file_id) {
    const data = loadDB();
    data.movies[code] = file_id;
    saveDB(data);
  },

  getMovie(code) {
    return loadDB().movies[code];
  },

  addUser(user_id, full_name, username) {
    const data = loadDB();
    data.users[user_id] = {
      full_name,
      username
    };
    saveDB(data);
  },

  getUsers() {
    return loadDB().users;
  }
};
