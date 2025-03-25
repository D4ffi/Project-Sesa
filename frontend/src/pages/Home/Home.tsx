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
                <div className="flex flex-col items-center justify-center pt-20 pl-40 pr-40">
                    <h1 className="text-3xl font-bold text-gray-300">Sobre Nosotros</h1>
                    <p className="text-gray-500 pt-4"> Buscamos ser tu primera elección para mostrar tu marca en tus productos favoritos </p>
                </div>
                <div className=" flex pl-60 pb-40 pt-10">
                    <div className={""}>
                        <AboutCarousel/>
                    </div>
                    <div className="pl-30 pt-10 pr-100 text-gray-500">
                        <h2 className="text-2xl font-bold">Lorem Ipsum</h2>
                        <p className="pt-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae quam imperdiet, porttitor mi ac, tempus dui. Suspendisse et mi eu felis ullamcorper convallis ac ut orci. Mauris malesuada felis in risus eleifend lacinia. Sed nec gravida libero. Morbi est leo, elementum at erat sed, facilisis porttitor nisl. Fusce luctus pharetra aliquam. Nam commodo elit non feugiat porta.

                            Vestibulum dignissim arcu quis nisi aliquet, at blandit tortor pellentesque. Nunc id enim at nisi euismod lacinia. Nam velit massa, semper sit amet nisi ut, dictum pellentesque libero. Morbi feugiat consectetur sollicitudin. Etiam augue ante, euismod et nulla vitae, pharetra cursus odio. Ut iaculis odio erat, vulputate vulputate tortor vulputate nec. Nulla viverra, sem ut posuere interdum, neque mi vestibulum orci, non consequat mauris justo in tellus. Nam sagittis magna a dolor efficitur, in congue nibh laoreet. Vivamus rhoncus volutpat ipsum non dictum. Curabitur lacus orci, varius sed cursus sed, convallis ac ante. Phasellus pharetra tortor libero, vel dignissim nunc fringilla eu. Aliquam molestie urna id velit dapibus ullamcorper. Cras blandit est tortor. Ut tempus convallis dolor.

                        </p>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Home;