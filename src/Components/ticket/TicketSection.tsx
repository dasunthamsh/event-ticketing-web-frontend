'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/libs/network';
import TicketCard from './TicketCard';

export interface Ticket {
    id: number;
    title: string;
    startTime: string;
    endTime?: string;
    venueName: string;
    locationCity: string;
    locationAddress?: string;
    price: number;
    imageUrl?: string;
    description?: string;
    status: number;
    categories: string[];
}

interface ApiResponse {
    page: number;
    pageSize: number;
    total: number;
    items: Ticket[];
}

export default function TicketSection() {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await apiClient.get<ApiResponse>('/organizer/events');

            // Extract tickets from the response
            const ticketsData = response.items || [];

            console.log('Fetched tickets:', ticketsData);

            setTickets(ticketsData);
        } catch (err: any) {
            console.error('Failed to fetch tickets:', err);
            setError(err.message || 'Failed to load events. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        fetchTickets();
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

    if (error) {
        return (
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
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
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Events</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover amazing events and book your tickets
                    </p>
                </div>

                {/* Tickets Grid */}
                {tickets.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🎭</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No events available</h3>
                        <p className="text-gray-500">Check back later for new events</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tickets.map((ticket) => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
