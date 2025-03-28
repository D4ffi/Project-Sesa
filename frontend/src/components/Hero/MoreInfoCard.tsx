import React from 'react';
import { useNavigate } from 'react-router-dom';

const MoreInfoCard: React.FC<{
    gradientFrom?: string;
    gradientTo?: string;
    textColor?: string;
    title?: string;
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;
}> = ({
          gradientFrom = "from-purple-500",
          gradientTo = "to-pink-500",
          textColor = "text-white",
          title = "Conoce nuestras impresiones de alta calidad",
          paragraph1 = "Escoge el paquete que mas se adecue a ti",
          paragraph2 = "Impresiones para compañias",
      }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/contact');
    };

    return (
        <div>
            {/* Right Section */}
            <div
                className={`group cursor-pointer bg-gradient-to-r ${gradientFrom} ${gradientTo} ${textColor} rounded-lg p-6 shadow-lg shadow-neutral-900
                transform transition-transform duration-300 hover:scale-105`}
                onClick={handleClick}
            >
                <h1 className="text-2xl font-bold mb-4">
                    {title}
                </h1>
                <p className="mb-2">
                    {paragraph1}
                </p>
                <p className="mb-2 group-hover:underline">
                    {paragraph2}
                </p>

                <div className={'flex justify-center pt-4'}>
                    <img src="/assets/more-info-2.avif" alt="Descripción de la imagen" className="h-55 w-80 rounded-lg mb-4"/>
                </div>
            </div>
        </div>
    );
};

export default MoreInfoCard;