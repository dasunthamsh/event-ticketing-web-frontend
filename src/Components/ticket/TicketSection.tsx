'use client';

import { useState } from 'react';
import TicketCard from './TicketCard';


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

// Mock data - replace with API data
const mockTickets: Ticket[] = [
    {
        id: '1',
        title: 'Wingfield Family',
        subtitle: 'A Play by Pujitha De Mel',
        cast: ['Chandan Seneviratne', 'Ravindra Yasas', 'Manushie Taniya', 'Bimsara Silva'],
        date: 'Sep 14, 2025',
        time: '06.30 PM IST',
        venue: 'BMICH "Kamatha" Open Air',
        price: '1,000 LKR upwards',
        imageUrl: '/images/wingfield-family.jpg',
        description: 'A compelling drama about the Wingfield family dynamics and relationships.',
        duration: '2 hours 30 minutes',
        category: 'Drama'
    },
    {
        id: '2',
        title: 'Romeo and Juliet',
        subtitle: 'Shakespeare Classic',
        cast: ['John Doe', 'Jane Smith', 'Mike Johnson'],
        date: 'Oct 20, 2025',
        time: '07.00 PM IST',
        venue: 'Nelum Pokuna Theatre',
        price: '1,500 LKR upwards',
        description: 'The timeless tale of star-crossed lovers.',
        duration: '2 hours 45 minutes',
        category: 'Romance'
    },
    {
        id: '3',
        title: 'The Lion King',
        subtitle: 'Musical Spectacular',
        cast: ['David Brown', 'Sarah Wilson', 'Chris Evans'],
        date: 'Nov 15, 2025',
        time: '05.00 PM IST',
        venue: 'Sugathadasa Stadium',
        price: '2,000 LKR upwards',
        description: 'Experience the circle of life in this magnificent musical.',
        duration: '3 hours',
        category: 'Musical'
    }
];

export default function TicketSection() {
    const [tickets] = useState<Ticket[]>(mockTickets);

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tickets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            </div>
        </section>
    );
}
