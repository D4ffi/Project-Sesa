import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface DashboardLinkButtonProps {
    to: string;
    label: string;
    icon: LucideIcon;
    className?: string;
}

const DashboardLinkButton: React.FC<DashboardLinkButtonProps> = ({
                                                                     to,
                                                                     label,
                                                                     icon: Icon,
                                                                     className = "",
                                                                 }) => {
    return (
        <Link to={to}>
            <button
                className={`flex items-center justify-center gap-2 bg-white hover:bg-gray-100 cursor-pointer text-gray-700 font-medium 
        py-3 px-6 rounded-xl border border-gray-300 shadow-sm transition-all duration-300 
        w-48 h-12 hover:shadow-md ${className}`}
            >
                <Icon className="text-orange-500" size={18} />
                <span>{label}</span>
            </button>
        </Link>
    );
};

export default DashboardLinkButton;