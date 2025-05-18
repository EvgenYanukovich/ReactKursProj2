import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/CartItem';
import Modal from '../../components/Modal';
import { useHistoryOrders } from '../../context/HistoryContext';

// Не нужно здесь определять интерфейс CartItemType, 
// так как мы уже импортируем его из контекста корзины

const Cart = () => {
    const { darkMode } = useTheme();
    const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
    const { addOrder } = useHistoryOrders();
    
    // Состояние для управления слайдером и модальным окном
    const [isLoading, setIsLoading] = useState(false);
    const [slidesToShow, setSlidesToShow] = useState(4);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    
    // Адаптивное количество карточек в зависимости от ширины экрана
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setSlidesToShow(1);
            } else if (window.innerWidth < 768) {
                setSlidesToShow(2);
            } else if (window.innerWidth < 1024) {
                setSlidesToShow(3);
            } else {
                setSlidesToShow(4);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    // Ресет текущего слайда при изменении количества товаров в корзине
    useEffect(() => {
        setCurrentSlide(0);
    }, [cartItems.length]);
    
    // Функции для управления слайдером
    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        
        const totalSlides = Math.ceil(cartItems.length / slidesToShow);
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };
    
    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        
        const totalSlides = Math.ceil(cartItems.length / slidesToShow);
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };
    
    // Функция изменения количества товара - теперь используем из контекста
    const handleQuantityChange = (id: string | number, newQuantity: number) => {
        updateQuantity(id, newQuantity);
    };
    
    // Функция удаления товара из корзины - теперь используем из контекста
    const handleRemoveItem = (id: string | number) => {
        removeFromCart(id);
    };
    
    // Расчет общей стоимости корзины
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };
    
    // Форматирование цены
    const formatPrice = (price: number) => {
        return price.toFixed(2).replace('.', ',');
    };
    
    // Обработчик оформления заказа
    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        // Формируем заказ
        const now = new Date();
        const order = {
            id: `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}${now.getTime()}`,
            date: `${now.getDate().toString().padStart(2,'0')}.${(now.getMonth()+1).toString().padStart(2,'0')}.${now.getFullYear()}`,
            products: cartItems.map(item => ({ ...item })),
            totalAmount: calculateTotal()
        };
        addOrder(order);
        setIsModalOpen(true);
        clearCart();
    };
    
    // Используем состояние загрузки при необходимости
    useEffect(() => {
        if (cartItems.length === 0) {
            setIsLoading(false);
        }
    }, [cartItems]);
    
    // Закрытие модального окна и очистка корзины
    const handleModalClose = () => {
        setIsModalOpen(false);
        clearCart();
    };
    
    return (
        <div className={` py-8 ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Корзина</h1>
                    
                    {cartItems.length > 0 && (
                        <button 
                            onClick={handleCheckout}
                            className="px-6 py-3 bg-primary text-white text-lg font-medium hover:bg-opacity-90 transition-colors"
                        >
                            Оформить заказ
                        </button>
                    )}
                </div>
                
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-xl">Загрузка корзины...</p>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl mb-6">Ваша корзина пуста</p>
                        <Link 
                            to="/catalog" 
                            className="px-6 py-3 bg-primary text-white text-lg font-medium hover:bg-opacity-90 transition-colors"
                        >
                            Перейти в каталог
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Контейнер с кнопками навигации и слайдером */}
                        <div className="relative py-4 mb-8">
                            {/* Стрелка влево */}
                            <button 
                                onClick={prevSlide}
                                className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 ${darkMode ? 'text-black' : 'text-black'} bg-white shadow-md rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform`}
                                aria-label="Предыдущий слайд"
                            >
                                <span className="text-2xl">❮</span>
                            </button>
                            
                            {/* Слайдер */}
                            <div className="px-14 overflow-hidden" ref={sliderRef}>
                                <div 
                                    className="flex transition-transform duration-500 ease-in-out" 
                                    style={{ transform: `translateX(${-currentSlide * 100}%)` }}
                                >
                                    {cartItems.map(item => (
                                        <div 
                                            key={item.id} 
                                            className="px-3 flex-shrink-0"
                                            style={{ flex: `0 0 ${100 / slidesToShow}%` }}
                                        >
                                            <CartItem 
                                                id={item.id}
                                                title={item.title}
                                                image={item.image}
                                                price={item.price}
                                                quantity={item.quantity}
                                                weight={item.weight}
                                                variant={item.variant}
                                                rating={item.rating}
                                                reviewCount={item.reviewCount}
                                                onQuantityChange={handleQuantityChange}
                                                onRemove={handleRemoveItem}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Стрелка вправо */}
                            <button 
                                onClick={nextSlide}
                                className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 ${darkMode ? 'text-black' : 'text-black'} bg-white shadow-md rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform`}
                                aria-label="Следующий слайд"
                            >
                                <span className="text-2xl">❯</span>
                            </button>
                        </div>
                        
                        <div className="mb-8">
                            <p className="text-3xl font-bold">
                                Итого: {formatPrice(calculateTotal())} руб.
                            </p>
                        </div>
                        {/* Модальное окно об успешном заказе */}
                        <Modal 
                            isOpen={isModalOpen} 
                            onClose={handleModalClose}
                            titleText="Заказ оформлен!"
                            darkMode={darkMode}
                        >
                            <div className="p-6 text-center">
                                <div className="text-6xl mb-4">✅</div>
                                <p className="text-xl mb-4">Ваш заказ успешно оформлен!</p>
                                <p className="mb-6">Спасибо за покупку! Наш менеджер свяжется с вами в ближайшее время для подтверждения.</p>
                                <button 
                                    onClick={handleModalClose}
                                    className="px-6 py-2 bg-primary text-white font-medium rounded hover:bg-opacity-90 transition-colors"
                                >
                                    Закрыть
                                </button>
                            </div>
                        </Modal>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;