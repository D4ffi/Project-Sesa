import React from 'react';
import MiniCard from "./MiniCard";

const Card: React.FC<{
    gradientFrom?: string;
    gradientTo?: string;
    textColor?: string;
}> = ({
    gradientFrom = "from-purple-500",
    gradientTo = "to-pink-500",
    textColor = "text-white"
}) => {
    const title = "Conoce nuestras impresiones de alta calidad";
    const paragraph1 = "Escoge el paquete que mas se adecue a ti";
    const paragraph2 = "Impresiones para compañias";
    const paragraph3 = "Precios al mayoreo: desde un 15% de descuento";

    return (
        <div>
            {/* Right Section */}
            <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} ${textColor} rounded-lg p-6 m-1`}>
                <h1 className="text-2xl font-bold mb-4">
                    {title}
                </h1>
                <p className="mb-2">
                    {paragraph1}
                </p>
                <p className="mb-2">
                    {paragraph2}
                </p>
                <p className="mb-4">
                    {paragraph3}
                </p>
                <MiniCard title={"Sublimación"} description={"Que tu marca perdure con nuestra calidad en sublimación"} />
                <br/>
                <MiniCard title={"Serigrafía"} description={"Viste tu marca como tu quieras"}/>
            </div>
        </div>
    );
};

export default Card;