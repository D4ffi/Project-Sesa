import './Home.css'
import Navbar from "../../components/common/NavBar.tsx";
import HeroSection from "../../components/Hero/HeroSection.tsx";
import Card from "../../components/common/card.tsx";


function Home() {
  return (
      <>
          <title>Sesa | Home</title>
          <Navbar/>
          <HeroSection/>
          <div className="flex p-20 justify-between">
                <Card/>
                <Card/>
                <Card/>
          </div>
      </>
  )
}

export default Home