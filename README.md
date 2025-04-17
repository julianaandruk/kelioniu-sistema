# 🌍 Kelionių planavimo sistema

Sistema leidžia vartotojams registruotis, prisijungti ir valdyti savo keliones – planuoti datas, vietoves, biudžetus, matyti kelionių žemėlapį bei orų prognozes. 

---

## 🛠️ Naudotos technologijos

### Frontend:
- **React.js** – SPA kūrimui
- **React Router** – puslapių navigacija
- **Bootstrap 5** – stilius ir dizainas
- **Framer Motion** – animacijos
- **Leaflet.js** – interaktyvus žemėlapis
- **FullCalendar** – kelionių kalendorius
- **Context API** – autentifikacijos valdymui

### Backend:
- **Node.js** – serverio logika
- **Express.js** – API maršrutai
- **SQLite (better-sqlite3)** – duomenų bazė
- **JWT** – autentifikacija
- **bcrypt** – slaptažodžių šifravimas

---

## 🔑 Funkcionalumas

- ✅ Vartotojo registracija ir prisijungimas
- ✅ Autentifikacija su **JWT**
- ✅ CRUD operacijos su kelionėmis (pridėti, peržiūrėti, redaguoti, ištrinti)
- ✅ Vietovių autocomplete (OpenStreetMap)
- ✅ Interaktyvus žemėlapis su kelionių vietomis
- ✅ Kalendorius su kelionių datos rodymu
- ✅ Orų prognozė kiekvienai kelionei (OpenWeather API)
- ✅ Aplankytų šalių skaičius ir paskutinės kelionės rodymas
- ✅ Reaktyvi naudotojo sąsaja su Bootstrap

---

## 🚀 Projekto paleidimas lokaliai

### 1. Backend:
```bash
cd backend
npm install
node server.js

### 2. Frontend:
cd frontend
npm install
npm run dev
