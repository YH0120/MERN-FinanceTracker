import express from "express";
import {
    createTransaction,
    deleteTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    getStatistics
} from "../controller/transactionController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getAllTransactions);
router.get("/statistics", getStatistics);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
