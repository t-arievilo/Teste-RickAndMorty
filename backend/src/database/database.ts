import * as BetterSqlite3 from "better-sqlite3";
import { Database as DatabaseType } from "better-sqlite3";
import * as path from "path";

const Database = (BetterSqlite3 as any).default ?? BetterSqlite3;

const db: DatabaseType = new Database(
  path.join(__dirname, "../../database.sqlite"),
);

db.pragma("foreign_keys = ON");

//cria a tabela de usuários e personagens, caso não existam.
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
 
  CREATE TABLE IF NOT EXISTS personagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_character_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    species TEXT, gender TEXT, origin TEXT,
    location TEXT, image TEXT, status TEXT,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export default db;
