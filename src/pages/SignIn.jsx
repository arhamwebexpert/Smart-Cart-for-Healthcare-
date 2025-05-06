import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignIn = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
        if (serverError) {
            setServerError('');
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);

            try {
                // In a real application, you would connect this to your backend API
                // Since there's no authentication endpoints in the provided API,
                // we'll keep the mock registration for demonstration purposes

                // For a real implementation, you would do something like:
                // const response = await fetch('/api/auth/register', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify({
                //     name: formData.name,
                //     email: formData.email,
                //     password: formData.password
                //   })
                // });
                // if (!response.ok) throw new Error('Registration failed');
                // const data = await response.json();
                // onLogin(data.user, data.token);

                // Mock implementation for demonstration:
                setTimeout(() => {
                    const userData = {
                        id: '123456',
                        name: formData.name,
                        email: formData.email,
                    };
                    const mockToken = 'mock-jwt-token';
                    onLogin(userData, mockToken);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                setServerError('Failed to sign up. Please try again.');
                setIsLoading(false);
            }
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-800 to-black px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Sign In</h1>

                {errors.general && (
                    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {['email', 'password'].map((field) => (
                        <div className="mb-5" key={field}>
                            <label htmlFor={field} className="block mb-2 text-gray-700 font-semibold capitalize">
                                {field}
                            </label>
                            <input
                                id={field}
                                name={field}
                                type={field === 'password' ? 'password' : 'email'}
                                placeholder={field === 'email' ? 'your@email.com' : ''}
                                value={formData[field]}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                            />
                            {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                        </div>
                    ))}

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <input id="remember" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <Link to="/reset-password" className="text-sm text-indigo-500 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
