import db from "../db.js";

export const getUsers = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// for single
export const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM users WHERE id=?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "user not found" });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    if (!name || !name.trim())
      return res.status(404).json({ error: "name not found" });

    const [result] = await db.query("INSERT INTO users (name) VALUES (?)", [
      name.trim(),
    ]);
    res.status(201).json({ id: result.insertId, name: name.trim() });
  } catch (error) {
    next(error);
  }
};

export const updateuser = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim())
    return res.status(404).json({ error: "Name is required" });

  const [result] = await db.query("UPDATE users SET name = ? WHERE id = ?", [
    name.trim(),
    id,
  ]);
  if (result.affectedRows === 0)
    return res.status(404).json({ error: "User not found" });

  return res.status(201).json({ id: Number(id), name: name.trim() });
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
