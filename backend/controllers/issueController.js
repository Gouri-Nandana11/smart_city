const db = require("../config/db");

exports.getIssues = (req, res) => {
  db.query("SELECT * FROM issues", (err, result) => {
    if (err) return res.status(500).send(err);

    res.json(result);
  });
};

exports.addIssue = (req, res) => {
  const { title, description, location } = req.body;

  const sql = "INSERT INTO issues (title,description,location) VALUES (?,?,?)";

  db.query(sql, [title, description, location], (err, result) => {
    if (err) return res.status(500).send(err);

    res.send("Issue reported");
  });
};