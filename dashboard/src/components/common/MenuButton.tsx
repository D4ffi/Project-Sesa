import { LucideIcon } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { scrollToSection } from "../../utils/scrollUtils.ts";

interface MenuButtonProps {
    name: string;
    icon: LucideIcon;
    to: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({
                                                   name,
                                                   icon: Icon,
                                                   to
                                               }) => {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent) => {
        // Check if this is a hash link (section on the same page)
        if (to.includes('#')) {
            e.preventDefault();

            const parts = to.split('#');
            const path = parts[0] || '/'; // Default to home if empty
            const sectionId = parts[1];

            // If we're already on the correct page, just scroll
            if ((path === '/' && window.location.pathname === '/') ||
                window.location.pathname === path) {
                scrollToSection(sectionId);
            } else {
                // We need to navigate to a different page and then scroll
                // Store the target section in sessionStorage so we can retrieve it after navigation
                sessionStorage.setItem('scrollTarget', sectionId);
                navigate(path);
            }
        }
        // For regular links, let the Link component handle it
    };

    return (
        <Link to={to} className="block w-full" onClick={handleClick}>
            <div className="group flex items-center space-x-2 bg-gray-200 p-2 rounded w-40 hover:bg-gray-300 transition-colors duration-300 cursor-pointer">
                <Icon size={24} className="text-[#364153] group-hover:text-orange-500" />
                <span className={"text-[#364153] group-hover:text-orange-500"}>{name}</span>
            </div>
        </Link>
    );
};

export default MenuButton;