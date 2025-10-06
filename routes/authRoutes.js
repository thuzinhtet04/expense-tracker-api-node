import express from "express";
import { register, login } from "../Controllers/authController.js";
const accountRoutes = express.Router();

// No auth middleware — public routes
accountRoutes.post("/register", register);
accountRoutes.post("/login", login);
accountRoutes.get("/", (req ,res) => {
    res.send("Success")
});

export default accountRoutes;
