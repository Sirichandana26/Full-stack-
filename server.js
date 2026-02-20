const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ WEBSITE CONFIGURATION (IMPORTANT)
app.use(express.static(path.join(__dirname, "public")));

// ✅ ROOT ROUTE (LOAD WEBSITE)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});


// 🔐 LOGIN API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT user_id, name, role FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err || result.length === 0) {
      res.status(401).send("Invalid credentials");
    } else {
      res.json(result[0]);
    }
  });
});


// 📝 INSERT COMPLAINT
app.post("/complaint", (req, res) => {
  const { user_id, category, description, location } = req.body;

  const sql =
    "INSERT INTO complaints (user_id, category, description, location, status, created_at) VALUES (?, ?, ?, ?, 'Pending', CURDATE())";

  db.query(sql, [user_id, category, description, location], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error inserting complaint");
    } else {
      res.send("Complaint submitted successfully");
    }
  });
});


// 📥 GET COMPLAINTS
app.get("/complaints", (req, res) => {
  const sql = "SELECT * FROM complaints";

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("Error fetching complaints");
    } else {
      res.json(results);
    }
  });
});


// 🔄 UPDATE STATUS (AUTHORITY)
app.put("/complaint/:id", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  const sql = "UPDATE complaints SET status=? WHERE complaint_id=?";

  db.query(sql, [status, id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating status");
    } else {
      res.send("Status updated successfully");
    }
  });
});


app.listen(3000, () => {
  console.log("Server started on port 3000");
});