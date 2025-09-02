import { Router } from "express";
import {
  getUsers,
  createUser,
  updateuser,
  deleteUser,
  getUserById,
} from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", updateuser);
router.delete("/:id", deleteUser);

export default router;
