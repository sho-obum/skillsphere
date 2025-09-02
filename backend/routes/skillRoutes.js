// routes/skillRoutes.js
import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { validate } from '../middleware/validate.js';
import { createSkillRules, updateSkillRules } from '../validators/skillRules.js';
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
} from '../controllers/skillController.js';

const router = Router();

router.get('/', getSkills);
router.get('/:id', getSkillById);

router.post('/', requireAuth, createSkillRules, validate, createSkill);
router.put('/:id', requireAuth, updateSkillRules, validate, updateSkill);
router.delete('/:id', requireAuth, deleteSkill);

export default router;
