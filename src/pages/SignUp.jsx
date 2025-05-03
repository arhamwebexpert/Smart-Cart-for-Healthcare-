import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
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
            setTimeout(() => {
                const mockToken = 'mock-jwt-token';
                onLogin(mockToken);
                setIsLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-800 to-black px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Account</h1>

                {errors.general && (
                    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {['name', 'email', 'password', 'confirmPassword'].map((field) => (
                        <div className="mb-5" key={field}>
                            <label htmlFor={field} className="block mb-2 text-gray-700 font-semibold capitalize">
                                {field === 'confirmPassword' ? 'Confirm Password' : field}
                            </label>
                            <input
                                id={field}
                                name={field}
                                type={field.includes('password') ? 'password' : 'text'}
                                placeholder={field === 'email' ? 'your@email.com' : ''}
                                value={formData[field]}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
                            />
                            {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-indigo-500 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
