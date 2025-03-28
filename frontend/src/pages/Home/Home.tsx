import './Home.css'
import Layout from "../../components/common/Layout.tsx";
import HeroSection from "../../components/Hero/HeroSection.tsx";
import MiddleCard from "../../components/Hero/MiddleCard.tsx";
import MoreInfoCard from "../../components/Hero/MoreInfoCard.tsx";
import LeftCard from "../../components/Hero/LeftCard.tsx";
import { useEffect } from 'react';
import {scrollToHashSection, scrollToSection} from '../../utils/scrollUtils';
import AboutCarousel from "../../components/Hero/AboutCarousel.tsx";

function Home() {
    useEffect(() => {
        // First check for any stored scroll target in sessionStorage
        const storedScrollTarget = sessionStorage.getItem('scrollTarget');
        if (storedScrollTarget) {
            // Clear it immediately to prevent unwanted scrolls on future navigations
            sessionStorage.removeItem('scrollTarget');
            // Allow the page to render first, then scroll
            setTimeout(() => {
                scrollToSection(storedScrollTarget);
            }, 300);
        } else {
            // If no stored target, check for hash in URL
            scrollToHashSection();
        }
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Layout title="SESA PROMO - Artículos Promocionales">
                {/* Hero Section - Full viewport height */}
                <section aria-label="Hero Section" className="relative w-full h-screen">
                    <HeroSection/>
                </section>

                {/* Card section - Now positioned below the full-height hero */}
                <section aria-label="Card section" className="relative w-full py-16 px-4">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <div className="w-full md:w-1/3">
                                <LeftCard
                                    gradientFrom="from-blue-600"
                                    gradientTo="to-blue-700"
                                    title={"Todo para tu negocio"}
                                    paragraph1={"tenemos a tu disposición desde ropa"}
                                    paragraph2={"articulos de oficina, tazas, bolsas y más"}/>
                            </div>

                            <div className="w-full md:w-1/3">
                                <MiddleCard/>
                            </div>

                            <div className="w-full md:w-1/3">
                                <MoreInfoCard
                                    gradientFrom={"from-purple-500"}
                                    gradientTo={"to-purple-600"}
                                    textColor={"text-white"}
                                    title={"Contactanos"}
                                    paragraph1={"Tenemos el producto para ti y sino ¡Lo conseguimos!"}
                                    paragraph2={"Mas informacion"}/>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Us section */}
                <section id="about-us" aria-label="About Us" className="w-full pt-30 pb-60">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center justify-center pb-10">
                            <h1 className="text-3xl font-bold text-gray-700">Sobre Nosotros</h1>
                            <p className="text-gray-500 pt-4 text-center max-w-2xl">
                                Buscamos ser tu primera elección para mostrar tu marca en tus productos favoritos
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                            <div className="w-full md:w-2/5">
                                <AboutCarousel/>
                            </div>
                            <div className="w-full md:w-3/5 pt-4 md:pt-10 text-gray-500">
                                <h2 className="text-2xl font-bold">Lorem Ipsum</h2>
                                <p className="pt-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae quam imperdiet, porttitor mi ac, tempus dui. Suspendisse et mi eu felis ullamcorper convallis ac ut orci. Mauris malesuada felis in risus eleifend lacinia. Sed nec gravida libero. Morbi est leo, elementum at erat sed, facilisis porttitor nisl. Fusce luctus pharetra aliquam. Nam commodo elit non feugiat porta.
                                </p>
                                <p className="pt-4">
                                    Vestibulum dignissim arcu quis nisi aliquet, at blandit tortor pellentesque. Nunc id enim at nisi euismod lacinia. Nam velit massa, semper sit amet nisi ut, dictum pellentesque libero. Morbi feugiat consectetur sollicitudin. Etiam augue ante, euismod et nulla vitae, pharetra cursus odio. Ut iaculis odio erat, vulputate vulputate tortor vulputate nec.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </div>
    )
}

export default Home;