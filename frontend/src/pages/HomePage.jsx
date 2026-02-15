import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import api from "../lib/axios";
import toast from "react-hot-toast";
import TransactionCard from "../components/TransactionCard";
import TransactionsNotFound from '../components/TransactionsNotFound';
import StatisticsPanel from '../components/StatisticsPanel';
import FilterPanel from '../components/FilterPanel';

const HomePage = () => {
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [statistics, setStatistics] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
    });
    const [categories, setCategories] = useState({ income: [], expense: [] });
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        category: '',
        type: ''
    });

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

    // Fetch transactions
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const params = {};
                if (filters.startDate) params.startDate = filters.startDate;
                if (filters.endDate) params.endDate = filters.endDate;
                if (filters.category) params.category = filters.category;
                if (filters.type) params.type = filters.type;

                const res = await api.get("/transactions", { params });
                setTransactions(res.data);
                setIsRateLimited(false);
            } catch (error) {
                console.log("Error fetching transactions", error);
                if (error.response?.status === 429) {
                    setIsRateLimited(true);
                } else {
                    toast.error("Failed to load transactions");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [filters]);

    // Fetch statistics
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const params = {};
                if (filters.startDate) params.startDate = filters.startDate;
                if (filters.endDate) params.endDate = filters.endDate;

                const res = await api.get("/transactions/statistics", { params });
                setStatistics(res.data);
            } catch (error) {
                console.log("Error fetching statistics", error);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStatistics();
    }, [filters.startDate, filters.endDate]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setLoading(true);
        setStatsLoading(true);
    };

    return (
        <div className='min-h-screen'>
            <Navbar />

            {isRateLimited && <RateLimitedUI />}

            <div className='max-w-7xl mx-auto p-4 mt-6'>
                <StatisticsPanel statistics={statistics} loading={statsLoading} />

                <FilterPanel
                    onFilterChange={handleFilterChange}
                    categories={categories}
                />

                {loading && <div className='text-center text-primary py-10'>Loading...</div>}

                {!loading && transactions.length === 0 && !isRateLimited && <TransactionsNotFound />}

                {!loading && transactions.length > 0 && !isRateLimited && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {transactions.map((transaction) => (
                            <TransactionCard
                                key={transaction._id}
                                transaction={transaction}
                                setTransactions={setTransactions}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;