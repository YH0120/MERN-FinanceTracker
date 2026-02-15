import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const StatisticsPanel = ({ statistics, loading }) => {
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="animate-pulse">
                                <div className="h-4 bg-base-300 rounded w-20 mb-2"></div>
                                <div className="h-8 bg-base-300 rounded w-32"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Income */}
            <div className="card bg-gradient-to-br from-success/20 to-success/5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-base-content/60 mb-1">Total Income</p>
                            <p className="text-2xl font-bold text-success">
                                {formatAmount(statistics.totalIncome)}
                            </p>
                        </div>
                        <div className="p-3 bg-success/20 rounded-lg">
                            <TrendingUp className="size-8 text-success" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Expense */}
            <div className="card bg-gradient-to-br from-error/20 to-error/5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-base-content/60 mb-1">Total Expense</p>
                            <p className="text-2xl font-bold text-error">
                                {formatAmount(statistics.totalExpense)}
                            </p>
                        </div>
                        <div className="p-3 bg-error/20 rounded-lg">
                            <TrendingDown className="size-8 text-error" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Balance */}
            <div className="card bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-base-content/60 mb-1">Balance</p>
                            <p className={`text-2xl font-bold ${statistics.balance >= 0 ? 'text-primary' : 'text-error'}`}>
                                {formatAmount(statistics.balance)}
                            </p>
                        </div>
                        <div className="p-3 bg-primary/20 rounded-lg">
                            <Wallet className="size-8 text-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPanel;
