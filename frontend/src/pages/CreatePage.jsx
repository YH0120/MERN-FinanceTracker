import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";

const CreatePage = () => {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState({ income: [], expense: [] });

  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
        // Set default category
        if (res.data.expense && res.data.expense.length > 0) {
          setCategory(res.data.expense[0]);
        }
      } catch (error) {
        console.log("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Update category when type changes
  useEffect(() => {
    if (type === 'income' && categories.income && categories.income.length > 0) {
      setCategory(categories.income[0]);
    } else if (type === 'expense' && categories.expense && categories.expense.length > 0) {
      setCategory(categories.expense[0]);
    }
  }, [type, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !category || !date) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      await api.post("/transactions", {
        type,
        amount: parseFloat(amount),
        category,
        date,
        description
      });
      toast.success("Transaction created successfully");
      navigate("/");
    } catch (error) {
      console.log("Error creating transaction", error);
      if (error.response?.status === 429) {
        toast.error("Too many requests, please try again later", {
          duration: 4000,
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = type === 'income' ? categories.income : categories.expense;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Home
          </Link>
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Add Transaction</h2>
              <form onSubmit={handleSubmit}>
                {/* Transaction Type */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Transaction Type</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="type"
                        className="radio radio-success"
                        value="income"
                        checked={type === 'income'}
                        onChange={(e) => setType(e.target.value)}
                      />
                      <span className="label-text">Income</span>
                    </label>
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="type"
                        className="radio radio-error"
                        value="expense"
                        checked={type === 'expense'}
                        onChange={(e) => setType(e.target.value)}
                      />
                      <span className="label-text">Expense</span>
                    </label>
                  </div>
                </div>

                {/* Amount */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Amount *</span>
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="input input-bordered"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Category */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Category *</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {currentCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Date *</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    placeholder="Add description (optional)"
                    className="textarea textarea-bordered h-24"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Transaction"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;