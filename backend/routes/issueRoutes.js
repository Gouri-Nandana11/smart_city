const express = require("express");
const router = express.Router();

const issueController = require("../controllers/issueController");

router.get("/issues", issueController.getIssues);
router.post("/issues", issueController.addIssue);

module.exports = router;