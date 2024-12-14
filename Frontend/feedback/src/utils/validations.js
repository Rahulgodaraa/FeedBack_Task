// Email validation
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  // Password strength validation
  export const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
    );
    return strongRegex.test(password);
  };
  
  // Form validation helper
  export const validateForm = (formData) => {
    const errors = {};
  
    // Check for empty fields
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        errors[key] = `${key} is required`;
      }
    });
  
    // Specific validations
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }
  
    if (formData.password && !validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters, include uppercase, lowercase, and number';
    }
  
    if (formData.password !== formData.confirmpassword) {
      errors.confirmpassword = 'Passwords do not match';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  // Sanitize input
  export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };