// src/components/ui/Modal.jsx
import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    const modalRef = useRef(null);

    // Handle escape key press
    useEffect(() => {
        const handleEscKeyPress = (e) => {
            if (e.key === 'Escape' && isOpen && onClose) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKeyPress);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKeyPress);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle clicks outside of modal
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target) && onClose) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 transition-opacity" />

            {/* Modal content */}
            <div
                ref={modalRef}
                className="w-full max-w-md bg-white rounded-lg shadow-xl z-10 transform transition-all"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 id="modal-title" className="text-lg font-medium text-gray-900">
                        {title}
                    </h3>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {children}
            </div>
        </div>
    );
};

export default Modal;