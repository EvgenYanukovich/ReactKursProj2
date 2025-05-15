import { useState } from 'react';
import { Link } from 'react-router-dom';

// @ts-ignore
import image404 from '../../assets/images/404.png';
// Импортируем компоненты модального окна и формы поддержки
import Modal from '../../components/Modal';
import SupportForm from '../../components/SupportForm';

interface Site404Props {
    darkMode?: boolean;
}

const Site404 = ({ darkMode = false }: Site404Props) => {
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
    
    const openSupportModal = () => {
        setIsSupportModalOpen(true);
    };
    
    const closeSupportModal = () => {
        setIsSupportModalOpen(false);
    };
    return (
        <div className="flex flex-col items-center justify-center my-16 py-16">
            {/* Ошибка 404 с изображением собачки */}
            <div className="flex items-center justify-center mb-6">
                <h1 className="text-8xl font-bold">Ч</h1>
                <img 
                    src={image404} 
                    alt="404" 
                    className="w-32 h-32 mx-4" 
                />
                <h1 className="text-8xl font-bold">Ч</h1>
            </div>
            
            {/* Текст сообщения об ошибке */}
            <h2 className="text-4xl font-semibold mb-10">Страница не найдена</h2>
            
            {/* Кнопки навигации */}
            <div className="flex">
                <Link 
                    to="/" 
                    className="bg-primary text-white px-8 py-3 text-xl font-medium hover:bg-opacity-90 transition-all">
                    Вернуться на главную
                </Link>
                <button 
                    onClick={openSupportModal}
                    className={`bg-gray-200 px-8 py-3 text-xl font-medium ${darkMode ? 'text-white bg-gray-700' : 'text-dark'} hover:bg-opacity-90 transition-all`}>
                    Обратиться в поддержку
                </button>
                
                {/* Модальное окно с формой поддержки */}
                <Modal
                    isOpen={isSupportModalOpen}
                    onClose={closeSupportModal}
                    darkMode={darkMode}
                >
                    <SupportForm darkMode={darkMode} onClose={closeSupportModal} />
                </Modal>
            </div>
        </div>
    );
}

export default Site404;