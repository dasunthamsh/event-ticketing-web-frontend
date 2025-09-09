import Link from 'next/link';
import Image from 'next/image';


export interface Ticket {
    id: string;
    title: string;
    subtitle: string;
    cast: string[];
    date: string;
    time: string;
    venue: string;
    price: string;
    imageUrl?: string;
    description?: string;
    duration?: string;
    category?: string;
}

export interface TicketDetails extends Ticket {
    fullDescription: string;
    castDetails: { name: string; role: string }[];
    venueAddress: string;
    termsConditions: string[];
    seatingPlan?: string;
}
interface TicketCardProps {
    ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Image Section */}
            <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600">
                {ticket.imageUrl ? (
                    <Image
                        src={ticket.imageUrl}
                        alt={ticket.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-white text-center">
                            <div className="text-2xl font-bold mb-2">M/Tickets</div>
                            <div className="text-sm opacity-90">{ticket.title}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Title and Subtitle */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{ticket.title}</h3>
                    <p className="text-sm text-gray-600 italic">{ticket.subtitle}</p>
                </div>


                {/* Date and Time */}
                <div className="flex gap-5 mb-4">
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {ticket.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {ticket.time}
                    </div>
                </div>

                {/* Venue */}
                <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {ticket.venue}
                    </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <p className="text-lg font-bold text-purple-700">{ticket.price}</p>
                </div>

                {/* Buy Tickets Button */}
                <Link
                    href={`/tickets/${ticket.id}`}
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                    Buy Tickets
                </Link>
            </div>
        </div>
    );
}
