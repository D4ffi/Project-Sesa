import './Home.css'
import Navbar from "../../components/common/NavBar.tsx";
import HeroSection from "../../components/Hero/HeroSection.tsx";
import MiddleCard from "../../components/Hero/MiddleCard.tsx";
import MoreInfoCard from "../../components/Hero/MoreInfoCard.tsx";
import LeftCard from "../../components/Hero/LeftCard.tsx";


function Home() {
    return (
        <>
            <title>Sesa | Home</title>
            <Navbar/>
            <HeroSection/>
            <div className="flex pt-20 pl-40 pr-40 pb-40 justify-between">
                <LeftCard
                gradientFrom="from-blue-500"
                gradientTo="to-blue-600"
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
        </>
    )
}

export default Home;