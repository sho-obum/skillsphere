
export function ensureOwnerOrAdmin(req, ownerId) {
  if (req.user.role === 'admin') return true; // admin can always edit
  return Number(req.user.id) === Number(ownerId); // else must be owner
}
