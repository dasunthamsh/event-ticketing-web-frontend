'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/libs/network';
import { AddUserFormData, AddUserValidationErrors, validateAddUserForm } from '@/libs/validations/validation';

export default function ManageManagement() {
    const router = useRouter();
    const [formData, setFormData] = useState<AddUserFormData>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'admin',
    });
    const [errors, setErrors] = useState<AddUserValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name as keyof AddUserValidationErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }

        if (serverError) {
            setServerError('');
        }
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');

        const validationErrors = validateAddUserForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Prepare data for backend
            const userData = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role,
            };

            // Send to backend
            await apiClient.post('/auth/register', userData);

            setSuccessMessage(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} added successfully!`);

            // Reset form
            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                role: 'admin',
            });

            // Optional: Redirect after success
            // router.push('/users');

        } catch (error: any) {
            setServerError(
                error.data?.message ||
                error.message ||
                'Failed to add user. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Add New User</h1>

                {serverError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {serverError}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role *
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.role ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        >
                            <option value="admin">Administrator</option>
                            <option value="organizer">Event Organizer</option>
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                        )}
                    </div>

                    {/* First Name */}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name *
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.firstName ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Enter first name"
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.lastName ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Enter last name"
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.email ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Enter email address"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.password ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Enter password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                        <p className="mt-2 text-sm text-gray-500">
                            Password must contain at least 6 characters, including uppercase, lowercase, and number.
                        </p>
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
                            {isLoading ? 'Adding User...' : `Add ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`}
                        </button>
                    </div>
                </form>

                {/* User Information */}
                <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Role Information:</h3>
                    <div className="text-xs text-gray-600 space-y-1">
                        <p><strong>Administrator:</strong> Full system access, can manage all events and users</p>
                        <p><strong>Event Organizer:</strong> Can create and manage their own events</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
