export interface RegisterFormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface ValidationErrors {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
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

export const validateName = (name: string, fieldName: string): string | undefined => {
    if (!name) {
        return `${fieldName} is required`;
    }

    if (name.length < 2) {
        return `${fieldName} must be at least 2 characters long`;
    }

    if (!/^[a-zA-Z]+$/.test(name)) {
        return `${fieldName} can only contain letters`;
    }

    return undefined;
};

export const validateRegisterForm = (data: RegisterFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    const firstNameError = validateName(data.firstName, 'First name');
    if (firstNameError) errors.firstName = firstNameError;

    const lastNameError = validateName(data.lastName, 'Last name');
    if (lastNameError) errors.lastName = lastNameError;

    return errors;
};

export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    if (!data.password) {
        errors.password = 'Password is required';
    }

    return errors;
};
