import React from "react";

const Button: React.FC = () => {
    return (
        <button
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-[20px] transition-colors duration-300"
        >
            Ver Productos
        </button>
    )
}

export default Button