import React from 'react';
import MiniCard from "./MiniCard.tsx";

const MiddleCard: React.FC<{
    gradientFrom?: string;
    gradientTo?: string;
    textColor?: string;
    title?: string;
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;

}> = ({
          gradientFrom = "from-pink-600",
          gradientTo = "to-pink-700",
          textColor = "text-white",
          title = "Conoce nuestras impresiones de alta calidad",
          paragraph1 = "Escoge el paquete que mas se adecue a ti",
          paragraph2 = "Impresiones para compañias",
          paragraph3 = "Precios al mayoreo: desde un 15% de descuento",
      }) => {
    return (
        <div>
            {/* Right Section */}
            <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} ${textColor} rounded-lg p-6 shadow-lg shadow-neutral-900
            transform transition-transform duration-300 hover:scale-105`}>
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
                <MiniCard/>
            </div>
        </div>
    );
};

export default MiddleCard;