// dashboard/src/components/common/CRUDButton.tsx
import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface CRUDButtonProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    bgColor?: string;
    iconColor?: string;
    size?: 'sm' | 'md' | 'lg';
    tooltip?: string;
    disabled?: boolean;
}

const CRUDButton: React.FC<CRUDButtonProps> = ({
                                                   icon: Icon,
                                                   label,
                                                   onClick,
                                                   bgColor = 'bg-white',
                                                   iconColor = 'text-gray-700',
                                                   size = 'md',
                                                   tooltip,
                                                   disabled = false,
                                               }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    // Mapeo de tamaños
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    // Tamaño de icono basado en el tamaño del botón
    const iconSize = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={onClick}
                disabled={disabled}
                aria-label={label}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className={`
          ${sizeClasses[size]} 
          ${bgColor} 
          rounded-lg 
          flex 
          items-center 
          justify-center 
          shadow-sm
          transition-all 
          duration-200
          ${
                    disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-md hover:scale-105 cursor-pointer'
                }
        `}
            >
                <Icon size={iconSize[size]} className={iconColor} />
            </button>

            {/* Tooltip */}
            {showTooltip && tooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                    {tooltip}
                    {/* Flecha del tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
            )}
        </div>
    );
};

export default CRUDButton;