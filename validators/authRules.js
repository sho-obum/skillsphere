import { body } from 'express-validator';

export const signupRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('name min 2 chars'),
  body('email').isEmail().withMessage('valid email required'),
  body('password').isLength({ min: 8 }).withMessage('password min 8 chars'),
  body('role').optional().isIn(['customer','provider','admin']).withMessage('invalid role')
];

export const loginRules = [
  body('email').isEmail().withMessage('valid email required'),
  body('password').notEmpty().withMessage('password required')
];
