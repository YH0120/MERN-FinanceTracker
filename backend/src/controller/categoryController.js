// Predefined categories for income and expense
const CATEGORIES = {
income: [
        'Salary',
        'Bonus',
        'Investment Income',
        'Side Hustle',
        'Gifts',
        'Other Income'
    ],
    expense: [
        'Food & Dining',
        'Transportation',
        'Shopping',
        'Entertainment',
        'Medical',
        'Education',
        'Housing',
        'Utilities',
        'Travel',
        'Other Expenses'
    ]
};

// Get all categories
export async function getCategories(req, res) {
    try {
        res.status(200).json(CATEGORIES);
    } catch (error) {
        console.error("Error in getCategories controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
