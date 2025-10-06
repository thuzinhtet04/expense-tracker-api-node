import express from 'express'
import {
  list,
  create,
  update,
  remove,
} from "../Controllers/transcationController.js";

import authMiddleware from '../middleware/authMiddleware.js'

const transcationRoutes = express.Router();
transcationRoutes.use(authMiddleware);

// 📜 GET /api/transactions → list all user transactions
transcationRoutes.get("/", list);

// ➕ POST /api/transactions → create transaction (income/expense)
transcationRoutes.post("/", create);

// ✏️ PATCH /api/transactions/:id → edit transaction (optional)
transcationRoutes.patch("/:id", async (req, res) => {
  try {
    const updated = await update(req, res);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// ❌ DELETE /api/transactions/:id → remove transaction
transcationRoutes.delete("/:id", async (req, res) => {
  try {
    const deleted = await remove(req, res);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default transcationRoutes;
