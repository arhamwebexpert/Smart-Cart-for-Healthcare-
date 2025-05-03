import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = ({ icon, title, description, action }) => {
    return (
        <div className="text-center py-12 px-4 bg-gray-50 rounded-lg">
            {icon && (
                <div className="flex justify-center mb-4">
                    {icon}
                </div>
            )}
            {title && (
                <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            )}
            {description && (
                <p className="text-sm text-gray-500 mb-6">{description}</p>
            )}
            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}
        </div>
    );
};

EmptyState.propTypes = {
    icon: PropTypes.node,
    title: PropTypes.string,
    description: PropTypes.string,
    action: PropTypes.node
};

export default EmptyState;