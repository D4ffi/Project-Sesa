import SignInCard from "../../components/SignIn/MainCard.tsx";
import sesaLogoImg from '../../../public/assets/sesa_logo.svg';
import SesaBackground from '../../components/SignIn/SesaLogo.tsx';
import '../../index.css'

const SignInPage = () => {
    return (
        <div className="h-screen w-screen overflow-hidden relative flex flex-col">
            {/* Header con logo */}
            <header className="p-6 relative z-10">
                <div className="flex items-center gap-3">
                    <img src={sesaLogoImg} alt="Sesa Logo" className="w-10 h-10" />
                    <h1 className="text-2xl font-bold text-gray-800">SESA PROMO</h1>
                </div>
            </header>

            {/* Fondo dividido en diagonal */}
            <div className="absolute inset-0 -z-10">
                {/* Fondo color crema base */}
                <div className="absolute inset-0 bg-cream"></div>

                {/* Elemento diagonal con el SVG */}
                <div
                    className="absolute top-0 right-0 h-full w-3/4"
                    style={{
                        clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
                    }}
                >
                    {/* Contenedor para posicionar el círculo correctamente */}
                    <div className="relative w-full h-full overflow-hidden bg-cream-mid/10">
                        <div
                            className="absolute"
                            style={{
                                width: '110%',
                                height: '110%',
                                top: '50%',
                                right: '0',
                                transform: 'translate(10%, -50%)', // Cambiado de 35% a 10% para moverlo hacia la izquierda
                                opacity: 0.9
                            }}
                        >
                            <SesaBackground />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal - SignIn Card */}
            <main className="flex-1 flex items-center justify-center p-6 z-10">
                <SignInCard />
            </main>
        </div>
    );
};

export default SignInPage;