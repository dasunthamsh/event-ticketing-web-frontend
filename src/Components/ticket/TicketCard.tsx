'use client';

import Link from 'next/link';
import Image from 'next/image';

export interface Ticket {
    id: number;
    title: string;
    startTime: string;
    endTime?: string;
    venueName: string;
    locationCity: string;
    locationAddress?: string;
    price: number;
    imageUrl?: string | null;
    description?: string;
    status: number;
    categories: string[];
}

interface TicketCardProps {
    ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
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

    // Build full image URL
    const getImageUrl = () => {
        if (!ticket.imageUrl) return null;

        // If it's already a full URL, return it
        if (ticket.imageUrl.startsWith('http')) return ticket.imageUrl;

        // If it's a relative path, construct the full URL
        if (ticket.imageUrl.startsWith('/')) {
            return `https://localhost:7283${ticket.imageUrl}`;
        }

        // Default case - construct from event ID
        return `https://localhost:7283/api/events/${ticket.id}/image`;
    };

    const imageUrl = getImageUrl();

    return (
        <Link href={`/ticket/${ticket.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-600">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={ticket.title}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-white text-center">
                                <div className="text-2xl font-bold mb-2">🎭</div>
                                <div className="text-sm opacity-90">{ticket.title}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {ticket.title}
                    </h3>

                    {/* Date and Time */}
                    <div className="mb-3">
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {formatDate(ticket.startTime)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {formatTime(ticket.startTime)}
                            {ticket.endTime && ` - ${formatTime(ticket.endTime)}`}
                        </div>
                    </div>

                    {/* Venue and Location */}
                    <div className="mb-3 space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="line-clamp-1">{ticket.venueName}</span>
                        </div>
                        <div className="text-xs text-gray-500 ml-6">
                            {ticket.locationCity}
                            {ticket.locationAddress && `, ${ticket.locationAddress}`}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">
                            {formatPrice(ticket.price)}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            View Details
                        </span>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            ticket.status === 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {ticket.status === 0 ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
