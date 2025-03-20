import React from "react";
import { SquareArrowOutUpRight } from "lucide-react";

const Button: React.FC = () => {
    return (
        <button
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white
             font-bold py-3 px-8 rounded-[20px] transition-colors duration-300 items-center text-lg
             hover:cursor-pointer"
        >
            Ver Productos <SquareArrowOutUpRight size={20} className="inline-block ml-2"/>
        </button>
    )
}

export default Button