import React from 'react';
import Navbar from "./NavBar.tsx";
import Footer from "./Footer.tsx";

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

const Layout: React.FC<LayoutProps> = ({
                                           children,
                                       }) => {
    return (
        <>
            {/* Meta tags for SEO */}


            {/* Main layout container */}
            <div className="min-h-screen flex flex-col">
                {/* Navbar - fixed at the top with the highest z-index */}
                <header className="sticky top-0 z-50 w-full">
                    <Navbar />
                </header>

                {/* Main content area - takes up all available space */}
                <main className="flex-grow w-full">
                    {children}
                </main>

                {/* Footer - always at the bottom */}
                <footer className="w-full bg-gray-800 text-white">
                    <Footer />
                </footer>
            </div>
        </>
    );
};

export default Layout;