'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/libs/network';
import Link from 'next/link';

export interface TicketDetails {
    id: number;
    title: string;
    description: string;
    status: number;
    startTime: string;
    endTime: string;
    venueName: string;
    locationCity: string;
    locationAddress: string;
    imageUrl?: string;
    categories: string[];
    price: number;
}

export default function EventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<TicketDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchTicketDetails(params.id as string);
        }
    }, [params.id]);

    const fetchTicketDetails = async (id: string) => {
        try {
            setIsLoading(true);
            setError('');

            const data = await apiClient.get<TicketDetails>(`/organizer/events/${id}`);
            setTicket(data);
        } catch (err: any) {
            console.error('Failed to fetch event details:', err);
            setError(err.message || 'Failed to load event details');
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Build full image URL - use proxy route
    const getImageUrl = () => {
        if (!ticket?.imageUrl) return null;

        // If it's already a full URL, return it
        if (ticket.imageUrl.startsWith('http')) return ticket.imageUrl;

        // If it's a relative path, construct the full URL
        if (ticket.imageUrl.startsWith('/')) {
            return `https://localhost:7283${ticket.imageUrl}`;
        }

        // Default case - use proxy route
        return `/api/event-image?id=${ticket.id}`;
    };

    const imageUrl = getImageUrl();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
                        {error}
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
                    <button
                        onClick={() => router.push('/events')}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/events" className="text-blue-600 hover:text-blue-500">
                            ← Back to Events
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-900">Event Details</h1>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Image */}
                    <div className="relative h-64 bg-gradient-to-br from-blue-600 to-purple-600">
                        {imageUrl && !imageError ? (
                            <img
                                src={imageUrl}
                                alt={ticket.title}
                                className="object-cover w-full h-full"
                                onError={() => setImageError(true)}
                                onLoad={() => setImageError(false)}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-600 to-purple-600">
                                <div className="text-white text-center">
                                    <div className="text-xl font-bold">{ticket.title}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{ticket.title}</h1>

                        {/* Status Badge */}
                        <div className="mb-6">
                            <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                                ticket.status === 0
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {ticket.status === 0 ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Date & Time</h3>
                                <p className="text-gray-600">{formatDate(ticket.startTime)}</p>
                                <p className="text-gray-600">
                                    {formatTime(ticket.startTime)} - {formatTime(ticket.endTime)}
                                </p>
                            </div>

                            {/* Venue and Location */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Venue</h3>
                                <p className="text-gray-600">{ticket.venueName}</p>
                                <p className="text-sm text-gray-500">{ticket.locationCity}</p>
                                {ticket.locationAddress && (
                                    <p className="text-sm text-gray-500">{ticket.locationAddress}</p>
                                )}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 className="font-semibold text-blue-700 mb-2">Price</h3>
                            <p className="text-2xl font-bold text-blue-600">
                                {formatPrice(ticket.price)}
                            </p>
                        </div>

                        {/* Description */}
                        {ticket.description && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{ticket.description}</p>
                            </div>
                        )}

                        {/* Categories */}
                        {ticket.categories && ticket.categories.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-2">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {ticket.categories.map((category, index) => (
                                        <span key={index} className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Book Ticket Button */}
                        <div className="mt-8">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
