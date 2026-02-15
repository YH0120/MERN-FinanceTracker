import { Filter, X } from 'lucide-react';
import { useState } from 'react';

const FilterPanel = ({ onFilterChange, categories }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        category: '',
        type: ''
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters = {
            startDate: '',
            endDate: '',
            category: '',
            type: ''
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== '');

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-outline gap-2"
            >
                <Filter className="size-4" />
                Filter
                {hasActiveFilters && (
                    <span className="badge badge-primary badge-sm">Active</span>
                )}
            </button>

            {isOpen && (
                <div className="card bg-base-100 shadow-lg mt-4">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Filter Options</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="btn btn-ghost btn-sm btn-circle"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Date Range */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Start Date</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={filters.startDate}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">End Date</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={filters.endDate}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                />
                            </div>

                            {/* Type Filter */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Transaction Type</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Category</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.income && categories.income.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    {categories.expense && categories.expense.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="card-actions justify-end mt-4">
                            <button
                                onClick={handleReset}
                                className="btn btn-ghost"
                                disabled={!hasActiveFilters}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPanel;
