// client ki galtiyān 400 pe pakdo, 500 se bachō.
//  per-route rules + ek validate() to collect errors.

import { validationResult } from 'express-validator';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  // uniform 400 with details
  return res.status(400).json({
    error: 'Validation failed',
    details: errors.array().map(e => ({
      field: e.type === 'field' ? e.path : 'body',
      message: e.msg
    }))
  });
}
