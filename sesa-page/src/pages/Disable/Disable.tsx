import { AlertTriangle } from 'lucide-react';
import Layout from "../../components/common/Layout.tsx";

const ErrorPage = () => {
    return (
        <Layout title="SESA PROMO">
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
                <div className="text-center max-w-md">
                    <AlertTriangle className="mx-auto h-24 w-24 text-yellow-500 mb-6" />
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">¡UPS!</h1>
                    <p className="text-xl text-gray-600 mb-4">
                        La página a la que quieres acceder está en mantenimiento.
                    </p>
                    <p className="text-lg text-gray-500">
                        Lamentamos las molestias.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-8 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700 cursor-pointer transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default ErrorPage;