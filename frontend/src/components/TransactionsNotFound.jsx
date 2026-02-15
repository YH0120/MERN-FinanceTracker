import { Receipt } from 'lucide-react';
import { Link } from 'react-router';

const TransactionsNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <Receipt className="size-24 text-base-content/20 mb-4" />
            <h3 className="text-2xl font-semibold text-base-content/60 mb-2">
                No Transactions Yet
            </h3>
            <p className="text-base-content/50 mb-6">
                Start tracking your first income or expense!
            </p>
            <Link to="/create" className="btn btn-primary">
                Add Transaction
            </Link>
        </div>
    );
};

export default TransactionsNotFound;
