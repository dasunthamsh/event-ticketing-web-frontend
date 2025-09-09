import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';


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

// riplce with API
const getTicketDetails = async (id: string): Promise<TicketDetails | null> => {
    const mockData: Record<string, TicketDetails> = {
        '1': {
            id: '1',
            title: 'Wingfield Family',
            subtitle: 'A Play by Pujitha De Mel',
            cast: ['Chandan Seneviratne', 'Ravindra Yasas', 'Manushie Taniya', 'Bimsara Silva'],
            date: 'Sep 14, 2025',
            time: '06.30 PM IST',
            venue: 'BMICH "Kamatha" Open Air',
            price: '1,000 LKR upwards',
            imageUrl: '/images/wingfield-family.jpg',
            description: 'A compelling drama about the Wingfield family dynamics.',
            fullDescription: 'Wingfield Family is a powerful drama that explores the complex relationships within the Wingfield household. Written and directed by Pujitha De Mel, this play takes you on an emotional journey through love, loss, and redemption. Set in contemporary Sri Lanka, the story resonates with universal themes of family bonds and personal struggles.',
            castDetails: [
                { name: 'Chandan Seneviratne', role: 'Mr. Wingfield' },
                { name: 'Ravindra Yasas', role: 'Mrs. Wingfield' },
                { name: 'Manushie Taniya', role: 'Daughter' },
                { name: 'Bimsara Silva', role: 'Son' }
            ],
            venueAddress: 'Bauddhaloka Mawatha, Colombo 07, Sri Lanka',
            duration: '2 hours 30 minutes',
            category: 'Drama',
            termsConditions: [
                'Tickets are non-refundable',
                'Children under 5 not permitted',
                'Doors open 1 hour before showtime',
                'Latecomers may be seated at management discretion'
            ]
        },
        '2': {
            id: '2',
            title: 'Romeo and Juliet',
            subtitle: 'Shakespeare Classic',
            cast: ['John Doe', 'Jane Smith', 'Mike Johnson'],
            date: 'Oct 20, 2025',
            time: '07.00 PM IST',
            venue: 'Nelum Pokuna Theatre',
            price: '1,500 LKR upwards',
            fullDescription: 'The timeless tale of star-crossed lovers in a modern adaptation.',
            castDetails: [
                { name: 'John Doe', role: 'Romeo' },
                { name: 'Jane Smith', role: 'Juliet' },
                { name: 'Mike Johnson', role: 'Mercutio' }
            ],
            venueAddress: 'Ananda Coomaraswamy Mawatha, Colombo 07',
            duration: '2 hours 45 minutes',
            category: 'Romance',
            termsConditions: [
                'Tickets are non-refundable',
                'Recommended for ages 12+',
                'No photography during performance'
            ]
        }
    };

    return mockData[id] || null;
};

interface TicketPageProps {
    params: {
        id: string;
    };
}

export default async function TicketPage({ params }: TicketPageProps) {
    const ticket = await getTicketDetails(params.id);

    if (!ticket) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-xl font-bold text-purple-600">
                            M/Tickets
                        </Link>
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Shows
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div>
                        <div className="relative h-96 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg overflow-hidden">
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
                                        <div className="text-3xl font-bold mb-2">M/Tickets</div>
                                        <div className="text-lg opacity-90">{ticket.title}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
                            <p className="text-lg text-gray-600 italic mt-2">{ticket.subtitle}</p>
                        </div>

                        {/* Show Info */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Show Information</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-semibold">{ticket.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time:</span>
                                    <span className="font-semibold">{ticket.time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-semibold">{ticket.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="font-semibold">{ticket.category}</span>
                                </div>
                            </div>
                        </div>

                        {/* Venue Info */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Venue</h3>
                            <p className="font-semibold text-lg">{ticket.venue}</p>
                            <p className="text-gray-600 mt-2">{ticket.venueAddress}</p>
                        </div>

                        {/* Cast */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Cast</h3>
                            <div className="space-y-2">
                                {ticket.castDetails.map((member, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span className="text-gray-700">{member.name}</span>
                                        <span className="text-gray-600">{member.role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price and Booking */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-2xl font-bold text-purple-700">{ticket.price}</span>
                                <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                                    Book Now
                                </button>
                            </div>
                            <p className="text-sm text-gray-600">*Prices may vary based on seating</p>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">About the Show</h3>
                    <p className="text-gray-700 leading-relaxed">{ticket.fullDescription}</p>
                </div>

                {/* Terms and Conditions */}
                <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        {ticket.termsConditions.map((term, index) => (
                            <li key={index} className="flex items-start">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {term}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
