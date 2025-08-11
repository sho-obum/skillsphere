// OVERLAP LOGIC

// Requested slot: [reqStart, reqEnd)
// Existing confirmed slot: [exStart, exEnd)
// Overlap condition: reqStart < exEnd AND exStart < reqEnd

// SQL me end-time compute:

// exEnd = exStart + INTERVAL duration_mins MINUTE

// reqEnd = ? + INTERVAL ? MINUTE (parameters se)

import db from "../db.js";

const nowPlusMinutes = (startISO, mins) => {
  return null;
};

const isFuture = (iso) => new Date(iso).getTime() > Date.now();
const validDuration = (d) =>
  Number.isInteger(Number(d)) && Number(d) >= 30 && Number(d) <= 180;

// core: overlap check against provider's CONFIRMED bookings
//goal: provider ke confimred slits me req slot se ovelap na ho
async function hasOverlap(providerId, reqStartISO, reqDuration) {
  const [rows] = await db.query(
    `
    SELECT 1
    FROM bookings
    WHERE provider_id = ?
      AND status = 'CONFIRMED'
      AND start_time < (TIMESTAMP(?) + INTERVAL ? MINUTE)           
      AND (start_time + INTERVAL duration_mins MINUTE) > TIMESTAMP(?) 
    LIMIT 1
    `,
    [providerId, reqStartISO, reqDuration, reqStartISO]
  );
  return rows.length > 0;
}

//post
export const createBooking = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { skill_id, start_time, duration_mins, notes = "" } = req.body;

    // validate
    if (!skill_id || !start_time || !duration_mins)
      return res
        .status(400)
        .json({ error: "skill_id, start_time, duration_mins required" });

    if (!isFuture(start_time))
      return res
        .status(400)
        .json({ error: "start_time must be in the future" });

    if (!validDuration(duration_mins))
      return res
        .status(400)
        .json({ error: "duration_mins must be between 30 and 180" });

    // fetch skill & provider
    const [skillRows] = await db.query(
      "SELECT id, user_id, price FROM skills WHERE id = ?",
      [skill_id]
    );
    if (!skillRows.length)
      return res.status(404).json({ error: "Skill not found" });

    const skill = skillRows[0];
    const providerId = skill.user_id;

    // no self book
    if (Number(providerId) === Number(customerId))
      return res.status(400).json({ error: "Cannot book your own skill" });

    // overlap check krliya
    const overlap = await hasOverlap(providerId, start_time, duration_mins);
    if (overlap)
      return res
        .status(409)
        .json({ error: "Time slot overlaps with existing booking" });

    // insert in bookign table with pending status and price
    const price = skill.price ?? 0;
    const [result] = await db.query(
      `INSERT INTO bookings
        (skill_id, customer_id, provider_id, start_time, duration_mins, price_snapshot, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
      [
        skill_id,
        customerId,
        providerId,
        start_time,
        duration_mins,
        price,
        notes,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      skill_id,
      customer_id: customerId,
      provider_id: providerId,
      start_time,
      duration_mins,
      price_snapshot: Number(price),
      status: "PENDING",
      notes,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/:id  (owner/admin)
export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[booking]] = await db.query(
      `SELECT b.*, s.title AS skill_title
       FROM bookings b JOIN skills s ON s.id = b.skill_id
       WHERE b.id = ?`,
      [id]
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const uid = req.user.id;
    const isAdmin = req.user.role === "admin";
    const owner =
      Number(uid) === Number(booking.customer_id) ||
      Number(uid) === Number(booking.provider_id);
    if (!owner && !isAdmin) return res.status(403).json({ error: "Forbidden" });

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/me?role=customer|provider&status?&limit?&offset?
// Goal: Logged-in user ko apni bookings dikhani (customer view ya provider view
export const listMyBookings = async (req, res, next) => {
  try {
    const uid = req.user.id;
    const role = req.query.role === "provider" ? "provider" : "customer";
    const status = req.query.status;
    const limit = Number(req.query.limit || 20);
    const offset = Number(req.query.offset || 0);

    let where = "";
    let params = [];

    if (role === "provider") {
      where = "b.provider_id = ?";
    } else {
      where = "b.customer_id = ?";
    }

    // id ko params me push
    params.push(uid);

    // agar status diya hai to extra condition 
    if (status) {
      where = where + " AND b.status = ?";
      params.push(status);
    }

    const [rows] = await db.query(
      `SELECT b.*, s.title AS skill_title
       FROM bookings b JOIN skills s ON s.id = b.skill_id
       WHERE ${where}
       ORDER BY b.start_time DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// POST /api/bookings/:id/confirm  (provider/admin)
export const confirmBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[booking]] = await db.query("SELECT * FROM bookings WHERE id = ?", [
      id,
    ]);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const isAdmin = req.user.role === "admin";
    if (!isAdmin && Number(req.user.id) !== Number(booking.provider_id))
      return res.status(403).json({ error: "Only provider can confirm" });
    if (booking.status !== "PENDING")
      return res.status(400).json({ error: "Only PENDING can be confirmed" });

    const clash = await hasOverlap(
      booking.provider_id,
      booking.start_time,
      booking.duration_mins
    );
    if (clash)
      return res.status(409).json({ error: "Time overlaps existing booking" });

    await db.query('UPDATE bookings SET status = "CONFIRMED" WHERE id = ?', [
      id,
    ]);
    res.json({ message: "Booking confirmed", id: Number(id) });
  } catch (err) {
    next(err);
  }
};

// POST /api/bookings/:id/cancel  (customer/provider/admin)
export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[booking]] = await db.query("SELECT * FROM bookings WHERE id = ?", [
      id,
    ]);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const isAdmin = req.user.role === "admin";
    const isOwner =
      Number(req.user.id) === Number(booking.customer_id) ||
      Number(req.user.id) === Number(booking.provider_id);
    if (!isOwner && !isAdmin)
      return res.status(403).json({ error: "Forbidden" });
    if (booking.status === "COMPLETED")
      return res.status(400).json({ error: "Cannot cancel completed" });

    await db.query('UPDATE bookings SET status = "CANCELLED" WHERE id = ?', [
      id,
    ]);
    res.json({ message: "Booking cancelled", id: Number(id) });
  } catch (err) {
    next(err);
  }
};

// POST /api/bookings/:id/complete  (provider/admin)
export const completeBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[booking]] = await db.query("SELECT * FROM bookings WHERE id = ?", [
      id,
    ]);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const isAdmin = req.user.role === "admin";
    if (!isAdmin && Number(req.user.id) !== Number(booking.provider_id))
      return res.status(403).json({ error: "Only provider can complete" });
    if (booking.status !== "CONFIRMED")
      return res.status(400).json({ error: "Only CONFIRMED can be completed" });

    await db.query('UPDATE bookings SET status = "COMPLETED" WHERE id = ?', [
      id,
    ]);
    res.json({ message: "Booking completed", id: Number(id) });
  } catch (err) {
    next(err);
  }
};
