import React from "react";


const MiniCard: React.FC<{ bgColor?: string; textColor?: string; title?: string; description?: string }> = ({
    bgColor = "bg-gray-200",
    textColor = "text-black",
    title = "Serigrafia",
    description = "Sudaderas, camisas, gorras, y mucho más"

}) => {
    return (
        <div className={`${bgColor} ${textColor} rounded-lg p-4`}>
            <h2 className="text-xl font-bold mb-2">
                {title}
            </h2>
            <p className="mb-2">
                {description}
            </p>
            <p className="mb-4">
                Acabados profesionales y duraderos
            </p>
        </div>
    );
}

export default MiniCard;