import React from "react";


const MiniCard: React.FC = ({

}) => {
    return (
        <div className={`bg-white text-gray-700 rounded-lg p-4`}>
            <h2 className="text-xl font-bold mb-2">
                Serigrafía
            </h2>
            <p className="mb-2">
                Contamos con lo mejor para que luzcas tu marca
            </p>
            <p className="mb-4">
                Impresiones de alta calidad y duraderas
            </p>

            <h2 className="text-xl font-bold mb-2">
                Sublimaciones
            </h2>
            <p className="mb-2">
                Nunca fue tan fácil personalizar tus articulos
            </p>
            <p className="mb-4">
                Acabados profesionales y detallados
            </p>

        </div>
    );
}

export default MiniCard;