const db = require("../config/db");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send("User Registered");
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT id, name, email FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length > 0) {
      res.json({
        token: result[0].id,
        userId: result[0].id,
        name: result[0].name,
        email: result[0].email
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
};