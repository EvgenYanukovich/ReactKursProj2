import { Link } from 'react-router-dom';

// Импортируем изображения
// @ts-ignore
import logo from '../../assets/images/logo-footer.svg';
// @ts-ignore
import logoDark from '../../assets/images/logo-footer-dark.svg';
// @ts-ignore
import phoneIcon from '../../assets/images/phone.svg';
// @ts-ignore
import phoneDarkIcon from '../../assets/images/phone-dark.svg';
// @ts-ignore
import emailIcon from '../../assets/images/email.svg';
// @ts-ignore
import emailDarkIcon from '../../assets/images/email-dark.svg';
// @ts-ignore
import facebookIcon from '../../assets/images/facebook.svg';
// @ts-ignore
import instagramIcon from '../../assets/images/instagram.svg';
// @ts-ignore
import telegramIcon from '../../assets/images/telegram.svg';
// @ts-ignore
import youtubeIcon from '../../assets/images/youtube.svg';

interface FooterProps {
    darkMode: boolean;
}

const Footer = ({ darkMode }: FooterProps) => {
    return (
        <footer className={`px-14 py-24 ${darkMode ? 'bg-darkgray text-secondary' : 'bg-secondary text-dark'}`}>
            <div className="container mx-auto px-14">
                <div className="flex justify-between items-center">
                    {/* Левая часть с контактами */}
                    <div>
                        <h3 className="text-4xl font-bold mb-8">Контакты:</h3>
                        <div className="flex items-center mb-4">
                            <img src={darkMode ? phoneDarkIcon : phoneIcon} alt="Телефон" className="w-10 h-10 mr-6" />
                            <span className="text-3xl">+375 (29) 984-81-01</span>
                        </div>
                        <div className="flex items-center mb-12">
                            <img src={darkMode ? emailDarkIcon : emailIcon} alt="Email" className="w-10 h-10 mr-6" />
                            <span className="text-3xl">example@mail.com</span>
                        </div>
                        
                        <h3 className="text-4xl font-bold mb-8">Мы в соцсетях:</h3>
                        <div className="flex space-x-6">
                            <Link to="/404" className={`w-16 h-16 flex items-center justify-center rounded ${darkMode ? 'bg-white text-darkgray' : 'bg-white text-dark'}`}>
                                <img src={facebookIcon} alt="f" />
                            </Link>
                            <Link to="/404" className={`w-16 h-16 flex items-center justify-center rounded ${darkMode ? 'bg-white text-darkgray' : 'bg-white text-dark'}`}>
                                <img src={youtubeIcon} alt="y" />
                            </Link>
                            <Link to="/404" className={`w-16 h-16 flex items-center justify-center rounded ${darkMode ? 'bg-white text-darkgray' : 'bg-white text-dark'}`}>
                                <img src={telegramIcon} alt="t" />
                            </Link>
                            <Link to="/404" className={`w-16 h-16 flex items-center justify-center rounded ${darkMode ? 'bg-white text-darkgray' : 'bg-white text-dark'}`}>
                                <img src={instagramIcon} alt="i" />
                            </Link>
                        </div>
                    </div>
                    
                    {/* Правая часть с логотипом */}
                    <div>
                        <img src={darkMode ? logoDark : logo} alt="Fauna.by" className="h-42" style={{ height: '210px' }} />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;