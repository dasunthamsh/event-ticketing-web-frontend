'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/libs/network';


export interface Ticket {
    id: number;
    title: string;
    venueName: string;
    description: string;
    locationCity: string;
    locationAddress?: string;
    startTime: string;
    endTime: string;
    price: number;
    imageUrl?: string | null;
    status: number;
    categories: string[];
    categoryIds?: string[];
}

interface ApiResponse {
    page: number;
    pageSize: number;
    total: number;
    items: Ticket[];
}

interface TicketSectionProps {
    onEditEvent: (event: Ticket) => void;
}

export default function TicketSection({ onEditEvent }: TicketSectionProps) {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchTickets(page);
    }, [page]);

    const fetchTickets = async (page: number) => {
        try {
            setIsLoading(true);
            setError('');

            const response = await apiClient.get<ApiResponse>(
                `/organizer/events?page=${page}&pageSize=${pageSize}`
            );

            setTickets(response.items || []);
            setTotal(response.total || 0);
        } catch (err: any) {
            console.error('Failed to fetch tickets:', err);
            setError(err.message || 'Failed to load events. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await apiClient.delete(`/organizer/events/${id}`);
            setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
            alert('Event deleted successfully!');
        } catch (err: any) {
            alert(err.message || 'Failed to delete event');
        }
    };

    const handleEdit = async (ticket: Ticket) => {
        try {
            // Fetch complete event details including description and address
            const completeEvent = await apiClient.get<Ticket>(`/organizer/events/${ticket.id}`);
            onEditEvent(completeEvent);
        } catch (err: any) {
            console.error('Failed to fetch event details:', err);
            // Fallback to the basic ticket data if detailed fetch fails
            onEditEvent(ticket);
        }
    };

    const handleRetry = () => {
        fetchTickets(page);
    };

    const formatDateTime = (date: string) =>
        new Date(date).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR'
        }).format(price);
    };

    const getImageUrl = (ticket: Ticket) => {
        if (!ticket.imageUrl) return null;

        // If it's already a full URL, return it
        if (ticket.imageUrl.startsWith('http')) return ticket.imageUrl;

        // If it's a relative path starting with /api, construct the full URL
        if (ticket.imageUrl.startsWith('/api/')) {
            return `https://localhost:7283${ticket.imageUrl}`;
        }

        // If it's just a path without /api, construct the proper API URL
        if (ticket.imageUrl.startsWith('/')) {
            return `https://localhost:7283/api${ticket.imageUrl}`;
        }

        // Default case - construct from event ID
        return `https://localhost:7283/api/events/${ticket.id}/image`;
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto mb-4">
                    {error}
                </div>
                <button
                    onClick={handleRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Events</h2>
                </div>

                {tickets.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No events available</h3>
                        <p className="text-gray-500">Check back later for new events</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white shadow rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Start</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">End</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Venue</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {tickets.map((ticket) => {
                                const imageUrl = getImageUrl(ticket);

                                return (
                                    <tr key={ticket.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="w-16 h-16 relative">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={ticket.title}
                                                        className="w-full h-full object-cover rounded"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const fallback = target.parentElement?.querySelector('.image-fallback');
                                                            if (fallback) {
                                                                fallback.classList.remove('hidden');
                                                            }
                                                        }}
                                                    />
                                                ) : null}
                                                {!imageUrl && (
                                                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center image-fallback">
                                                        <div className="text-white text-center">
                                                            <div className="text-lg">🎭</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{ticket.title}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(ticket.startTime)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {ticket.endTime ? formatDateTime(ticket.endTime) : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{ticket.venueName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{ticket.locationCity}</td>
                                        <td className="px-4 py-3 text-sm text-blue-600 font-semibold">
                                            {formatPrice(ticket.price)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    ticket.status === 0
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {ticket.status === 0 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(ticket)}
                                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ticket.id)}
                                                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}

                {total > pageSize && (
                    <div className="flex justify-center items-center mt-6 space-x-4">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-gray-700 text-sm">
                            Page {page} of {Math.ceil(total / pageSize)}
                        </span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= Math.ceil(total / pageSize)}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
