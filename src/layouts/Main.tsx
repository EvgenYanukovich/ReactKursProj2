import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const Main = () => {
    const { darkMode, toggleTheme } = useTheme();
    
    return (
        <>
            <Header darkMode={darkMode} toggleTheme={toggleTheme} />
            <main className={`mx-auto px-14 py-16 ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'}`}>
                <Outlet context={{ darkMode }} />
            </main>
            <Footer darkMode={darkMode} />
        </>
    )
};

export default Main;
