// src/pages/ResetPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({
                ...errors,
                email: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);

            try {
                // In a real app, this would be an API call
                // For this example, we'll simulate a successful password reset request
                setTimeout(() => {
                    setIsSubmitted(true);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                setErrors({ general: 'Failed to send reset link. Please try again.' });
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="card max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>

                {isSubmitted ? (
                    <div className="text-center">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            If an account exists with the email {email}, you will receive a password reset link shortly.
                        </div>
                        <Link to="/signin" className="text-primary hover:underline">
                            Return to sign in
                        </Link>
                    </div>
                ) : (
                    <>
                        {errors.general && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {errors.general}
                            </div>
                        )}

                        <p className="text-gray-600 mb-6">
                            Enter the email address associated with your account and we'll send you a link to reset your password.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={handleChange}
                                    className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link to="/signin" className="text-primary hover:underline">
                                Back to sign in
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;