const express = require("express");
const router = express.Router();

const issueController = require("../controllers/issueController");

router.get("/issues", issueController.getIssues);
router.get("/user/issues", issueController.getUserIssues);
router.post("/issues", issueController.addIssue);
router.put("/issues/:id", issueController.updateIssue);
router.put("/issues/:id/upvote", issueController.upvoteIssue);

module.exports = router;