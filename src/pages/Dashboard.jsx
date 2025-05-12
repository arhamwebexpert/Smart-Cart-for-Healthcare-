import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useScanner from '../hooks/useScanner';
import useScannerStore from '../stores/scannerStore';
import useFolderStore from '../stores/folderStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AlertMessage from '../components/ui/AlertMessage';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { fakeHardwareScan } from '../hooks/scannerUtils';
const Dashboard = () => {
    const navigate = useNavigate();
    const { status, scanning, error, connect, scan } = useScanner();
    const {
        scannedItems,
        addScannedItem,
        currentBarcode,
        setCurrentBarcode,
        fetchScannedItems,
        clearItems
    } = useScannerStore();

    const {
        folders,
        activeFolder,
        createFolder,
        fetchFolders,
        setActiveFolder
    } = useFolderStore();

    const [alertMessage, setAlertMessage] = useState(null);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [showStartScanningPrompt, setShowStartScanningPrompt] = useState(true);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);

    // Check if user has any folders, if not, show folder creation prompt
    useEffect(() => {
        // Initial data fetch
        const initializeData = async () => {
            try {
                await fetchFolders();
            } catch (error) {
                setAlertMessage({
                    type: 'error',
                    message: 'Failed to load carts. Please try again later.'
                });
            }
        };
        initializeData();
    }, [fetchFolders]); // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        // Handle folder state after initial load/updates
        if (folders.length === 0) {
            setShowFolderModal(true);
            setShowStartScanningPrompt(false);
        } else if (!activeFolder) {
            // Auto-select first folder if none selected
            setActiveFolder(folders[0].id);
        }
    }, [folders, activeFolder, setActiveFolder]);

    useEffect(() => {
        // Fetch items when active folder changes
        const loadItems = async () => {
            if (activeFolder) {
                try {
                    await fetchScannedItems(activeFolder);
                    setShowStartScanningPrompt(true);
                } catch (error) {
                    setAlertMessage({
                        type: 'error',
                        message: 'Failed to load cart items. Please try again.'
                    });
                }
            }
        };
        loadItems();
    }, [activeFolder, fetchScannedItems]);
    useEffect(() => {
        // Open an EventSource to your SSE endpoint
        const es = new EventSource('http://192.168.18.173:3000/api/scan-stream');

        // On each message (i.e. new barcode), reload the page
        es.onmessage = (e) => {
            try {
                const { barcode } = JSON.parse(e.data);
                console.log('New scan received via SSE:', barcode);
                window.location.reload();
            } catch (err) {
                console.error('Error parsing SSE data:', err);
            }
        };

        // Log errors and close on failure
        es.onerror = (err) => {
            console.error('SSE connection error:', err);
            es.close();
        };

        // Cleanup on unmount
        return () => {
            es.close();
        };
    }, []); // empty deps → run once on mount

    useEffect(() => {
        // Handle scanner errors
        if (error) {
            setAlertMessage({ type: 'error', message: error });
        }
    }, [error]);

    // Listen for API scan events - handle the "8901234567890" barcode
    useEffect(() => {
        const handleApiScan = async () => {
            if (!activeFolder) return;
            const scannedCode = await fakeHardwareScan();
            if (scannedCode == null) {
                console.log("please scan");
                return;
            }

            console.log(scannedCode);
            try {
                // 1. GET the product by barcode
                const res = await fetch(`http://192.168.18.173:3000/api/scan/${scannedCode}`);
                if (!res.ok) throw new Error("Scan failed");

                const { product } = await res.json();

                // 2. Build a unique ID (e.g. timestamp or UUID)
                const id = String(Date.now());

                // 3. Persist into the active folder
                await addScannedItem(activeFolder, { id, barcode: product.barcode });


                setAlertMessage({
                    type: "success",
                    message: `${product.name} added to your cart!`,
                });
                setTimeout(() => setAlertMessage(null), 3000);

            } catch (err) {
                console.error(err);
                setAlertMessage({ type: "error", message: err.message });
            }
        };


        // This would typically be connected to a webhook or server event
        // For this example, we'll just call it once on component mount
        if (activeFolder) {
            handleApiScan();
        }
    }, [activeFolder, addScannedItem, setCurrentBarcode]);

    const handleCreateFolder = async () => {
        if (newFolderName.trim()) {
            try {
                const newFolder = await createFolder(newFolderName);
                setActiveFolder(newFolder.id);
                setNewFolderName('');
                setShowFolderModal(false);
                setShowStartScanningPrompt(true);
                setAlertMessage({
                    type: 'success',
                    message: `Cart "${newFolderName}" created successfully!`
                });
                setTimeout(() => setAlertMessage(null), 3000);
            } catch (error) {
                setAlertMessage({
                    type: 'error',
                    message: 'Failed to create cart. Please try again.'
                });
            }
        }
    };

    const handleItemClick = (item) => {
        console.log(item.barcode);
        navigate(`/product/${item.barcode}`);
    };

    const activeItems = scannedItems.filter(item =>
        activeFolder ? item.folderId === activeFolder : true
    );

    // Calculate folder stats
    const calculateFolderStats = () => {
        if (!activeFolder) return null;

        const folderItems = scannedItems.filter(item => item.folderId === activeFolder);
        const totalCalories = folderItems.reduce((sum, item) => sum + (item.calories || 0), 0);
        const totalProtein = folderItems.reduce((sum, item) => {
            const protein = item.protein?.replace('g', '') || 0;
            return sum + Number(protein);
        }, 0);

        return {
            totalItems: folderItems.length,
            totalCalories,
            totalProtein: `${totalProtein}g`
        };
    };

    const folderStats = calculateFolderStats();
    const activeFolderName = folders.find(f => f.id === activeFolder)?.name || '';

    useEffect(() => {
        if (error) setAlertMessage({ type: 'error', message: error });
    }, [error]);

    return (
        <div className="min-h-screen bg-blue-100 py-10 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Folder Selection */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                    <div className="relative inline-block">
                        <select
                            value={activeFolder || ''}
                            onChange={(e) => setActiveFolder(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="" disabled>Select Cart</option>
                            {folders.map(folder => (
                                <option key={folder.id} value={folder.id}>{folder.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowFolderModal(true)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition flex items-center"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Cart
                    </button>

                    {activeFolder && (
                        <button
                            onClick={() => navigate(`/analysis/${activeFolder}`)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            View Analysis
                        </button>
                    )}
                </div>

                {alertMessage && (
                    <AlertMessage
                        type={alertMessage.type}
                        message={alertMessage.message}
                        onClose={() => setAlertMessage(null)}
                    />
                )}

                {/* Show Start Scanning Prompt */}
                {showStartScanningPrompt && folders.length > 0 && activeItems.length === 0 && (
                    <div className="mb-8 bg-white p-8 rounded-xl shadow text-center">
                        <div className="mx-auto w-16 h-16 mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Scan</h2>
                        <p className="text-gray-600 mb-6">
                            You're now working in the "{activeFolderName}" Cart.
                            Items will be automatically added to this collection when scanned.
                        </p>
                    </div>
                )}

                {/* Dashboard Cards */}
                {(!showStartScanningPrompt || activeItems.length > 0) && (
                    <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-2">
                        {/* Scanner Status */}
                        <div className="bg-white rounded-xl shadow hover:shadow-lg p-6 flex flex-col justify-between transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Scanner Status</h2>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className={`h-3 w-3 rounded-full mr-3 transition-colors ${status === 'connected' ? 'bg-green-500' : status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                    />
                                    <span className="capitalize text-gray-600">{status}</span>
                                </div>
                                {status !== 'connected' && (
                                    <button
                                        onClick={connect}
                                        disabled={status === 'connecting'}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition"
                                    >
                                        {status === 'connecting' ? (
                                            <span className="flex items-center">
                                                <LoadingSpinner size="small" className="mr-2 text-white" />
                                                Connecting...
                                            </span>
                                        ) : (
                                            'Connect'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Active Folder Stats */}
                        {activeFolder && folderStats && (
                            <div className="bg-white rounded-xl shadow hover:shadow-lg p-6 transition-shadow">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Cart Stats</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Items</span>
                                        <span className="font-medium">{folderStats.totalItems}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Total Calories</span>
                                        <span className="font-medium">{folderStats.totalCalories}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Total Protein</span>
                                        <span className="font-medium">{folderStats.totalProtein}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Scanned Items Feed */}
                {activeFolder && (
                    <div className="bg-white rounded-xl shadow-lg p-6 transition-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-700">Items in "{activeFolderName}"</h2>
                            <span className="text-sm text-gray-500">{activeItems.length} items</span>
                        </div>

                        {activeItems.length === 0 ? (
                            <EmptyState
                                icon={
                                    <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01..." />
                                    </svg>
                                }
                                title="No items in this Cart"
                                description="Items will appear here once they are scanned"
                                action={null}
                            />
                        ) : (
                            <div className="divide-y">
                                {activeItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="py-4 flex justify-between items-center hover:bg-gray-50 transition cursor-pointer"
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded mr-4 flex-shrink-0 overflow-hidden">
                                                <img src={item.image || '/api/placeholder/80/80'} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">{item.name || 'Unknown Product'}</h3>
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <span className="font-mono mr-3">{item.barcode}</span>
                                                    {item.calories && (
                                                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">
                                                            {item.calories} cal
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-500 mr-4">{item.timestamp}</span>
                                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* New Folder Modal */}
            <Modal
                isOpen={showFolderModal}
                onClose={() => {
                    if (folders.length > 0) {
                        setShowFolderModal(false);
                    }
                }}
                title="Create a New Cart"
            >
                <div className="p-4">
                    <p className="text-gray-600 mb-4">
                        Create a Cart to organize your scanned items.
                        Each Cart can contain multiple items for analysis.
                    </p>

                    <div className="mb-4">
                        <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-1">
                            Cart Name
                        </label>
                        <input
                            type="text"
                            id="folderName"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="e.g., Breakfast, Lunch, Groceries"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        {folders.length > 0 && (
                            <button
                                onClick={() => setShowFolderModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleCreateFolder}
                            disabled={!newFolderName.trim()}
                            className={`px-4 py-2 rounded-md ${!newFolderName.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                        >
                            Create Cart
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;