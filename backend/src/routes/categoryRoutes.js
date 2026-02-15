import express from "express";
import { getCategories } from "../controller/categoryController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getCategories);

export default router;
