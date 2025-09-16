'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiCalendar,
    FiDollarSign,
    FiPieChart,
    FiPlus,
    FiLogOut,
    FiMenu,
    FiX
} from 'react-icons/fi';

interface OrganizerLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function OrganizerLayout({ children, activeTab, onTabChange }: OrganizerLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        router.push('/management-login');
    };

    const menuItems = [
        { id: 'create', label: 'Create Event', icon: FiPlus },
        { id: 'sales', label: 'Sales', icon: FiPieChart },
        { id: 'revenue', label: 'Revenue', icon: FiDollarSign },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 bg-blue-600 text-white rounded-lg"
                >
                    {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Organizer Dashboard</h1>
                    <p className="text-sm text-gray-600">Manage your events and sales</p>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onTabChange(item.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                  ${activeTab === item.id
                                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                }
                `}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                        <FiLogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Content */}
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
