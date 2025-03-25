import './Home.css'
import Layout from "../../components/common/Layout.tsx";
import HeroSection from "../../components/Hero/HeroSection.tsx";
import MiddleCard from "../../components/Hero/MiddleCard.tsx";
import MoreInfoCard from "../../components/Hero/MoreInfoCard.tsx";
import LeftCard from "../../components/Hero/LeftCard.tsx";
import { useEffect } from 'react';
import {scrollToHashSection, scrollToSection} from '../../utils/scrollUtils';

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
        <Layout title="Home">
            <section aria-label="Hero Section">
                <HeroSection/>
            </section>

            <section aria-label={"Card section"}>
                <div className="flex pt-20 pl-40 pr-40 pb-40 ">
                    <LeftCard
                        gradientFrom="from-blue-600"
                        gradientTo="to-blue-700"
                        title={"Todo para tu negocio"}
                        paragraph1={"tenemos a tu disposición desde ropa"}
                        paragraph2={"articulos de oficina, tazas, bolsas y más"}/>

                    <MiddleCard/>
                    <MoreInfoCard
                        gradientFrom={"from-purple-500"}
                        gradientTo={"to-purple-600"}
                        textColor={"text-white"}
                        title={"Contactanos"}
                        paragraph1={"Tenemos el producto para ti y sino ¡Lo conseguimos!"}
                        paragraph2={"Mas informacion"}/>
                </div>
            </section>

            <section id="about-us" aria-label={"About Us"}>
                <div className="flex flex-col items-center justify-center pt-20 pl-40 pr-40 pb-40">
                    <h1 className="text-3xl font-bold text-gray-300">Sobre Nosotros</h1>
                    <p className="text-gray-500 pt-4">Somos una empresa dedicada a la venta de productos promocionales </p>
                </div>
            </section>
        </Layout>
    )
}

export default Home;