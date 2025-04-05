
// Componente simplificado que solo contiene el SVG sin posicionamiento especial
const SesaBackground = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1080 1080"
            className="w-full h-full"
        >
            <g>
                <path
                    d="M540.404,79.874l-0,919.945c-253.866,-0 -459.972,-206.107 -459.972,-459.973c-0,-253.865 206.106,-459.972 459.972,-459.972Z"
                    fill="#454545"
                />
                <path
                    d="M539.596,80.181l0,919.945c253.866,0 459.972,-206.107 459.972,-459.972c0,-253.866 -206.106,-459.973 -459.972,-459.973Z"
                    fill="#ef6c25"
                />
            </g>
        </svg>
    );
};

export default SesaBackground;