import './Home.css'
import SignInCard from "../../components/SignIn/MainCard.tsx";

function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
            <SignInCard/>
        </div>
    )
}

export default Home;