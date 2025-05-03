// src/components/ui/LoadingSpinner.jsx
const LoadingSpinner = ({ size = 'medium' }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    return (
        <div className="flex justify-center items-center">
            <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizeClasses[size]}`}></div>
        </div>
    );
};

export default LoadingSpinner;
// src/components/ui/AlertMessage.jsx
export const AlertMessage = ({ type = 'info', message, onClose }) => {
    const typeClasses = {
        info: 'bg-blue-100 border-blue-400 text-blue-700',
        success: 'bg-green-100 border-green-400 text-green-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        error: 'bg-red-100 border-red-400 text-red-700'
    };

    return (
        <div className={`${typeClasses[type]} px-4 py-3 rounded relative mb-4`} role="alert">
            <span className="block sm:inline">{message}</span>
            {onClose && (
                <span
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={onClose}
                >
                    <svg
                        className="fill-current h-6 w-6"
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                </span>
            )}
        </div>
    );
};

// src/components/ui/EmptyState.jsx
export const EmptyState = ({ icon, title, description, action }) => {
    return (
        <div className="text-center py-8">
            {icon && <div className="mx-auto mb-4">{icon}</div>}
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
};