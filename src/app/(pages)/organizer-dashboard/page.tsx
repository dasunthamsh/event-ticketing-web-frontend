import React from 'react';
import CreateEvent from "@/Components/organizer/CreateEvent";

const OrganizerDashboard = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8">
                <CreateEvent />
            </div>
        </>
    );
};

export default OrganizerDashboard;
