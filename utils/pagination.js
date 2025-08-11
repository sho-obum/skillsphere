// q = req.query jaisa object
// defaultLimit = default rows per page
// maxLimit = upper cap taaki DB ko dard na ho
export function getPagination(q, defaultLimit = 20, maxLimit = 100) {
  // limit
  let limit = parseInt(q?.limit, 10);
  if (!Number.isFinite(limit)) limit = defaultLimit; // agar diya hi nahi / galat diya
  if (limit < 1) limit = 1;                          // 1 se kam? 1 kar do
  if (limit > maxLimit) limit = maxLimit;            // bahut bada? cap kar do

  //  OFFSET 
  let offset = parseInt(q?.offset, 10);
  if (!Number.isFinite(offset) || offset < 0) offset = 0; // negative/invalid? 0

  return { limit, offset };
}
