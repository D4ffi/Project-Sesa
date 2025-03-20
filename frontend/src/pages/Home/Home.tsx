import './Home.css'
import Navbar from "../../components/common/NavBar.tsx";
import HeroSection from "../../components/Home/HeroSection.tsx";
import Card from "../../components/common/card.tsx";


function Home() {
  return (
      <>
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