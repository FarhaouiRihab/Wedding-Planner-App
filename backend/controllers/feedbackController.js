// backend/controllers/feedbackController.js
const pool = require("../config/database");

/**
 * GET /api/feedback
 * Returns all feedback with the user name + email (joined from accounts)
 */
exports.getAllFeedback = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        f.id,
        f.user_id,
        f.comment,
        f.created_at,
        a.full_name,
        a.email
      FROM feedback f
      JOIN accounts a ON f.user_id = a.id
      ORDER BY f.created_at DESC
      `
    );

    res.json(rows); // array, so frontend can do setFeedbackList(res.data)
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

/**
 * POST /api/feedback
 * Body: { user_id, comment }
 */
exports.createFeedback = async (req, res) => {
  const { user_id, comment } = req.body;

  if (!user_id || !comment || !comment.trim()) {
    return res
      .status(400)
      .json({ error: "user_id and non-empty comment are required" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.query(
      "INSERT INTO feedback (user_id, comment) VALUES (?, ?)",
      [user_id, comment.trim()]
    );

    const insertedId = result.insertId;

    const [rows] = await conn.query(
      `
      SELECT 
        f.id,
        f.user_id,
        f.comment,
        f.created_at,
        a.full_name,
        a.email
      FROM feedback f
      JOIN accounts a ON f.user_id = a.id
      WHERE f.id = ?
      `,
      [insertedId]
    );

    await conn.commit();
    res.status(201).json(rows[0]);
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("Error creating feedback:", err);
    res.status(500).json({ error: "Failed to create feedback" });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * DELETE /api/feedback/:id
 */
exports.deleteFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM feedback WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting feedback:", err);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
};
