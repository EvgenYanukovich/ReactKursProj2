
import { Link } from 'react-router-dom';

// Импортируем изображения
// @ts-ignore
import logo from '../../assets/images/logo.svg';
// @ts-ignore
import searchIcon from '../../assets/images/search-icon.svg';
// @ts-ignore
import phoneIcon from '../../assets/images/phone.svg';
// @ts-ignore
import phoneDarkIcon from '../../assets/images/phone-dark.svg';
// @ts-ignore
import emailIcon from '../../assets/images/email.svg';
// @ts-ignore
import emailDarkIcon from '../../assets/images/email-dark.svg';
// @ts-ignore
import cartIcon from '../../assets/images/cart.svg';
// @ts-ignore
import userIcon from '../../assets/images/user.svg';

interface HeaderProps {
    darkMode: boolean;
    toggleTheme: () => void;
}

const Header = ({ darkMode, toggleTheme }: HeaderProps) => {
    const searchText = () => {
        console.log('Поиск');
    };

    return (
        <header className={`w-full shadow-sm px-14 ${darkMode ? 'bg-darkgray text-white' : 'bg-white text-dark'}`}>
            {/* Верхняя часть хедера с логотипом, поиском и контактами */}
            <div className={`container mx-auto px-14 py-4 flex justify-between items-center ${darkMode ? 'bg-darkgray' : ''}`}>
                {/* Левая часть: логотип */}
                <Link to="/" className="flex items-center mr-10">
                    <img src={logo} alt="Fauna.by" className="h-14 min-h-24 min-w-64" />
                </Link>

                {/* Центральная часть: поиск */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Поиск"
                            className={`w-full h-12 pl-6 pr-14 text-lg ${darkMode ? 'border border-primary bg-darkgray text-white' : 'bg-white border border-dark text-dark'}`}
                        />
                        <button 
                            className="absolute right-0 top-0 h-full bg-primary px-5 flex items-center justify-center hover:bg-opacity-80"
                            onClick={searchText}
                        >
                            <img src={searchIcon} alt="Поиск" className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Правая часть: контакты */}
                <div className={`flex items-center ml-10 gap-8 ${darkMode ? 'text-white' : 'text-dark'}`}>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center justify-end mb-2">
                            <img src={darkMode ? phoneDarkIcon : phoneIcon} alt="Телефон" className="w-5 h-5 mr-3" />
                            <span className="text-lg font-medium">+375 (29) 984-81-01</span>
                        </div>
                        <div className="flex items-center justify-end">
                            <img src={darkMode ? emailDarkIcon : emailIcon} alt="Email" className="w-5 h-5 mr-3" />
                            <span className="text-lg">example@mail.com</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Навигационное меню */}
            <div className={`container mx-auto px-14 py-4 flex justify-between items-center ${darkMode ? 'bg-darkgray' : ''}`}>
                <nav className="flex-1">
                    <ul className="flex justify-start">
                        <li>
                            <Link to="/catalog" className="block py-4 px-10 bg-primary text-white text-xl font-medium hover:opacity-80 transition-colors">Кошкам</Link>
                        </li>
                        <li>
                            <Link to="/catalog" className="block py-4 px-9 bg-primary text-white text-xl font-medium hover:opacity-80 transition-colors">Собакам</Link>
                        </li>
                        <li>
                            <Link to="/catalog" className="block py-4 px-10 bg-primary text-white text-xl font-medium hover:opacity-80 transition-colors">Рыбам</Link>
                        </li>
                        <li>
                            <Link to="/catalog" className="block py-4 px-9 bg-primary text-white text-xl font-medium hover:opacity-80 transition-colors">Грызунам</Link>
                        </li>
                        <li>
                            <Link to="/catalog" className="block py-4 px-10 bg-primary text-white text-xl font-medium hover:opacity-80 transition-colors">Птицам</Link>
                        </li>
                        <li>
                            <Link to="/catalog" className="block py-4 px-9 bg-primary text-white text-xl font-medium hover:opacity-80 transition-colors">Ветаптека</Link>
                        </li>
                        <li>
                            <Link to="/catalog" className="block py-4 px-10 bg-primary text-white text-xl font-medium hover:opacity-80 transition-colors">От паразитов</Link>
                        </li>
                    </ul>
                </nav>
                
                {/* Переключатель темы */}
                <div className="px-4 flex items-center justify-center">
                    <button 
                        onClick={toggleTheme}
                        className="w-16 h-8 bg-gray-200 rounded-full p-1 flex items-center cursor-pointer"
                    >
                        <div 
                            className={`w-6 h-6 rounded-full transition-transform duration-300 bg-primary transform ${darkMode ? 'translate-x-8' : 'translate-x-0 '}`}
                        ></div>
                    </button>
                </div>
                <div className="flex items-center space-x-6 ml-5">
                    <Link to="/cart" className={darkMode ? "text-white" : "text-primary"}>
                        <img src={cartIcon} alt="Корзина" className="w-8 h-8" />
                    </Link>
                    <Link to="/account" className={darkMode ? "text-white" : "text-primary"}>
                        <img src={userIcon} alt="Личный кабинет" className="w-8 h-8" />
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;