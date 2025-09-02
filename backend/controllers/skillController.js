import db from "../db.js";
import { ensureOwnerOrAdmin } from "../utils/ownerCheck.js";
import { getPagination } from '../utils/pagination.js';
// get for skills


export const getSkills = async (req, res, next) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const [rows] = await db.query(
      `SELECT s.id, s.title, s.description, s.price, s.user_id, s.created_at, u.name AS owner_name
       FROM skills s JOIN users u ON u.id = s.user_id
       ORDER BY s.id DESC
       LIMIT ? OFFSET ?`, [limit, offset]
    );
    res.json({ data: rows, limit, offset, has_more: rows.length === limit });
  } catch (err) { next(err); }
};

// get by id

export const getSkillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT s.id, s.title, s.description, s.price, s.user_id, s.created_at,
              u.name AS owner_name
       FROM skills s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ?`,
      [id]
    );
    if (rows.length === 0) res.status(404).json({ error: "Skill Not Found" });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// post
export const createSkill = async (req, res, next) => {
  try {
    // 1) read body safely
    let { title, description = "", price = 0 } = req.body;

    // 2) validate inputs
    if (!title || !title.trim())
      return res.status(400).json({ error: "Title is required" });
    if (Number(price) < 0)
      return res.status(400).json({ error: "Price must be >= 0" });

    // 3) provider from token (requireAuth must be on the route)
    if (!req.user || !req.user.id)
      return res.status(401).json({ error: "Unauthorized" });
    const providerId = req.user.id; // ← use a new name, not user_id
    title = title.trim();

    // 4) insert into skills (column is user_id)
    const [result] = await db.query(
      "INSERT INTO skills (title, description, price, user_id) VALUES (?, ?, ?, ?)",
      [title, description, price, providerId]
    );

    // 5) respond
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      price: Number(price),
      user_id: providerId,
    });
  } catch (err) {
    next(err);
  }
};

// put
export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    // oqnwer fetch
    const [[skill]] = await db.query(
      "SELECT user_id FROM skills WHERE id = ?",
      [id]
    );
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    // owner yah admin check
    if (!ensureOwnerOrAdmin(req, skill.user_id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    let { title, description, price } = req.body;

    const fields = [];
    const values = [];
    if (title && title.trim()) {
      fields.push("title = ?");
      values.push(title.trim());
    }
    if (typeof description === "string") {
      fields.push("description = ?");
      values.push(description);
    }
    if (price != null) {
      if (Number(price) < 0)
        return res.status(400).json({ error: "Price must be >= 0" });
      fields.push("price = ?");
      values.push(price);
    }
    if (fields.length === 0)
      return res.status(400).json({ error: "Nothing to update" });

    values.push(id);
    const [result] = await db.query(
      `UPDATE skills SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Skill not found" });

    const [[updated]] = await db.query("SELECT * FROM skills WHERE id = ?", [
      id,
    ]);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// del
export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [[skill]] = await db.query(
      "SELECT user_id FROM skills WHERE id = ?",
      [id]
    );
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    if (!ensureOwnerOrAdmin(req, skill.user_id)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const [result] = await db.query("DELETE FROM skills WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Skill not found" });
    res.json({ message: "Skill deleted" });
  } catch (err) {
    next(err);
  }
};
