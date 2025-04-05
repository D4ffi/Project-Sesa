import React from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ButtonProps {
    to?: string;
    text?: string;
}

const Button: React.FC<ButtonProps> = ({
                                           to = "/products",
                                           text = "Ver Productos"
                                       }) => {
    return (
        <Link to={to}>
            <button
                className="inline-flex bg-orange-500 hover:bg-orange-600 text-white
                font-bold py-3 px-8 rounded-[20px] transition-colors duration-300 items-center text-lg
                hover:cursor-pointer"
            >
                {text} <SquareArrowOutUpRight size={20} className="bottom-1.5 ml-2"/>
            </button>
        </Link>
    );
};

export default Button;