import React from 'react';

const LeftCard: React.FC<{
    gradientFrom?: string;
    gradientTo?: string;
    textColor?: string;
    title?: string;
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;

}> = ({
          gradientFrom = "from-pink-500",
          gradientTo = "to-pink-500",
          textColor = "text-white",
          title = "Conoce nuestras impresiones de alta calidad",
          paragraph1 = "Escoge el paquete que mas se adecue a ti",
          paragraph2 = "Impresiones para compañias",
          paragraph3 = "Precios al mayoreo: desde un 15% de descuento",
      }) => {
    return (
        <div>
            <div className={` bg-gradient-to-r ${gradientFrom} ${gradientTo} ${textColor} rounded-lg p-6 shadow-lg
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
                {paragraph3 && (
                    <p className="mb-4">
                        {paragraph3}
                    </p>
                )}

                <div className="flex justify-center pt-4">
                    <img
                        src="/assets/hero-bg-3.avif"
                        alt="Productos promocionales"
                        className="w-full h-auto rounded-lg mb-4 object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default LeftCard;