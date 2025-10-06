import express from 'express'
import { create, list, update, remove } from "../Controllers/accountController.js";
import authMiddleware from '../middleware/authMiddleware.js';

const accountRoutes = express.Router();
accountRoutes.use(authMiddleware);

// 📜 GET /api/accounts → list (global + user)
accountRoutes.get("/", list);

// ➕ POST /api/accounts → create custom account
accountRoutes.post("/", create);

// ✏️ PATCH /api/accounts/:id → update account
accountRoutes.patch("/:id", async (req, res) => {
  try {
    const updated = await update(req, res);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// ❌ DELETE /api/accounts/:id → remove custom account
accountRoutes.delete("/:id", async (req, res) => {
  try {
    const deleted = await remove(req, res);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default accountRoutes;
