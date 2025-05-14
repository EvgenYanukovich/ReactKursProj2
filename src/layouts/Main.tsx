import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Main = () => {
    const [darkMode, setDarkMode] = useState(false);
    
    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };
    
    return (
        <>
            <Header darkMode={darkMode} toggleTheme={toggleTheme} />
            <main className={`mx-auto px-14 ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'} min-h-screen`}>
                <Outlet />
            </main>
            <Footer darkMode={darkMode} />
        </>
    )
};

export default Main;
