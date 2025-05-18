import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
// @ts-ignore
import supportImage from '../../assets/images/about/support.jpg';
// @ts-ignore
import logo from '../../assets/images/logo.svg';

// Импортируем компоненты модального окна и формы поддержки
import Modal from '../../components/Modal';
import SupportForm from '../../components/SupportForm';

interface FAQItem {
    question: string;
    answer: string;
    isOpen: boolean;
}

const AboutUs = () => {
    const { darkMode } = useTheme();
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
    
    const openSupportModal = () => {
        setIsSupportModalOpen(true);
    };
    
    const closeSupportModal = () => {
        setIsSupportModalOpen(false);
    };
    
    const [faqItems, setFaqItems] = useState<FAQItem[]>([
        {
            question: 'Когда придёт забитый трекномер?',
            answer: 'Трекномер отслеживается в течение 1-3 дней после отправки. Если вы не видите движение по трекномеру в этот срок, свяжитесь с нашей службой поддержки.',
            isOpen: false
        },
        {
            question: 'Как я могу отследить свой заказ?',
            answer: 'Вы можете отследить свой заказ через личный кабинет на сайте или по ссылке, которую мы отправили вам на email после оформления заказа.',
            isOpen: false
        },
        {
            question: 'Как вернуть товар?',
            answer: 'Вы можете вернуть товар в течение 14 дней с момента получения. Для этого заполните форму возврата в личном кабинете или свяжитесь с нашей службой поддержки.',
            isOpen: false
        },
        {
            question: 'Что делать, если товар пришёл повреждённым?',
            answer: 'В случае получения повреждённого товара, сделайте фотографии и свяжитесь с нашей службой поддержки в течение 24 часов после получения.',
            isOpen: false
        },
        {
            question: 'Есть ли у вас программа лояльности?',
            answer: 'Да, у нас есть программа лояльности. За каждую покупку вы получаете бонусные баллы, которые можно использовать для оплаты последующих заказов.',
            isOpen: false
        }
    ]);

    const toggleFaqItem = (index: number) => {
        setFaqItems(prevItems => 
            prevItems.map((item, i) => 
                i === index ? { ...item, isOpen: !item.isOpen } : item
            )
        );
    };

    return (
        <div className={`about-page ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'}`}>
            {/* Секция "О нас" */}
            <section className="py-16 text-center">
                <div className="container mx-auto px-4">
                    <img src={logo} alt="Fauna.by" className="h-20 mb-6 mx-auto" />
                    <h1 className="text-4xl font-bold mb-6">О нас</h1>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-lg mb-5">
                            Мы — добрый магазин, созданный с любовью к животным. 
                        </p>
                        <p className="mb-5">
                            У нас вы найдете все, что нужно для заботы о ваших питомцах.
                            Корма, игрушки, аксессуары, средства ухода, лекарства, 
                            материалы рабочей жизни и ветеринарные препараты.
                        </p>
                    </div>
                </div>
            </section>

            {/* Секция "Поддержка" */}
            <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-8">
                        <img src={supportImage} alt="Поддержка" className="w-64 h-64 object-cover rounded-lg mx-auto" />
                    </div>
                    <h2 className="text-3xl font-bold mb-5">Поддержка</h2>
                    <div className="max-w-3xl mx-auto">
                        <p className="mb-5">
                            Мы стремимся обеспечить лучший сервис покупателям.
                            Специалисты в контакт-центре могут ответить на ваши вопросы.
                            Просто свяжитесь с нами любым удобным для вас способом.
                        </p>
                    </div>
                </div>
            </section>

            {/* Секция "FAQ" */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-10 text-center">FAQ</h2>
                    <div className="max-w-3xl mx-auto">
                        {faqItems.map((item, index) => (
                            <div 
                                key={index} 
                                className={`mb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
                            >
                                <button 
                                    className="w-full text-left py-4 px-4 flex justify-between items-center focus:outline-none bg-primary text-white rounded-t"
                                    onClick={() => toggleFaqItem(index)}
                                >
                                    <span className="font-medium">{item.question}</span>
                                    <span className="transform transition-transform">
                                        {item.isOpen ? '−' : '+'}
                                    </span>
                                </button>
                                {item.isOpen && (
                                    <div className={`py-4 px-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                        <p>{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Секция "Контакты" */}
            <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-10">Контакты</h2>
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-6">
                            <p className="text-lg font-medium">
                                <a href="tel:+375291866121" className="block py-1">+375 (29) 186-61-21</a>
                                <a href="tel:+375291866122" className="block py-1">+375 (29) 186-61-22</a>
                            </p>
                        </div>
                        <div className="mb-6">
                            <p className="text-lg">
                                <a href="mailto:example@mail.com" className="block py-1">example@mail.com</a>
                            </p>
                        </div>
                        <div className="flex justify-center space-x-4 mb-8">
                            <a href="#" className="block w-8 h-8 bg-primary text-white flex items-center justify-center rounded">VK</a>
                            <a href="#" className="block w-8 h-8 bg-primary text-white flex items-center justify-center rounded">TG</a>
                            <a href="#" className="block w-8 h-8 bg-primary text-white flex items-center justify-center rounded">IG</a>
                            <a href="#" className="block w-8 h-8 bg-primary text-white flex items-center justify-center rounded">FB</a>
                        </div>
                        <div className="mb-6">
                            <p className="text-sm">
                                Если у вас возникли вопросы или трудности помощи, не стесняйтесь обращаться в нашу службу поддержки!
                            </p>
                        </div>
                        <button 
                            onClick={openSupportModal}
                            className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-opacity-90 transition"
                        >
                            Связаться с поддержкой
                        </button>
                        
                        {/* Модальное окно с формой поддержки */}
                        <Modal
                            isOpen={isSupportModalOpen}
                            onClose={closeSupportModal}
                            darkMode={darkMode}
                            titleText="Связь с поддержкой"
                        >
                            <SupportForm darkMode={darkMode} onClose={closeSupportModal} />
                        </Modal>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;