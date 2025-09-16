import React from 'react';
import Hero from "@/Components/common/Hero";
import TicketSection from "@/Components/organizer/TicketSection";
import PublicEventSection from "@/Components/ticket/PublicEventsSection";

const Main = () => {
    return (
       <>
            <Hero/>
            <PublicEventSection/>
       </>
    );
};

export default Main;
