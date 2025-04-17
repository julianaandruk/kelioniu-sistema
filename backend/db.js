const Database = require('better-sqlite3'); // SQLite3 duomenų bazės biblioteka
const db = new Database('trips.db'); // Sukuriamas arba atidaromas 'trips.db' failas

// Vartotojų lentelė
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unikalus vartotojo ID
    email TEXT UNIQUE NOT NULL,            -- Unikalus vartotojo el. paštas
    password TEXT NOT NULL                 -- Užšifruotas slaptažodis
  )
`).run();

// Kelionių lentelė su koordinatėmis
db.prepare(`
  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unikalus kelionės ID
    name TEXT NOT NULL,                    -- Kelionės pavadinimas arba vieta
    date TEXT NOT NULL,                    -- Kelionės pradžios data
    endDate TEXT NOT NULL,                 -- Kelionės pabaigos data
    notes TEXT,                            -- Papildomos pastabos
    latitude REAL,                         -- Vietovės platuma (jei taikoma)
    longitude REAL,                        -- Vietovės ilguma (jei taikoma)
    userId INTEGER NOT NULL,               -- Vartotojo ID, kuris sukūrė kelionę
    FOREIGN KEY(userId) REFERENCES users(id)  -- Nuoroda į users lentelę
  )
`).run();

module.exports = db;
