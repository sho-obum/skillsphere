import bcrypt from "bcrypt";
import db from "../db.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const SALT_ROUNDS = 10;
const VALID_ROLES = new Set(["customer", "provider", "admin"]);

// POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    let { name, email, password, role = "customer" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password required" });
    }

    name = String(name).trim();
    email = String(email).toLowerCase().trim();
    role = VALID_ROLES.has(role) ? role : "customer";

    // email unique?
    const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (exists.length) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)",
      [name, email, password_hash, role]
    );

    return res.status(201).json({ id: result.insertId, name, email, role });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    email = String(email).toLowerCase().trim();

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!rows.length) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = { id: user.id, role: user.role };
    const access_token = signAccessToken(payload);
    const refresh_token = signRefreshToken(payload);

    // allowlist store
    await db.query(
      "INSERT INTO user_refresh_tokens (user_id, token) VALUES (?, ?)",
      [user.id, refresh_token]
    );

    return res.json({
      access_token,
      refresh_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/refresh
export const refresh = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ error: "refresh_token required" });
    }

    const decoded = verifyRefreshToken(refresh_token);

    // allowlist check
    const [rows] = await db.query(
      "SELECT id FROM user_refresh_tokens WHERE user_id = ? AND token = ?",
      [decoded.id, refresh_token]
    );
    if (!rows.length) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const access_token = signAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    // (optional rotation) — abhi simple: same RT rakh rahe
    return res.json({ access_token });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ error: "refresh_token required" });
    }

    await db.query("DELETE FROM user_refresh_tokens WHERE token = ?", [
      refresh_token,
    ]);
    return res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};
