// validators/skillRules.js
import { body } from 'express-validator';

export const createSkillRules = [
  body('title').trim().isLength({ min: 2, max: 120 }).withMessage('title 2-120 chars'),
  body('description').optional().isString(),
  body('price').optional().isFloat({ min: 0 }).withMessage('price >= 0')
];

export const updateSkillRules = [
  body().custom(v => Object.keys(v).length > 0).withMessage('nothing to update'),
  body('title').optional().trim().isLength({ min: 2, max: 120 }),
  body('description').optional().isString(),
  body('price').optional().isFloat({ min: 0 })
];
