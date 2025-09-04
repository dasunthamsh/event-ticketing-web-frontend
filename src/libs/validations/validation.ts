export interface RegisterFormData {
    email: string;
    password: string;
    number: string;
}

export interface ValidationErrors {
    email?: string;
    password?: string;
    number?: string;
}

export const validateEmail = (email: string): string | undefined => {
    if (!email) {
        return 'Email is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }

    return undefined;
};

export const validatePassword = (password: string): string | undefined => {
    if (!password) {
        return 'Password is required';
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    return undefined;
};

export const validatePhoneNumber = (number: string): string | undefined => {
    if (!number) {
        return 'Phone number is required';
    }

    // Basic phone number validation - adjust based on your requirements
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(number.replace(/[\s\-\(\)]/g, ''))) {
        return 'Please enter a valid phone number';
    }

    return undefined;
};

export const validateRegisterForm = (data: RegisterFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    const numberError = validatePhoneNumber(data.number);
    if (numberError) errors.number = numberError;

    return errors;
};
