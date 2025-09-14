'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/libs/network';
import { CreateEventFormData, EventValidationErrors, validateCreateEventForm } from '@/libs/validations/validation';

// Mock categories - replace with API data
const MOCK_CATEGORIES = [
    { id: '1', name: 'Concert' },
    { id: '2', name: 'Theater' },
    { id: '3', name: 'Sports' },
    { id: '4', name: 'Conference' },
    { id: '5', name: 'Workshop' },
    { id: '6', name: 'Exhibition' },
];

export default function CreateEvent() {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateEventFormData>({
        title: '',
        venueName: '',
        description: '',
        locationCity: '',
        locationAddress: '',
        startTime: '',
        endTime: '',
        categoryIds: [],
        imageFile: null,
    });
    const [errors, setErrors] = useState<EventValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const getAuthToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name as keyof EventValidationErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        setFormData(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId]
        }));

        if (errors.categoryIds) {
            setErrors(prev => ({
                ...prev,
                categoryIds: undefined,
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            imageFile: file,
        }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }

        if (errors.imageFile) {
            setErrors(prev => ({
                ...prev,
                imageFile: undefined,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        const validationErrors = validateCreateEventForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Get the authentication token
            const authToken = getAuthToken();

            if (!authToken) {
                throw new Error('Authentication required. Please log in again.');
            }

            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('Title', formData.title);
            formDataToSend.append('VenueName', formData.venueName);
            formDataToSend.append('Description', formData.description);
            formDataToSend.append('LocationCity', formData.locationCity);
            formDataToSend.append('LocationAddress', formData.locationAddress);
            formDataToSend.append('StartTime', formData.startTime);
            formDataToSend.append('EndTime', formData.endTime);

            // Append each category ID separately
            formData.categoryIds.forEach(id => {
                formDataToSend.append('CategoryIds', id);
            });

            if (formData.imageFile) {
                formDataToSend.append('ImageFile', formData.imageFile);
            }

            // Send to backend using FormData with authentication
            await apiClient.post('/organizer/events', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            // Redirect to events page or show success message
            router.push('/events?created=true');
        } catch (error: any) {
            console.error('Create event error:', error);

            if (error.status === 401) {
                setServerError('Authentication failed. Please log in again.');
                // Optional: Redirect to login page
                // router.push('/management-login');
            } else {
                setServerError(
                    error.data?.message ||
                    error.message ||
                    'Failed to create event. Please try again.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Check if user is authenticated on component mount
    const isAuthenticated = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            const userType = localStorage.getItem('userType');

            // Check if token exists and user is organizer (since this is organizer endpoint)
            return token && userType === 'organizer';
        }
        return false;
    };

    // If not authenticated, show message or redirect
    if (typeof window !== 'undefined' && !isAuthenticated()) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You need to be logged in as an organizer to create events.</p>
                    <button
                        onClick={() => router.push('/management-login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Create New Event</h1>

                {serverError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Event Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.title ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Enter event title"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    {/* Venue Name */}
                    <div>
                        <label htmlFor="venueName" className="block text-sm font-medium text-gray-700">
                            Venue Name *
                        </label>
                        <input
                            type="text"
                            id="venueName"
                            name="venueName"
                            value={formData.venueName}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.venueName ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Enter venue name"
                        />
                        {errors.venueName && (
                            <p className="mt-1 text-sm text-red-600">{errors.venueName}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.description ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Describe your event..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    {/* Location - City and Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="locationCity" className="block text-sm font-medium text-gray-700">
                                City *
                            </label>
                            <input
                                type="text"
                                id="locationCity"
                                name="locationCity"
                                value={formData.locationCity}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    errors.locationCity ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                placeholder="Enter city"
                            />
                            {errors.locationCity && (
                                <p className="mt-1 text-sm text-red-600">{errors.locationCity}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="locationAddress" className="block text-sm font-medium text-gray-700">
                                Address *
                            </label>
                            <input
                                type="text"
                                id="locationAddress"
                                name="locationAddress"
                                value={formData.locationAddress}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    errors.locationAddress ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                placeholder="Enter full address"
                            />
                            {errors.locationAddress && (
                                <p className="mt-1 text-sm text-red-600">{errors.locationAddress}</p>
                            )}
                        </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                                Start Time *
                            </label>
                            <input
                                type="datetime-local"
                                id="startTime"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    errors.startTime ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {errors.startTime && (
                                <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                                End Time *
                            </label>
                            <input
                                type="datetime-local"
                                id="endTime"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    errors.endTime ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {errors.endTime && (
                                <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                            )}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categories *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {MOCK_CATEGORIES.map(category => (
                                <label key={category.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.categoryIds.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.categoryIds && (
                            <p className="mt-1 text-sm text-red-600">{errors.categoryIds}</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Image *
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg border-2 border-dashed border-blue-600 cursor-pointer hover:bg-blue-50">
                                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium">Choose Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            {imagePreview && (
                                <div className="relative w-20 h-20">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                        {errors.imageFile && (
                            <p className="mt-1 text-sm text-red-600">{errors.imageFile}</p>
                        )}
                        <p className="mt-2 text-sm text-gray-500">JPEG, PNG, GIF, WEBP. Max 5MB.</p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Creating Event...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
