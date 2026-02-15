import { Trash2, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const TransactionCard = ({ transaction, setTransactions }) => {
    const isIncome = transaction.type === 'income';

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;

        try {
            await api.delete(`/transactions/${transaction._id}`);
            setTransactions(prev => prev.filter(t => t._id !== transaction._id));
            toast.success('Transaction deleted');
        } catch (error) {
            console.error('Error deleting transaction:', error);
            toast.error('Failed to delete');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${isIncome ? 'bg-success/20' : 'bg-error/20'}`}>
                            {isIncome ? (
                                <TrendingUp className={`size-6 text-success`} />
                            ) : (
                                <TrendingDown className={`size-6 text-error`} />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{transaction.category}</h3>
                            <p className="text-sm text-base-content/60">{formatDate(transaction.date)}</p>
                            {transaction.description && (
                                <p className="text-sm text-base-content/70 mt-1 line-clamp-2">
                                    {transaction.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`text-xl font-bold ${isIncome ? 'text-success' : 'text-error'}`}>
                            {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
                        </p>
                    </div>
                </div>

                <div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
                    <Link
                        to={`/transaction/${transaction._id}`}
                        className="btn btn-sm btn-ghost"
                    >
                        <Edit className="size-4" />
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="btn btn-sm btn-ghost text-error"
                    >
                        <Trash2 className="size-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
