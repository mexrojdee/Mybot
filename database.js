const Database = require("better-sqlite3");

const db = new Database("kino.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS movies (
  code TEXT PRIMARY KEY,
  file_id TEXT NOT NULL
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY,
  full_name TEXT,
  username TEXT
)
`).run();

module.exports = db;
