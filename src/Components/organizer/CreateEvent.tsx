'use client';

import { useState, useEffect } from 'react';
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

interface CreateEventProps {
    editEvent?: Ticket | null;
    onEditComplete?: () => void;
}

export interface Ticket {
    id: number;
    title: string;
    venueName: string;
    description: string;
    locationCity: string;
    locationAddress?: string;
    startTime: string;
    endTime: string;
    imageUrl?: string | null;
    status: number;
    categories: string[];
    categoryIds?: string[];
}

export default function CreateEvent({ editEvent, onEditComplete }: CreateEventProps) {
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
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

    // Initialize form when editEvent changes
    useEffect(() => {
        if (editEvent) {
            setIsEditMode(true);

            // Convert date strings to datetime-local format (YYYY-MM-DDTHH:MM)
            const formatDateTimeLocal = (dateString: string) => {
                const date = new Date(dateString);
                return date.toISOString().slice(0, 16);
            };

            // Use categoryIds if available, otherwise use categories array
            const categoryIds = editEvent.categoryIds || editEvent.categories || [];

            setFormData({
                title: editEvent.title || '',
                venueName: editEvent.venueName || '',
                description: editEvent.description || '',
                locationCity: editEvent.locationCity || '',
                locationAddress: editEvent.locationAddress || '',
                startTime: editEvent.startTime ? formatDateTimeLocal(editEvent.startTime) : '',
                endTime: editEvent.endTime ? formatDateTimeLocal(editEvent.endTime) : '',
                categoryIds: categoryIds,
                imageFile: null,
            });

            // Set image preview with proper URL handling
            if (editEvent.imageUrl) {
                const fullImageUrl = getFullImageUrl(editEvent.imageUrl, editEvent.id);
                setCurrentImageUrl(fullImageUrl);
                setImagePreview(fullImageUrl);
            } else {
                setCurrentImageUrl(null);
                setImagePreview(null);
            }
        } else {
            setIsEditMode(false);
            setFormData({
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
            setCurrentImageUrl(null);
            setImagePreview(null);
        }
    }, [editEvent]);

    const getAuthToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    };

    const getFullImageUrl = (imageUrl: string | null, eventId: number): string | null => {
        if (!imageUrl) return null;

        // If it's already a full URL, return it
        if (imageUrl.startsWith('http')) return imageUrl;

        // If it's a relative path starting with /api, construct the full URL
        if (imageUrl.startsWith('/api/')) {
            return `https://localhost:7283${imageUrl}`;
        }

        // If it's just a path without /api, construct the proper API URL
        if (imageUrl.startsWith('/')) {
            return `https://localhost:7283/api${imageUrl}`;
        }

        // Default case - construct from event ID
        return `https://localhost:7283/api/events/${eventId}/image`;
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
            // If no file selected, revert to current image
            setImagePreview(currentImageUrl);
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
            const authToken = getAuthToken();
            if (!authToken) {
                throw new Error('Authentication required. Please log in again.');
            }

            const formDataToSend = new FormData();
            formDataToSend.append('Title', formData.title);
            formDataToSend.append('VenueName', formData.venueName);
            formDataToSend.append('Description', formData.description);
            formDataToSend.append('LocationCity', formData.locationCity);
            formDataToSend.append('LocationAddress', formData.locationAddress || '');
            formDataToSend.append('StartTime', new Date(formData.startTime).toISOString());
            formDataToSend.append('EndTime', new Date(formData.endTime).toISOString());

            // Append each category ID
            formData.categoryIds.forEach(id => {
                formDataToSend.append('CategoryIds', id);
            });

            if (formData.imageFile) {
                formDataToSend.append('ImageFile', formData.imageFile);
            }

            if (isEditMode && editEvent) {
                // Update existing event
                await apiClient.put(`/organizer/events/${editEvent.id}`, formDataToSend, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (onEditComplete) {
                    onEditComplete();
                }
                alert('Event updated successfully!');
            } else {
                // Create new event
                await apiClient.post('/organizer/events', formDataToSend, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                alert('Event created successfully!');
                router.push('/organizer/events');
            }

            // Reset form after successful submission if not in edit mode
            if (!isEditMode) {
                setFormData({
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
                setImagePreview(null);
                setCurrentImageUrl(null);
            }

        } catch (error: any) {
            console.error('Create/Update event error:', error);
            if (error.status === 401) {
                setServerError('Authentication failed. Please log in again.');
            } else {
                setServerError(
                    error.data?.message ||
                    error.message ||
                    `Failed to ${isEditMode ? 'update' : 'create'} event. Please try again.`
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        if (onEditComplete) {
            onEditComplete();
        }
        setIsEditMode(false);
        setFormData({
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
        setImagePreview(null);
        setCurrentImageUrl(null);
    };

    const isAuthenticated = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            const userType = localStorage.getItem('userType');
            return token && userType === 'organizer';
        }
        return false;
    };

    if (typeof window !== 'undefined' && !isAuthenticated()) {
        return (
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You need to be logged in as an organizer to manage events.</p>
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
        <div className="max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    {isEditMode ? 'Edit Event' : 'Create New Event'}
                </h1>

                {serverError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                                Start Date & Time *
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
                                End Date & Time *
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Image {!isEditMode && '*'}
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
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        {errors.imageFile && (
                            <p className="mt-1 text-sm text-red-600">{errors.imageFile}</p>
                        )}
                        <p className="mt-2 text-sm text-gray-500">JPEG, PNG, GIF, WEBP. Max 5MB.</p>
                        {isEditMode && currentImageUrl && (
                            <p className="mt-1 text-sm text-gray-500">
                                Current image will be kept if no new image is selected.
                            </p>
                        )}
                    </div>

                    <div className="pt-6 flex space-x-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading
                                ? (isEditMode ? 'Updating Event...' : 'Creating Event...')
                                : (isEditMode ? 'Update Event' : 'Create Event')
                            }
                        </button>

                        {isEditMode && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isLoading}
                                className="px-6 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
