'use client';

import { useState } from 'react';
import CreateEvent from "@/components/organizer/CreateEvent";
import TicketSection from "@/components/organizer/TicketSection";


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

export default function ManageEvents() {
    const [editingEvent, setEditingEvent] = useState<Ticket | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleEditEvent = (event: Ticket) => {
        setEditingEvent(event);
    };

    const handleEditComplete = () => {
        setEditingEvent(null);
        // Refresh the ticket list by updating the key
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div>
            <CreateEvent
                editEvent={editingEvent}
                onEditComplete={handleEditComplete}
            />
            <TicketSection
                key={refreshKey}
                onEditEvent={handleEditEvent}
            />
        </div>
    );
}
