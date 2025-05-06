// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useScannerStore from '../stores/scannerStore';

const ProductDetail = () => {
    const { barcode } = useParams(); // Change from id to barcode to match API
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/products/${barcode}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        navigate('/dashboard');
                        return;
                    }
                    throw new Error('Failed to fetch product');
                }

                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [barcode, navigate]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`/api/products/${barcode}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    navigate('/dashboard');
                } else {
                    throw new Error('Failed to delete product');
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-lg">Loading product information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Error: {error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="min-h-screen bg-blue-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 transition"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Product Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
                        <div className="flex items-center">
                            <div className="bg-white rounded-lg p-2 mr-4">
                                <img src={product.image || '/api/placeholder/120/120'} alt={product.name} className="w-24 h-24 object-cover" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{product.name || 'Unknown Product'}</h1>
                                <p className="opacity-80">{product.brand || 'Unknown Brand'}</p>
                                <div className="flex items-center mt-2">
                                    <span className="bg-white text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {product.barcode}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Nutrition Information</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between pb-2 border-b border-gray-200">
                                        <span className="text-gray-600">Calories</span>
                                        <span className="font-medium">{product.calories || 0}</span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-gray-200">
                                        <span className="text-gray-600">Protein</span>
                                        <span className="font-medium">{product.protein || '0g'}</span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-gray-200">
                                        <span className="text-gray-600">Carbohydrates</span>
                                        <span className="font-medium">{product.carbs || '0g'}</span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-gray-200">
                                        <span className="text-gray-600">Fats</span>
                                        <span className="font-medium">{product.fats || '0g'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between pb-2 border-b border-gray-200">
                                        <span className="text-gray-600">Quantity</span>
                                        <span className="font-medium">{product.quantity || 'Unknown'}</span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-gray-200">
                                        <span className="text-gray-600">Scanned On</span>
                                        <span className="font-medium">{product.timestamp || 'Unknown'}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Storage Instructions</h2>
                                    <p className="text-gray-600">Store in a cool, dry place. Refrigerate after opening.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;