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

export interface AddUserFormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'organizer';
}

export interface AddUserValidationErrors {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}
export interface CreateEventFormData {
    title: string;
    venueName: string;
    description: string;
    locationCity: string;
    locationAddress: string;
    startTime: string;
    endTime: string;
    categoryIds: string[];
    imageFile: File | null;
}

export interface ValidationErrors {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}



export interface EventValidationErrors {
    title?: string;
    venueName?: string;
    description?: string;
    locationCity?: string;
    locationAddress?: string;
    startTime?: string;
    endTime?: string;
    categoryIds?: string;
    imageFile?: string;
}





export const validateRole = (role: string): string | undefined => {
    if (!role) {
        return 'Role is required';
    }

    if (!['admin', 'organizer'].includes(role)) {
        return 'Please select a valid role';
    }

    return undefined;
};

export const validateAddUserForm = (data: AddUserFormData): AddUserValidationErrors => {
    const errors: AddUserValidationErrors = {};

    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    const firstNameError = validateName(data.firstName, 'First name');
    if (firstNameError) errors.firstName = firstNameError;

    const lastNameError = validateName(data.lastName, 'Last name');
    if (lastNameError) errors.lastName = lastNameError;

    const roleError = validateRole(data.role);
    if (roleError) errors.role = roleError;

    return errors;
};

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

export const validateEventTitle = (title: string): string | undefined => {
    if (!title) {
        return 'Event title is required';
    }

    if (title.length < 3) {
        return 'Event title must be at least 3 characters long';
    }

    if (title.length > 100) {
        return 'Event title cannot exceed 100 characters';
    }

    return undefined;
};

export const validateVenueName = (venueName: string): string | undefined => {
    if (!venueName) {
        return 'Venue name is required';
    }

    if (venueName.length < 2) {
        return 'Venue name must be at least 2 characters long';
    }

    return undefined;
};

export const validateDescription = (description: string): string | undefined => {
    if (!description) {
        return 'Description is required';
    }

    if (description.length < 10) {
        return 'Description must be at least 10 characters long';
    }

    if (description.length > 1000) {
        return 'Description cannot exceed 1000 characters';
    }

    return undefined;
};

export const validateLocationCity = (city: string): string | undefined => {
    if (!city) {
        return 'City is required';
    }

    if (city.length < 2) {
        return 'City must be at least 2 characters long';
    }

    return undefined;
};

export const validateLocationAddress = (address: string): string | undefined => {
    if (!address) {
        return 'Address is required';
    }

    if (address.length < 5) {
        return 'Address must be at least 5 characters long';
    }

    return undefined;
};

export const validateDateTime = (dateTime: string, fieldName: string): string | undefined => {
    if (!dateTime) {
        return `${fieldName} is required`;
    }

    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
        return `Please enter a valid ${fieldName.toLowerCase()}`;
    }

    if (date < new Date()) {
        return `${fieldName} cannot be in the past`;
    }

    return undefined;
};

export const validateCategoryIds = (categoryIds: string[]): string | undefined => {
    if (!categoryIds || categoryIds.length === 0) {
        return 'At least one category must be selected';
    }

    return undefined;
};

export const validateImageFile = (file: File | null): string | undefined => {
    if (!file) {
        return 'Event image is required';
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return 'Please upload a valid image file (JPEG, PNG, GIF, WEBP)';
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return 'Image size cannot exceed 5MB';
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

export const validateCreateEventForm = (data: CreateEventFormData): EventValidationErrors => {
    const errors: EventValidationErrors = {};

    const titleError = validateEventTitle(data.title);
    if (titleError) errors.title = titleError;

    const venueNameError = validateVenueName(data.venueName);
    if (venueNameError) errors.venueName = venueNameError;

    const descriptionError = validateDescription(data.description);
    if (descriptionError) errors.description = descriptionError;

    const cityError = validateLocationCity(data.locationCity);
    if (cityError) errors.locationCity = cityError;

    const addressError = validateLocationAddress(data.locationAddress);
    if (addressError) errors.locationAddress = addressError;

    const startTimeError = validateDateTime(data.startTime, 'Start time');
    if (startTimeError) errors.startTime = startTimeError;

    const endTimeError = validateDateTime(data.endTime, 'End time');
    if (endTimeError) errors.endTime = endTimeError;

    const categoryError = validateCategoryIds(data.categoryIds);
    if (categoryError) errors.categoryIds = categoryError;

    const imageError = validateImageFile(data.imageFile);
    if (imageError) errors.imageFile = imageError;

    // Additional validation: end time must be after start time
    if (data.startTime && data.endTime) {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        if (end <= start) {
            errors.endTime = 'End time must be after start time';
        }
    }

    return errors;
};
