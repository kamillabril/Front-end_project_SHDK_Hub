const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const pool = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());


app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Користувач вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);

    res.status(201).json({ message: "Користувача зареєстровано" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Користувача не знайдено" });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Невірний пароль" });
    }

    res.status(200).json({ message: "Вхід успішний" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});


app.get("/packages", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM packages ORDER BY id DESC");
    const packages = result.rows;


    for (const pack of packages) {
      const qRes = await pool.query("SELECT * FROM questions WHERE package_id = $1", [pack.id]);
      pack.questions = qRes.rows;
    }

    res.json(packages);
  } catch (err) {
    console.error("Помилка при отриманні пакетів:", err);
    res.status(500).json({ message: "Помилка при отриманні пакетів" });
  }
});



app.post("/packages", async (req, res) => {
  const { title, createdBy } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO packages (title, created_by) VALUES ($1, $2) RETURNING *",
      [title, createdBy]
    );
    const newPackage = result.rows[0];
    newPackage.questions = [];

    res.status(201).json(newPackage);
  } catch (err) {
    console.error("Помилка при створенні пакету:", err);
    res.status(500).json({ message: "Помилка при створенні пакету" });
  }
});


app.post("/packages/:id/questions", async (req, res) => {
  const packageId = req.params.id;
  const { text, answer, author } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO questions (package_id, text, answer, author) VALUES ($1, $2, $3, $4) RETURNING *",
      [packageId, text, answer, author]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при додаванні питання" });
  }
});


app.delete("/packages/:id/questions/:qid", async (req, res) => {
  const questionId = req.params.qid;

  try {
    await pool.query("DELETE FROM questions WHERE id = $1", [questionId]);
    res.status(200).json({ message: "Питання видалено" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при видаленні питання" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
