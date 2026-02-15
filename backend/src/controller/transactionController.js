import Transaction from "../models/Transaction.js";

// Get all transactions with optional filters
export async function getAllTransactions(req, res) {
    try {
        const { startDate, endDate, category, type } = req.query;

        // Build filter object
        const filter = { userId: req.user._id };

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        if (category) filter.category = category;
        if (type) filter.type = type;

        const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error in getAllTransactions controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get transaction by ID
export async function getTransactionById(req, res) {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json(transaction);
    } catch (error) {
        console.error("Error in getTransactionById controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Create new transaction
export async function createTransaction(req, res) {
    try {
        const { type, amount, category, date, description } = req.body;

        // Validation
        if (!type || !amount || !category || !date) {
            return res.status(400).json({
                message: "Type, amount, category, and date are required"
            });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({
                message: "Type must be either 'income' or 'expense'"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        const newTransaction = new Transaction({
            type,
            amount,
            category,
            date,
            description: description || '',
            userId: req.user._id
        });

        await newTransaction.save();
        res.status(201).json({
            message: "Transaction created successfully!",
            transaction: newTransaction
        });
    } catch (error) {
        console.error("Error in createTransaction controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Update transaction
export async function updateTransaction(req, res) {
    try {
        const { type, amount, category, date, description } = req.body;

        // Validation
        if (type && !['income', 'expense'].includes(type)) {
            return res.status(400).json({
                message: "Type must be either 'income' or 'expense'"
            });
        }

        if (amount !== undefined && amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { type, amount, category, date, description },
            { new: true, runValidators: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({
            message: "Transaction updated successfully!",
            transaction: updatedTransaction
        });
    } catch (error) {
        console.error("Error in updateTransaction controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Delete transaction
export async function deleteTransaction(req, res) {
    try {
        const deletedTransaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteTransaction controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get statistics (total income, total expense, balance)
export async function getStatistics(req, res) {
    try {
        const { startDate, endDate } = req.query;

        // Build filter object
        const filter = { userId: req.user._id };

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        // Get all transactions for the user
        const transactions = await Transaction.find(filter);

        // Calculate statistics
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpense;

        res.status(200).json({
            totalIncome,
            totalExpense,
            balance,
            transactionCount: transactions.length
        });
    } catch (error) {
        console.error("Error in getStatistics controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
