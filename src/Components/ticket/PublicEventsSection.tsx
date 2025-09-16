'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/libs/network';
import TicketCard, { Ticket } from './TicketCard';

interface ApiResponse {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    items: Ticket[];
}

interface FilterParams {
    categoryId?: string;
    city?: string;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
}

interface Category {
    id: string;
    name: string;
}

// Mock categories - replace with API call if available
const MOCK_CATEGORIES: Category[] = [
    { id: '1', name: 'Concert' },
    { id: '2', name: 'Theater' },
    { id: '3', name: 'Sports' },
    { id: '4', name: 'Conference' },
    { id: '5', name: 'Workshop' },
    { id: '6', name: 'Exhibition' },
];

// Mock cities - replace with API call or dynamic data
const MOCK_CITIES = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Matara',
    'Anuradhapura', 'Polonnaruwa', 'Trincomalee', 'Batticaloa'
];

export default function PublicEventSection() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState<FilterParams>({
        page: 1,
        pageSize: 20
    });
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
    });

    useEffect(() => {
        fetchEvents();
    }, [filters]);

    const buildQueryString = (params: FilterParams): string => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });

        return queryParams.toString();
    };

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            setError('');

            const queryString = buildQueryString(filters);
            const endpoint = queryString ? `/events?${queryString}` : '/events';

            const response = await apiClient.get<ApiResponse>(endpoint);

            setTickets(response.items || []);
            setPagination({
                page: response.page || 1,
                pageSize: response.pageSize || 20,
                total: response.total || 0,
                totalPages: response.totalPages || 0
            });
        } catch (err: any) {
            console.error('Failed to fetch events:', err);
            setError(err.message || 'Failed to load events. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key: keyof FilterParams, value: string | number | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            page: 1,
            pageSize: 20
        });
    };

    const hasActiveFilters = () => {
        const { categoryId, city, from, to } = filters;
        return !!categoryId || !!city || !!from || !!to;
    };

    if (isLoading) {
        return (
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading events...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.categoryId || ''}
                                onChange={(e) => handleFilterChange('categoryId', e.target.value || undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {MOCK_CATEGORIES.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* City Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <select
                                value={filters.city || ''}
                                onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Cities</option>
                                {MOCK_CITIES.map(city => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date From Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={filters.from || ''}
                                onChange={(e) => handleFilterChange('from', e.target.value || undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Date To Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                To Date
                            </label>
                            <input
                                type="date"
                                value={filters.to || ''}
                                onChange={(e) => handleFilterChange('to', e.target.value || undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters() && (
                        <div className="mt-4">
                            <button
                                onClick={handleClearFilters}
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                        <button
                            onClick={fetchEvents}
                            className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Events Grid */}
                {tickets.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🎭</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {hasActiveFilters() ? 'No events match your filters' : 'No events available'}
                        </h3>
                        <p className="text-gray-500">
                            {hasActiveFilters()
                                ? 'Try adjusting your filters to see more events'
                                : 'Check back later for new events'
                            }
                        </p>
                        {hasActiveFilters() && (
                            <button
                                onClick={handleClearFilters}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            {tickets.map((ticket) => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 border rounded-md ${
                                            pagination.page === page
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300 text-gray-700'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {/* Results Info */}
                        <div className="text-center text-sm text-gray-600 mt-4">
                            Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
                            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
                            {pagination.total} events
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
