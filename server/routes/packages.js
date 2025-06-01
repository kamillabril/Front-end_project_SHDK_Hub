
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM packages");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  const { title } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO packages (title) VALUES ($1) RETURNING *",
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/:id/questions", async (req, res) => {
  const packageId = req.params.id;
  const { text, answer } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO questions (package_id, text, answer, likes, dislikes) VALUES ($1, $2, $3, 0, 0) RETURNING *",
      [packageId, text, answer]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
