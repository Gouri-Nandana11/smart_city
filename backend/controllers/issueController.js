const db = require("../config/db");

exports.getIssues = (req, res) => {
  db.query("SELECT * FROM issues", (err, result) => {
    if (err) return res.status(500).send(err);

    res.json(result);
  });
};

exports.getUserIssues = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  const userId = parseInt(token);

  console.log('getUserIssues called with userId:', userId, 'from token:', token);

  if (!userId || isNaN(userId)) {
    console.log('Invalid userId provided');
    return res.status(401).json({ error: "Unauthorized" });
  }

  db.query("SELECT * FROM issues WHERE userId = ?", [userId], (err, result) => {
    if (err) {
      console.log('Database error in getUserIssues:', err);
      return res.status(500).send(err);
    }

    console.log('Found issues for user:', result.length);
    res.json(result);
  });
};

exports.addIssue = (req, res) => {
  const { title, description, location, category, priority } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  const userId = parseInt(token);

  if (!userId || isNaN(userId)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sql = "INSERT INTO issues (title, description, location, category, priority, userId, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')";

  db.query(sql, [title, description, location, category || "Other", priority || "medium", userId], (err, result) => {
    if (err) return res.status(500).send(err);

    res.json({ id: result.insertId, message: "Issue reported successfully" });
  });
};

exports.updateIssue = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log('Updating issue:', id, 'to status:', status);

  const issueId = parseInt(id, 10);
  if (isNaN(issueId)) {
    return res.status(400).json({ message: "Invalid issue ID" });
  }

  const sql = "UPDATE issues SET status = ? WHERE id = ?";

  db.query(sql, [status, issueId], (err, result) => {
    if (err) {
      console.log('Database error:', err);
      return res.status(500).send(err);
    }

    console.log('Update result:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ message: "Issue updated successfully" });
  });
};

exports.upvoteIssue = (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  const userId = parseInt(token);

  if (!userId || isNaN(userId)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const issueId = parseInt(id, 10);
  if (isNaN(issueId)) {
    return res.status(400).json({ message: "Invalid issue ID" });
  }

  // Check if user already voted
  const checkVoteSql = "SELECT id FROM votes WHERE issueId = ? AND userId = ?";
  db.query(checkVoteSql, [issueId, userId], (err, result) => {
    if (err) {
      console.log('Database error checking vote:', err);
      return res.status(500).send(err);
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "Already voted on this issue" });
    }

    // Insert vote
    const insertVoteSql = "INSERT INTO votes (issueId, userId) VALUES (?, ?)";
    db.query(insertVoteSql, [issueId, userId], (err, result) => {
      if (err) {
        console.log('Database error inserting vote:', err);
        return res.status(500).send(err);
      }

      // Update issue votes count
      const updateVotesSql = "UPDATE issues SET votes = votes + 1 WHERE id = ?";
      db.query(updateVotesSql, [issueId], (err, result) => {
        if (err) {
          console.log('Database error updating votes:', err);
          return res.status(500).send(err);
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Issue not found" });
        }

        res.json({ message: "Vote added successfully" });
      });
    });
  });
};