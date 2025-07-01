const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
const app = express(); // create an express server object and save it as apps
app.use(express.json());//Express to automatically parse incoming requests with JSON payloads
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const db = mysql2.createConnection({
  host: "35.244.19.98",
  user: "hubber",
  password: "VenaHub@18",
  database: "mhub",
});
db.connect();

app.post("/loginpage", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.json({ message: "Login successful", user });
  });
});

app.get("/plantid", (req, res) => {
  const id = req.query.id;

db.query("SELECT name FROM mas_sites WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send("error");
    } else if (results.length === 0) {
      res.status(404).send("Plant not found");
    } else {
      res.json(results[0]);
    }
  });
});


app.listen(4000);
