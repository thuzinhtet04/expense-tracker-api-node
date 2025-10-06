import express from 'express'
import  { create, list } from '../Controllers/categoryController.js';
import authMiddleware from '../middleware/authMiddleware.js'

const categroyRoutes = express.Router();

categroyRoutes.use(authMiddleware);
categroyRoutes.get("/", list);
categroyRoutes.post("/", create);

export default categroyRoutes;
