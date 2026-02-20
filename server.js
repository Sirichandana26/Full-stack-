const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

// ✅ CREATE APP FIRST
const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ================= LOGIN (USER + AUTHORITY) =================
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

// ================= USER SUBMIT COMPLAINT =================
app.post("/complaint", (req, res) => {
  const { user_id, category, description, location } = req.body;

  const sql =
    "INSERT INTO complaints (user_id, category, description, location, status, created_at) VALUES (?, ?, ?, ?, 'Pending', CURDATE())";

  db.query(sql, [user_id, category, description, location], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error submitting complaint");
    } else {
      res.send("Complaint submitted successfully");
    }
  });
});

// ================= AUTHORITY VIEW COMPLAINTS =================
app.get("/complaints", (req, res) => {
  const sql = "SELECT * FROM complaints WHERE status != 'Resolved'";

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("Error fetching complaints");
    } else {
      res.json(results);
    }
  });
});

// ================= AUTHORITY RESOLVE COMPLAINT =================
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

// ================= START SERVER =================
app.listen(3000, () => {
  console.log("MySQL Connected Successfully");
  console.log("Server started on port 3000");
});
