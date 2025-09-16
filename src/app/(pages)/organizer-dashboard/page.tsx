"use client";
import React, { useState } from "react";
import { FaPlusCircle, FaChartLine, FaMoneyBillWave } from "react-icons/fa";
import CreateEvent from "@/Components/organizer/CreateEvent";
import Revenue from "@/Components/organizer/Revenue";
import Sales from "@/Components/organizer/Sales";
import ManageEvents from "@/Components/organizer/ManageEvents";
import {BiSolidCategory} from "react-icons/bi";
import ManageTicketTypes from "@/Components/organizer/ManageTicketTypes";

const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = useState("create");

    const renderContent = () => {
        switch (activeTab) {
            case "create":
                return <ManageEvents /> ;
            case "revenue":
                return <Revenue />;
            case "sales":
                return <Sales />;
            case "Ticket-Types":
                return <ManageTicketTypes />;
            default:
                return <CreateEvent />;
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-6">Organizer Panel</h2>

                <button
                    onClick={() => setActiveTab("create")}
                    className={`flex items-center gap-2 p-3 rounded-lg mb-2 hover:bg-gray-100 transition ${
                        activeTab === "create" ? "bg-gray-200 font-semibold" : ""
                    }`}
                >
                    <FaPlusCircle /> Create Event
                </button>

                <button
                    onClick={() => setActiveTab("revenue")}
                    className={`flex items-center gap-2 p-3 rounded-lg mb-2 hover:bg-gray-100 transition ${
                        activeTab === "revenue" ? "bg-gray-200 font-semibold" : ""
                    }`}
                >
                    <FaMoneyBillWave /> Revenue
                </button>

                <button
                    onClick={() => setActiveTab("sales")}
                    className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition ${
                        activeTab === "sales" ? "bg-gray-200 font-semibold" : ""
                    }`}
                >
                    <FaChartLine /> Sales
                </button>

                <button
                    onClick={() => setActiveTab("Ticket-Types")}
                    className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition ${
                        activeTab === "Ticket-Types" ? "bg-gray-200 font-semibold" : ""
                    }`}
                >
                    <BiSolidCategory /> Ticket-Types
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">{renderContent()}</div>
        </div>
    );
};

export default OrganizerDashboard;
