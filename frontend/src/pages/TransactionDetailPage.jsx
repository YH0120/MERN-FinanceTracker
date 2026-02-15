import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { LoaderIcon, ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";

const TransactionDetailPage = () => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState({ income: [], expense: [] });

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (error) {
        console.log("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch transaction
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await api.get(`/transactions/${id}`);
        // Format date for input
        const formattedTransaction = {
          ...res.data,
          date: new Date(res.data.date).toISOString().split('T')[0]
        };
        setTransaction(formattedTransaction);
      } catch (error) {
        console.log("Error fetching transaction", error);
        toast.error("Failed to load transaction");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted successfully");
      navigate("/");
    } catch (error) {
      console.log("Error deleting transaction", error);
      toast.error("Failed to delete transaction");
    }
  };

  const handleSave = async () => {
    if (!transaction.amount || !transaction.category || !transaction.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(transaction.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/transactions/${id}`, {
        ...transaction,
        amount: parseFloat(transaction.amount)
      });
      toast.success("Transaction updated successfully");
    } catch (error) {
      console.log("Error saving transaction", error);
      toast.error(error.response?.data?.message || "Failed to update transaction");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Transaction not found</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const currentCategories = transaction.type === 'income' ? categories.income : categories.expense;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to={"/"} className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Home
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline">
              <Trash2Icon className="h-5 w-5" />
              Delete Transaction
            </button>
          </div>
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Edit Transaction</h2>

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
                      checked={transaction.type === 'income'}
                      onChange={(e) => setTransaction({ ...transaction, type: e.target.value })}
                    />
                    <span className="label-text">Income</span>
                  </label>
                  <label className="label cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="type"
                      className="radio radio-error"
                      value="expense"
                      checked={transaction.type === 'expense'}
                      onChange={(e) => setTransaction({ ...transaction, type: e.target.value })}
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
                  value={transaction.amount}
                  onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
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
                  value={transaction.category}
                  onChange={(e) => setTransaction({ ...transaction, category: e.target.value })}
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
                  value={transaction.date}
                  onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
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
                  value={transaction.description || ''}
                  onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
                />
              </div>

              <div className="card-actions justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;