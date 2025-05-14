import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Main = () => {
    return (
        <>
            <Header />
            <main className="container mx-auto px-14">
                <Outlet />
            </main>
            <Footer />
        </>
    )
};

export default Main;
