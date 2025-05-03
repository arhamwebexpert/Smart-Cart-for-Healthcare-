// src/pages/Analysis.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useScannerStore from '../stores/scannerStore';
import useFolderStore from '../stores/folderStore';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const AnalysisALL = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const { scannedItems } = useScannerStore();
    const { folders, setActiveFolder } = useFolderStore();

    const [viewMode, setViewMode] = useState('folder'); // 'folder' or 'all'
    const [selectedMetric, setSelectedMetric] = useState('calories'); // 'calories', 'protein', 'carbs', 'fats'
    const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'nutrition', 'trends'

    // Set the active folder when component mounts
    useEffect(() => {
        if (folderId) {
            setActiveFolder(folderId);
            setViewMode('folder');
        } else {
            setViewMode('all');
        }
    }, [folderId, setActiveFolder]);

    // Get items based on view mode
    const getRelevantItems = () => {
        if (viewMode === 'folder' && folderId) {
            return scannedItems.filter(item => item.folderId === folderId);
        }
        return scannedItems;
    };

    const items = getRelevantItems();

    // Calculate overall stats
    const calculateStats = () => {
        const totalCalories = items.reduce((sum, item) => sum + (item.calories || 0), 0);

        const totalProtein = items.reduce((sum, item) => {
            const protein = item.protein?.replace('g', '') || 0;
            return sum + Number(protein);
        }, 0);

        const totalCarbs = items.reduce((sum, item) => {
            const carbs = item.carbs?.replace('g', '') || 0;
            return sum + Number(carbs);
        }, 0);

        const totalFats = items.reduce((sum, item) => {
            const fats = item.fats?.replace('g', '') || 0;
            return sum + Number(fats);
        }, 0);

        return {
            itemCount: items.length,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFats,
            avgCaloriesPerItem: items.length ? Math.round(totalCalories / items.length) : 0
        };
    };

    const stats = calculateStats();

    // Group data by brands
    const brandData = items.reduce((acc, item) => {
        const brand = item.brand || 'Unknown';

        if (!acc[brand]) {
            acc[brand] = {
                name: brand,
                count: 0,
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0
            };
        }

        acc[brand].count += 1;
        acc[brand].calories += (item.calories || 0);
        acc[brand].protein += Number(item.protein?.replace('g', '') || 0);
        acc[brand].carbs += Number(item.carbs?.replace('g', '') || 0);
        acc[brand].fats += Number(item.fats?.replace('g', '') || 0);

        return acc;
    }, {});

    const brandChartData = Object.values(brandData).sort((a, b) => b.count - a.count);

    // Macronutrient distribution data for pie chart
    const macroData = [
        { name: 'Protein', value: stats.totalProtein },
        { name: 'Carbs', value: stats.totalCarbs },
        { name: 'Fats', value: stats.totalFats }
    ];

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    // Get folder name
    const folderName = folderId
        ? folders.find(f => f.id === folderId)?.name || 'Unknown Folder'
        : 'All Folders';

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleDateString();
    };

    // Empty state component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="rounded-full bg-blue-100 p-4 mb-4">
                <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No items to analyze</h3>
            <p className="text-gray-600 mb-6 max-w-md">
                Scan some items first to see analysis and insights about your nutrition data.
            </p>
            <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
            >
                Go to Dashboard
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-blue-100 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Nutrition Analysis</h1>
                        <div className="flex items-center text-gray-600">
                            <span className="font-medium mr-2">{folderName}</span>
                            <span className="text-sm">({items.length} items)</span>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>

                        <select
                            value={viewMode}
                            onChange={(e) => {
                                const newMode = e.target.value;
                                setViewMode(newMode);
                                if (newMode === 'all') {
                                    navigate('/analysis');
                                } else if (folderId) {
                                    navigate(`/analysis/${folderId}`);
                                }
                            }}
                            className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Carts</option>
                            <option value="folder" disabled={!folderId}>Current Cart Only</option>
                        </select>
                    </div>
                </div>

                {items.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-t-xl shadow-md mb-6">
                            <div className="flex overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('summary')}
                                    className={`py-4 px-6 font-medium transition ${activeTab === 'summary'
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Summary
                                </button>
                                <button
                                    onClick={() => setActiveTab('nutrition')}
                                    className={`py-4 px-6 font-medium transition ${activeTab === 'nutrition'
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Nutrition Breakdown
                                </button>
                                <button
                                    onClick={() => setActiveTab('trends')}
                                    className={`py-4 px-6 font-medium transition ${activeTab === 'trends'
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Trends & Insights
                                </button>
                            </div>
                        </div>

                        {/* Summary Tab */}
                        {activeTab === 'summary' && (
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Key Stats */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Stats</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-indigo-50 rounded-lg p-4">
                                            <p className="text-sm text-indigo-700 mb-1">Total Items</p>
                                            <p className="text-3xl font-bold text-indigo-900">{stats.itemCount}</p>
                                        </div>
                                        <div className="bg-orange-50 rounded-lg p-4">
                                            <p className="text-sm text-orange-700 mb-1">Total Calories</p>
                                            <p className="text-3xl font-bold text-orange-900">{stats.totalCalories}</p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <p className="text-sm text-green-700 mb-1">Total Protein</p>
                                            <p className="text-3xl font-bold text-green-900">{stats.totalProtein}g</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <p className="text-sm text-blue-700 mb-1">Avg. Calories/Item</p>
                                            <p className="text-3xl font-bold text-blue-900">{stats.avgCaloriesPerItem}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Macro Distribution */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Macronutrient Distribution</h2>
                                    {macroData.some(item => item.value > 0) ? (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={macroData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {macroData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => `${value}g`} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-64 text-gray-500">
                                            No macronutrient data available
                                        </div>
                                    )}
                                </div>

                                {/* Brand Distribution */}
                                <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800">Brand Distribution</h2>
                                        <select
                                            value={selectedMetric}
                                            onChange={(e) => setSelectedMetric(e.target.value)}
                                            className="bg-white border border-gray-300 text-gray-700 py-1 px-2 text-sm rounded-md"
                                        >
                                            <option value="calories">Calories</option>
                                            <option value="protein">Protein (g)</option>
                                            <option value="carbs">Carbs (g)</option>
                                            <option value="fats">Fats (g)</option>
                                            <option value="count">Item Count</option>
                                        </select>
                                    </div>

                                    {brandChartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart
                                                data={brandChartData}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="name"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={70}
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar
                                                    dataKey={selectedMetric}
                                                    name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                                                    fill="#8884d8"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-64 text-gray-500">
                                            No brand data available
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Nutrition Breakdown Tab */}
                        {activeTab === 'nutrition' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Nutrition Details</h2>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Brand
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Calories
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Protein
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Carbs
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fats
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {items.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                                                <img src={item.image || '/api/placeholder/40/40'} alt={item.name} className="h-10 w-10 object-cover" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{item.name || 'Unknown Product'}</div>
                                                                <div className="text-sm text-gray-500">{item.quantity}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.brand || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                                            {item.calories || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.protein || '0g'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.carbs || '0g'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.fats || '0g'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td colSpan="2" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                    Totals
                                                </td>
                                                <td className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                    {stats.totalCalories}
                                                </td>
                                                <td className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                    {stats.totalProtein}g
                                                </td>
                                                <td className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                    {stats.totalCarbs}g
                                                </td>
                                                <td className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                    {stats.totalFats}g
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Trends & Insights Tab */}
                        {activeTab === 'trends' && (
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Protein/Calorie Ratio */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Protein to Calorie Ratio</h2>
                                    <div className="flex items-center justify-center h-64">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold text-indigo-600 mb-2">
                                                {stats.totalCalories > 0
                                                    ? ((stats.totalProtein / stats.totalCalories) * 100).toFixed(1)
                                                    : '0'}
                                            </div>
                                            <div className="text-gray-500">grams of protein per 100 calories</div>
                                            <p className="mt-4 text-sm text-gray-600 max-w-md mx-auto">
                                                A higher ratio indicates more protein-rich foods. Athletes and those building muscle typically aim for ratios above 5.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Macro Ratio */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Macronutrient Ratio</h2>
                                    <div className="flex items-center justify-center h-64">
                                        <div className="w-full max-w-md">
                                            <div className="flex mb-2">
                                                <div className="text-sm font-medium text-gray-500 w-20">Protein</div>
                                                <div className="flex-1 relative pt-1">
                                                    <div className="overflow-hidden h-6 text-xs flex rounded bg-gray-100">
                                                        <div
                                                            style={{
                                                                width: `${stats.totalProtein + stats.totalCarbs + stats.totalFats > 0
                                                                    ? (stats.totalProtein / (stats.totalProtein + stats.totalCarbs + stats.totalFats)) * 100
                                                                    : 0}%`
                                                            }}
                                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="w-12 text-right text-sm text-gray-600">
                                                    {stats.totalProtein + stats.totalCarbs + stats.totalFats > 0
                                                        ? ((stats.totalProtein / (stats.totalProtein + stats.totalCarbs + stats.totalFats)) * 100).toFixed(0)
                                                        : 0}%
                                                </div>
                                            </div>

                                            <div className="flex mb-2">
                                                <div className="text-sm font-medium text-gray-500 w-20">Carbs</div>
                                                <div className="flex-1 relative pt-1">
                                                    <div className="overflow-hidden h-6 text-xs flex rounded bg-gray-100">
                                                        <div
                                                            style={{
                                                                width: `${stats.totalProtein + stats.totalCarbs + stats.totalFats > 0
                                                                    ? (stats.totalCarbs / (stats.totalProtein + stats.totalCarbs + stats.totalFats)) * 100
                                                                    : 0}%`
                                                            }}
                                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="w-12 text-right text-sm text-gray-600">
                                                    {stats.totalProtein + stats.totalCarbs + stats.totalFats > 0
                                                        ? ((stats.totalCarbs / (stats.totalProtein + stats.totalCarbs + stats.totalFats)) * 100).toFixed(0)
                                                        : 0}%
                                                </div>
                                            </div>

                                            <div className="flex">
                                                <div className="text-sm font-medium text-gray-500 w-20">Fats</div>
                                                <div className="flex-1 relative pt-1">
                                                    <div className="overflow-hidden h-6 text-xs flex rounded bg-gray-100">
                                                        <div
                                                            style={{
                                                                width: `${stats.totalProtein + stats.totalCarbs + stats.totalFats > 0
                                                                    ? (stats.totalFats / (stats.totalProtein + stats.totalCarbs + stats.totalFats)) * 100
                                                                    : 0}%`
                                                            }}
                                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="w-12 text-right text-sm text-gray-600">
                                                    {stats.totalProtein + stats.totalCarbs + stats.totalFats > 0
                                                        ? ((stats.totalFats / (stats.totalProtein + stats.totalCarbs + stats.totalFats)) * 100).toFixed(0)
                                                        : 0}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Nutritional Insights */}
                                <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Nutritional Insights</h2>

                                    <div className="space-y-4">
                                        {stats.totalProtein < 50 && (
                                            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-blue-800">Consider adding more protein</h3>
                                                        <div className="mt-2 text-sm text-blue-700">
                                                            <p>Your total protein intake is {stats.totalProtein}g. For optimal health and muscle maintenance, aim for at least 50g of protein per day.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {stats.totalFats > stats.totalProtein * 2 && (
                                            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-yellow-800">High fat to protein ratio</h3>
                                                        <div className="mt-2 text-sm text-yellow-700">
                                                            <p>Your fat intake ({stats?.totalFats}g) is more than twice your protein intake ({stats?.totalProtein}g). Consider balancing with more protein-rich foods.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {stats.totalCarbs > 0 && stats.totalCarbs < stats.totalProtein && (
                                            <div className="p-4 border-l-4 border-green-500 bg-green-50">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-green-800">Low-carb profile detected</h3>
                                                        <div className="mt-2 text-sm text-green-700">
                                                            <p>Your carb intake ({stats.totalCarbs}g) is lower than your protein intake ({stats.totalProtein}g), suggesting a low-carb nutritional profile.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {items.length === 0 && (
                                            <div className="p-4 border-l-4 border-gray-500 bg-gray-50">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-gray-800">No items to analyze</h3>
                                                        <div className="mt-2 text-sm text-gray-700">
                                                            <p>Add some items first to see nutritional insights.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Default insight when no specific conditions are met */}
                                        {items.length > 0 &&
                                            !((stats.totalProtein < 50) ||
                                                (stats.totalFats > stats.totalProtein * 2) ||
                                                (stats.totalCarbs > 0 && stats.totalCarbs < stats.totalProtein)) && (
                                                <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50">
                                                    <div className="flex">
                                                        <div className="flex-shrink-0">
                                                            <svg className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-3">
                                                            <h3 className="text-sm font-medium text-indigo-800">Balanced nutrition</h3>
                                                            <div className="mt-2 text-sm text-indigo-700">
                                                                <p>Your nutritional profile appears to be well-balanced with {stats.totalProtein}g protein, {stats.totalCarbs}g carbs, and {stats.totalFats}g fats.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Timeline View */}
                                <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Items by Date</h2>

                                    {items.length > 0 ? (
                                        <div className="relative">
                                            {/* Timeline */}
                                            <div className="absolute h-full w-0.5 bg-gray-200 left-0 top-0"></div>

                                            <div className="space-y-6 pl-8">
                                                {/* Group items by date */}
                                                {Object.entries(
                                                    items.reduce((acc, item) => {
                                                        const date = formatDate(item.timestamp) || 'No Date';
                                                        if (!acc[date]) acc[date] = [];
                                                        acc[date].push(item);
                                                        return acc;
                                                    }, {})
                                                ).map(([date, dateItems]) => (
                                                    <div key={date} className="relative">
                                                        {/* Date marker */}
                                                        <div className="absolute -left-8 mt-1.5 w-6 h-6 rounded-full bg-indigo-500 border-4 border-white flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">{dateItems.length}</span>
                                                        </div>

                                                        {/* Date group */}
                                                        <div>
                                                            <h3 className="text-base font-semibold text-gray-900 mb-2">{date}</h3>
                                                            <div className="space-y-2">
                                                                {dateItems.map((item) => (
                                                                    <div key={item.id} className="p-3 bg-gray-50 rounded-lg flex items-center">
                                                                        <div className="h-8 w-8 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                                                            <img src={item.image || '/api/placeholder/32/32'} alt={item.name} className="h-8 w-8 object-cover" />
                                                                        </div>
                                                                        <div className="ml-3 flex-1">
                                                                            <div className="text-sm font-medium text-gray-900">{item.name || 'Unknown Product'}</div>
                                                                            <div className="text-xs text-gray-500">
                                                                                {item.brand ? `${item.brand} • ` : ''}
                                                                                {item.calories ? `${item.calories} cal` : 'No calorie info'}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right text-xs text-gray-500">
                                                                            <div>{item.protein || '0g'} protein</div>
                                                                            <div>{item.carbs || '0g'} carbs</div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-32 text-gray-500">
                                            No timeline data available
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AnalysisALL;