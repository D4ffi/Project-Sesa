import MonthlySalesCard from "../../components/Dashboard/MonthlySalesCard.tsx";
import Layout from "../../components/common/Layout.tsx";

const Dashboard = () => {

    return(
        <Layout title="Dashboard">
            <div>
                <MonthlySalesCard/>
            </div>
        </Layout>
    )

}

export default Dashboard;