'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface User {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [userType, setUserType] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const storedUserType = localStorage.getItem('userType');

        if (userData) {
            setUser(JSON.parse(userData));
        }
        setUserType(storedUserType);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        setUser(null);
        setUserType(null);
        setIsMenuOpen(false);
        router.push('/');
    };

    const isActiveRoute = (route: string) => {
        return pathname === route;
    };

    const isManagementRoute = pathname.includes('dashboard');
    const isLoginPage = pathname === '/login' || pathname === '/management-login';
    const isRegisterPage = pathname === '/register';

    if (isLoginPage || isRegisterPage) {
        return null; // Don't show header on auth pages
    }

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <div className="bg-blue-600 text-white rounded-lg p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">ETicket</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            <Link
                                href="/"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    isActiveRoute('/')
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Home
                            </Link>

                            {user && isManagementRoute && (
                                <Link
                                    href={userType === 'admin' ? '/manager-dashboard' : '/organizer-dashboard'}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActiveRoute(userType === 'admin' ? '/manager-dashboard' : '/organizer-dashboard')
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                            )}

                            {!user && (
                                <Link
                                    href="/events"
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                >
                                    Events
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right side - Auth buttons or user menu */}
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {/* User greeting - hidden on mobile */}
                                <div className="hidden md:block">
                                    <span className="text-sm text-gray-700">
                                        Welcome, <span className="font-medium">{user.firstName}</span>
                                    </span>
                                </div>

                                {/* User avatar and dropdown */}
                                <div className="relative ml-3">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                            </span>
                                        </div>
                                    </button>

                                    {isMenuOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                            <div className="py-1">
                                                <div className="px-4 py-2 border-b border-gray-100">
                                                    <p className="text-sm text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                    <p className="text-xs text-blue-600 font-medium capitalize">{userType}</p>
                                                </div>

                                                <Link
                                                    href={userType === 'admin' ? '/manager-dashboard' : '/organizer-dashboard'}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Dashboard
                                                </Link>

                                                <Link
                                                    href="/profile"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Profile Settings
                                                </Link>

                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="hidden md:block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign in
                                </Link>

                            </div>
                        )}

                        {/* Mobile menu button */}
                        <div className="md:hidden ml-4">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                        <Link
                            href="/"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActiveRoute('/')
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>




                        {!user ? (
                            <>
                                <Link
                                    href="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/management-login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Management Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="px-3 py-2 border-t border-gray-200">
                                    <p className="text-sm text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    <p className="text-xs text-blue-600 font-medium capitalize">{userType}</p>
                                </div>
                                <Link
                                    href="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Sign out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
