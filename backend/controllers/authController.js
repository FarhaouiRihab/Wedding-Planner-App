// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database"); // your MySQL pool

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = "7d"; // token validity

// POST /api/auth/register
exports.register = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "full_name, email, password required" });
  }

  try {
    // 1) check if email already exists
    const [existing] = await pool.query(
      "SELECT id FROM accounts WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // 2) hash password
    const password_hash = await bcrypt.hash(password, 10);

    // 3) insert user
    const [result] = await pool.query(
      "INSERT INTO accounts (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [full_name, email, password_hash, role || "USER"]
    );

    const user = {
      id: result.insertId,
      full_name,
      email,
      role: role || "USER",
    };

    // 4) create token
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  try {
    // 1) load user
    const [rows] = await pool.query(
      "SELECT * FROM accounts WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const account = rows[0];

    // 2) compare password
    const passwordMatch = await bcrypt.compare(
      password,
      account.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3) build payload (don’t send password_hash)
    const user = {
      id: account.id,
      full_name: account.full_name,
      email: account.email,
      role: account.role,
    };

    // 4) sign token
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
