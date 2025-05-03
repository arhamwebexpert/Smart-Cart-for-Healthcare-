// src/pages/Analysis.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useScannerStore from '../stores/scannerStore';
import useFolderStore from '../stores/folderStore';

const Analysis = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const { scannedItems } = useScannerStore();
    const { folders } = useFolderStore();

    const [folder, setFolder] = useState(null);
    const [folderItems, setFolderItems] = useState([]);
    const [nutritionTotals, setNutritionTotals] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    });
    const [nutritionPercentages, setNutritionPercentages] = useState({
        protein: 0,
        carbs: 0,
        fats: 0
    });

    useEffect(() => {
        // Find the folder
        const currentFolder = folders.find(f => f.id === folderId);
        if (!currentFolder) {
            navigate('/dashboard');
            return;
        }

        setFolder(currentFolder);

        // Filter items for this folder
        const items = scannedItems.filter(item => item.folderId === folderId);
        setFolderItems(items);

        // Calculate nutrition totals
        const totals = items.reduce((acc, item) => {
            // Parse values, removing 'g' and converting to numbers
            const protein = parseFloat(item.protein?.replace('g', '') || 0);
            const carbs = parseFloat(item.carbs?.replace('g', '') || 0);
            const fats = parseFloat(item.fats?.replace('g', '') || 0);

            return {
                calories: acc.calories + (item.calories || 0),
                protein: acc.protein + protein,
                carbs: acc.carbs + carbs,
                fats: acc.fats + fats
            };
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        setNutritionTotals(totals);

        // Calculate macronutrient percentages
        const totalMacros = totals.protein + totals.carbs + totals.fats;
        if (totalMacros > 0) {
            setNutritionPercentages({
                protein: Math.round((totals.protein / totalMacros) * 100),
                carbs: Math.round((totals.carbs / totalMacros) * 100),
                fats: Math.round((totals.fats / totalMacros) * 100)
            });
        }
    }, [folderId, folders, scannedItems, navigate]);

    if (!folder) {
        return (
            <div className="min-h-screen bg-blue-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <p className="text-gray-600">Loading analysis...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-100 py-10 px-4">
            <div className="max-w-5xl mx-auto">
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

                <h1 className="text-3xl font-bold text-gray-800 mb-4">Analysis: {folder.name}</h1>
                <p className="text-gray-600 mb-8">Nutritional summary and analysis of {folderItems.length} items</p>

                {folderItems.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No items to analyze</h2>
                        <p className="text-gray-500 mb-4">This folder doesn't have any scanned items yet.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Nutrition Summary */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
                                <h2 className="text-xl font-semibold">Nutrition Summary</h2>
                            </div>
                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-700 font-medium">Total Calories</span>
                                        <span className="text-gray-900 font-bold">{nutritionTotals.calories}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div className="h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Protein */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Protein</span>
                                            <div>
                                                <span className="font-medium">{nutritionTotals.protein.toFixed(1)}g</span>
                                                <span className="text-gray-500 text-sm ml-2">({nutritionPercentages.protein}%)</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full">
                                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${nutritionPercentages.protein}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Carbohydrates */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Carbohydrates</span>
                                            <div>
                                                <span className="font-medium">{nutritionTotals.carbs.toFixed(1)}g</span>
                                                <span className="text-gray-500 text-sm ml-2">({nutritionPercentages.carbs}%)</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full">
                                            <div className="h-2 bg-amber-500 rounded-full" style={{ width: `${nutritionPercentages.carbs}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Fats */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Fats</span>
                                            <div>
                                                <span className="font-medium">{nutritionTotals.fats.toFixed(1)}g</span>
                                                <span className="text-gray-500 text-sm ml-2">({nutritionPercentages.fats}%)</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full">
                                            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${nutritionPercentages.fats}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Recommendations</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        {nutritionPercentages.protein < 20 && (
                                            <li className="flex items-start">
                                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Consider adding more protein sources to your diet
                                            </li>
                                        )}
                                        {nutritionPercentages.fats > 40 && (
                                            <li className="flex items-start">
                                                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Fat intake is relatively high
                                            </li>
                                        )}
                                        {nutritionPercentages.carbs > 60 && (
                                            <li className="flex items-start">
                                                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Carbohydrate intake is relatively high
                                            </li>
                                        )}
                                        {nutritionTotals.calories < 500 && folderItems.length > 2 && (
                                            <li className="flex items-start">
                                                <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Calorie intake appears low for the number of items
                                            </li>
                                        )}
                                        {!nutritionTotals.protein && !nutritionTotals.carbs && !nutritionTotals.fats && (
                                            <li className="flex items-start">
                                                <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Not enough nutrition data to provide detailed recommendations
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                                <h2 className="text-xl font-semibold">Items in this Analysis</h2>
                            </div>
                            <div className="p-4">
                                <div className="divide-y">
                                    {folderItems.map(item => (
                                        <div
                                            key={item.id}
                                            className="py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition"
                                            onClick={() => navigate(`/product/${item.id}`)}
                                        >
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden mr-3">
                                                    <img
                                                        src={item.image || '/api/placeholder/40/40'}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{item.name || 'Unknown Product'}</h3>
                                                    <p className="text-xs text-gray-500">{item.brand || 'Unknown Brand'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-medium text-gray-900">{item.calories || 0} cal</span>
                                                <p className="text-xs text-gray-500">{item.quantity || 'Unknown'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Macronutrient Distribution Chart */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:col-span-2">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                                <h2 className="text-xl font-semibold">Macronutrient Distribution</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-around items-center h-64">
                                    {/* Simple visual representation of macronutrient distribution */}
                                    <div className="flex items-end h-full space-x-12 mb-6">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="w-24 bg-blue-500 rounded-t-lg"
                                                style={{ height: `${(nutritionPercentages.protein * 2)}px` }}
                                            ></div>
                                            <div className="mt-2 text-center">
                                                <span className="block font-medium text-gray-800">{nutritionPercentages.protein}%</span>
                                                <span className="text-sm text-gray-500">Protein</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div
                                                className="w-24 bg-amber-500 rounded-t-lg"
                                                style={{ height: `${(nutritionPercentages.carbs * 2)}px` }}
                                            ></div>
                                            <div className="mt-2 text-center">
                                                <span className="block font-medium text-gray-800">{nutritionPercentages.carbs}%</span>
                                                <span className="text-sm text-gray-500">Carbs</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div
                                                className="w-24 bg-green-500 rounded-t-lg"
                                                style={{ height: `${(nutritionPercentages.fats * 2)}px` }}
                                            ></div>
                                            <div className="mt-2 text-center">
                                                <span className="block font-medium text-gray-800">{nutritionPercentages.fats}%</span>
                                                <span className="text-sm text-gray-500">Fats</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">About This Analysis</h3>
                                    <p className="text-gray-600">
                                        This analysis provides a breakdown of the macronutrient distribution in your scanned items.
                                        Ideally, a balanced diet should contain approximately 10-35% protein, 45-65% carbohydrates, and 20-35% fats.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analysis;