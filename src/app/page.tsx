'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

// Type definitions
interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  imageUrl: string;
  price: number;
}

interface Category {
  name: string;
  icon: string;
}

interface FilterState {
  category: string | null;
  date: string | null;
  location: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    category: null,
    date: null,
    location: null,
    minPrice: null,
    maxPrice: null,
  });

  // Mock categories
  const categories: Category[] = [
    { name: 'Concerts', icon: '🎵' },
    { name: 'Theater', icon: '🎭' },
    { name: 'Cultural', icon: '🎎' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Comedy', icon: '😂' },
  ];

  // Unique locations from events
  const locations = Array.from(new Set(events.map(event => event.location)));

  // Fetch events (mock data for demonstration)
  useEffect(() => {
    // In a real application, this would be an API call
    const mockEvents: Event[] = [
      {
        id: 1,
        title: 'International Music Festival',
        date: '2023-12-15',
        location: 'Colombo',
        category: 'Concerts',
        imageUrl: '/images/concert.jpg',
        price: 2500,
      },
      {
        id: 2,
        title: 'Traditional Dance Show',
        date: '2023-11-20',
        location: 'Kandy',
        category: 'Cultural',
        imageUrl: '/images/dance.jpg',
        price: 1500,
      },
      {
        id: 3,
        title: 'Comedy Night Live',
        date: '2023-12-05',
        location: 'Colombo',
        category: 'Comedy',
        imageUrl: '/images/comedy.jpg',
        price: 1200,
      },
      {
        id: 4,
        title: 'Shakespeare in the Park',
        date: '2023-11-25',
        location: 'Galle',
        category: 'Theater',
        imageUrl: '/images/theater.jpg',
        price: 1800,
      },
      {
        id: 5,
        title: 'Jazz Festival',
        date: '2023-12-10',
        location: 'Negombo',
        category: 'Concerts',
        imageUrl: '/images/jazz.jpg',
        price: 2200,
      },
      {
        id: 6,
        title: 'Cricket Tournament Finals',
        date: '2023-11-30',
        location: 'Colombo',
        category: 'Sports',
        imageUrl: '/images/cricket.jpg',
        price: 3000,
      },
    ];

    setEvents(mockEvents);
    setFeaturedEvents(mockEvents.slice(0, 2));
  }, []);

  // Filter events based on search term and filters
  const filteredEvents = events.filter((event) => {
    // Search term filter
    const matchesSearch = searchTerm === '' ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = !filterState.category || event.category === filterState.category;

    // Date filter
    const matchesDate = !filterState.date || event.date === filterState.date;

    // Location filter
    const matchesLocation = !filterState.location || event.location === filterState.location;

    // Price filter
    const matchesMinPrice = !filterState.minPrice || event.price >= filterState.minPrice;
    const matchesMaxPrice = !filterState.maxPrice || event.price <= filterState.maxPrice;

    return matchesSearch && matchesCategory && matchesDate && matchesLocation && matchesMinPrice && matchesMaxPrice;
  });

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: string | number | null) => {
    setFilterState(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterState({
      category: null,
      date: null,
      location: null,
      minPrice: null,
      maxPrice: null,
    });
    setSearchTerm('');
  };

  // Check if any filters are active
  const areFiltersActive = Object.values(filterState).some(value => value !== null) || searchTerm !== '';

  return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>StarEvents - Online Event Ticketing Platform</title>
          <meta name="description" content="Book tickets for concerts, theater shows, and cultural events in Sri Lanka" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Navigation */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">SE</span>
              </div>
              <span className="text-xl font-bold text-purple-600">StarEvents</span>
            </Link>

            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
              <Link href="/events" className="text-gray-700 hover:text-purple-600 font-medium">Events</Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 font-medium">About</Link>
              <Link href="/contact" className="text-gray-700 hover:text-purple-600 font-medium">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                  <>
                    <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 font-medium">Dashboard</Link>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
                      Logout
                    </button>
                  </>
              ) : (
                  <>
                    <Link href="/login" className="text-gray-700 hover:text-purple-600 font-medium">Login</Link>
                    <Link href="/register" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
                      Register
                    </Link>
                  </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Amazing Events in Sri Lanka</h1>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Book tickets for concerts, theater shows, cultural events and more with our secure online platform
            </p>

            <div className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-2 flex">
              <input
                  type="text"
                  placeholder="Search events, locations, or categories..."
                  className="flex-grow px-4 py-3 text-gray-800 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                  className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
                  onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </button>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        {showFilters && (
            <section className="bg-white py-6 shadow-md">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Filter Events</h2>
                  {areFiltersActive && (
                      <button
                          onClick={clearFilters}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Clear all filters
                      </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        value={filterState.category || ''}
                        onChange={(e) => handleFilterChange('category', e.target.value || null)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                          <option key={category.name} value={category.name}>
                            {category.icon} {category.name}
                          </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        value={filterState.date || ''}
                        onChange={(e) => handleFilterChange('date', e.target.value || null)}
                    />
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        value={filterState.location || ''}
                        onChange={(e) => handleFilterChange('location', e.target.value || null)}
                    >
                      <option value="">All Locations</option>
                      {locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                      ))}
                    </select>
                  </div>

                  {/* Min Price Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (LKR)</label>
                    <input
                        type="number"
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        value={filterState.minPrice || ''}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="0"
                    />
                  </div>

                  {/* Max Price Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (LKR)</label>
                    <input
                        type="number"
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        value={filterState.maxPrice || ''}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="No limit"
                    />
                  </div>
                </div>
              </div>
            </section>
        )}

        {/* Categories Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                  <div
                      key={category.name}
                      className={`flex flex-col items-center p-6 rounded-lg cursor-pointer transition-all ${
                          filterState.category === category.name
                              ? 'bg-purple-100 border-2 border-purple-600'
                              : 'bg-gray-100 hover:bg-purple-50'
                      }`}
                      onClick={() => handleFilterChange('category',
                          filterState.category === category.name ? null : category.name
                      )}
                  >
                    <span className="text-4xl mb-4">{category.icon}</span>
                    <h3 className="text-lg font-medium">{category.name}</h3>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Events</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="relative h-48 w-full">
                      <div className="absolute inset-0 bg-purple-200 flex items-center justify-center">
                        <span className="text-6xl">🎭</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>📍 {event.location}</span>
                        <span className="mx-2">•</span>
                        <span>🎪 {event.category}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-600 font-bold">LKR {event.price.toFixed(2)}</span>
                        <Link
                            href={`/events/${event.id}`}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Events */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Upcoming Events</h2>
              <div className="flex items-center space-x-2">
                {areFiltersActive && (
                    <span className="text-sm text-gray-600">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                </span>
                )}
                <Link
                    href="/events"
                    className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All Events →
                </Link>
              </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-xl">No events found. Try changing your filters.</p>
                  {areFiltersActive && (
                      <button
                          onClick={clearFilters}
                          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                      >
                        Clear All Filters
                      </button>
                  )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                      <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                        <div className="relative h-40 w-full">
                          <div className="absolute inset-0 bg-purple-200 flex items-center justify-center">
                            <span className="text-4xl">🎭</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                          <div className="flex items-center text-gray-600 text-sm mb-3">
                            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>📍 {event.location}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-600 font-bold">LKR {event.price.toFixed(2)}</span>
                            <Link
                                href={`/events/${event.id}`}
                                className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition"
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose StarEvents?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎫</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Easy Booking</h3>
                <p className="text-gray-600">Quick and hassle-free ticket booking process with secure payment options.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-bold mb-3">QR E-Tickets</h3>
                <p className="text-gray-600">Receive QR-coded e-tickets instantly for easy entry validation at events.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Rewards Program</h3>
                <p className="text-gray-600">Earn loyalty points with every purchase and enjoy exclusive discounts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">StarEvents</h3>
                <p className="text-gray-400">Sri Lanka's premier event ticketing platform for concerts, theater shows, and cultural events.</p>
              </div>

              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                  <li><Link href="/events" className="text-gray-400 hover:text-white">Events</Link></li>
                  <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                  <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/refund" className="text-gray-400 hover:text-white">Refund Policy</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Contact Us</h4>
                <address className="text-gray-400 not-italic">
                  <p>123 Event Avenue, Colombo</p>
                  <p>Sri Lanka</p>
                  <p>Email: info@starevents.lk</p>
                  <p>Phone: +94 11 234 5678</p>
                </address>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} StarEvents Pvt Ltd. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default HomePage;
