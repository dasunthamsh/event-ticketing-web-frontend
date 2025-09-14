'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Safely get user data from localStorage
        if (typeof window !== 'undefined') {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, []);

    // Safe string manipulation function
    const getInitials = (name: string | undefined) => {
        if (!name) return 'U';

        // Add null check before calling charAt
        const names = name?.split(' ') || [];
        if (names.length === 0) return 'U';

        let initials = '';
        if (names[0]) initials += names[0].charAt(0);
        if (names[1]) initials += names[1].charAt(0);

        return initials.toUpperCase();
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        window.location.href = '/';
    };

    if (isLoading) {
        return (
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
                        <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold text-blue-600">
                        EventTicketing
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-4">
                        <Link href="/events" className="text-gray-700 hover:text-gray-900">
                            Events
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="relative group">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    </div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
