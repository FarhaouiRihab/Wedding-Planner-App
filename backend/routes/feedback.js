// backend/routes/feedback.js
const express = require("express");
const router = express.Router();

const feedbackController = require("../controllers/feedbackController");

// List all feedback (joined with accounts)
router.get("/", feedbackController.getAllFeedback);

// Create new feedback
router.post("/", feedbackController.createFeedback);

// Delete feedback
router.delete("/:id", feedbackController.deleteFeedback);

module.exports = router;
