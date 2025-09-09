'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/libs/network';
import { LoginFormData, validateLoginForm, ValidationErrors } from '@/libs/validations/validation';
import Link from 'next/link';

interface ManagementLoginFormData extends LoginFormData {
    userType: 'admin' | 'organizer';
}

const authService = {
    managementLogin: async (userData: ManagementLoginFormData) => {
        // Send user type as part of the login request
        const loginData = {
            email: userData.email,
            password: userData.password,
            userType: userData.userType
        };

        return await apiClient.post('/auth/login', loginData);
    },
};

export default function ManagementLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<ManagementLoginFormData>({
        email: '',
        password: '',
        userType: 'admin'
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name as keyof ValidationErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }

        if (serverError) {
            setServerError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        // Validate form (only email and password)
        const validationErrors = validateLoginForm({
            email: formData.email,
            password: formData.password
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.managementLogin(formData);

            if (response.token) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('userType', formData.userType);

                // Redirect based on user type
                if (formData.userType === 'admin') {
                    router.push('/manager-dashboard');
                } else {
                    router.push('/organizer-dashboard');
                }
            }
        } catch (error: any) {
            setServerError(
                error.data?.message ||
                error.message ||
                'Login failed. Please check your credentials and try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        Management Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Access your management dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {serverError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {serverError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                                Login As
                            </label>
                            <select
                                id="userType"
                                name="userType"
                                value={formData.userType}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="admin">Administrator</option>
                                <option value="organizer">Event Organizer</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                                    errors.password ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            {isLoading ? 'Signing in...' : `Sign in as ${formData.userType === 'admin' ? 'Administrator' : 'Organizer'}`}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Are you a customer?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Customer Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
