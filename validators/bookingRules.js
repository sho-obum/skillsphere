import { body } from 'express-validator';

export const createBookingRules = [
  body('skill_id').isInt({ min: 1 }).withMessage('skill_id required'),
  body('start_time').isISO8601().withMessage('start_time must be ISO8601 UTC'),
  body('duration_mins').isInt({ min: 30, max: 180 }).withMessage('duration 30-180'),
  body('notes').optional().isString()
];
