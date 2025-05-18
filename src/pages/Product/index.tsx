import { useState, useEffect } from 'react'; // стандартный импорт React не нужен для JSX
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import productsData from '../../data/cards.json';
import Modal from '../../components/Modal';

// Используем Record для совместимости с типами useParams
type ProductParams = {
    id: string;
};

const Product = () => {
    const { darkMode } = useTheme();
    const { id } = useParams<ProductParams>();
    const { addToCart, isInCart, updateQuantity } = useCart();
    
    // Состояния товара
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [selectedVariant, setSelectedVariant] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [mainImage, setMainImage] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'reviews' | 'characteristics'>('reviews');

    // Состояния модального окна с формой отзыва
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
    const [reviewName, setReviewName] = useState<string>('');
    const [reviewText, setReviewText] = useState<string>('');
    const [reviewRating, setReviewRating] = useState<number>(5);
    
    // Генерируем уникальный ID для товара с учетом варианта
    const productVariantId = product ? `${product.id}-${selectedVariant}` : '';
    const inCart = isInCart(productVariantId);
    
    // Загрузка данных товара
    useEffect(() => {
        setLoading(true);
        try {
            // В реальном приложении здесь был бы API запрос
            // Находим товар по ID в локальных данных
            const parsedId = parseInt(id || '0', 10);
            const foundProduct = productsData.find(p => p.id === parsedId);
            
            if (foundProduct) {
                setProduct(foundProduct);
                setMainImage(foundProduct.images?.[0] || '');
            } else {
                setError('Товар не найден');
            }
        } catch (err) {
            setError('Ошибка при загрузке товара');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);
    
    // Обработка добавления в корзину
    const handleAddToCart = () => {
        if (!product) return;
        
        if (inCart) {
            // Если товар уже есть в корзине, обновляем его количество
            updateQuantity(productVariantId, quantity);
        } else {
            // Добавляем новый товар
            addToCart({
                id: productVariantId,
                productId: product.id,
                title: product.name,
                image: mainImage || product.images?.[0] || '',
                price: parseFloat(product.price[selectedVariant]),
                quantity,
                weight: product.heft[selectedVariant],
                variant: selectedVariant,
                rating: product.review ? parseFloat(product.review[0]?.score || "0") : 0,
                reviewCount: product.review?.length || 0
            });
        }
    };
    
    // Обработка изменения варианта товара
    const handleVariantChange = (index: number) => {
        setSelectedVariant(index);
    };
    
    // Обработка изменения количества
    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
    
    // Изменение главного изображения
    const changeMainImage = (image: string) => {
        setMainImage(image);
    };
    
    // Форматирование отображения цены
    const formatPrice = (price: string) => {
        const numPrice = parseFloat(price);
        return numPrice.toFixed(2).replace('.', ',');
    };
    
    // Если загрузка данных
    if (loading) {
        return (
            <div className={`py-16 ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'}`}>
                <div className="container mx-auto px-4 text-center">
                    <p className="text-xl">Загрузка товара...</p>
                </div>
            </div>
        );
    }
    
    // Если ошибка
    if (error || !product) {
        return (
            <div className={`py-16 ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'}`}>
                <div className="container mx-auto px-4 text-center">
                    <p className="text-xl text-red-500">{error || 'Товар не найден'}</p>
                    <Link to="/catalog" className="mt-6 inline-block px-6 py-3 bg-primary text-white text-lg font-medium hover:bg-opacity-90 transition-colors">
                        Вернуться в каталог
                    </Link>
                </div>
            </div>
        );
    }
    
    // Расчет средней оценки
    const averageRating = product.review 
        ? product.review.reduce((acc: number, item: any) => acc + parseInt(item.score, 10), 0) / product.review.length 
        : 0;
        
    return (
        <div className={`py-8 ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'}`}>
            <div className="container mx-auto px-4">
                {/* Хлебные крошки */}
                <div className="flex text-xs text-gray-500 mb-4">
                    <Link to="/" className="hover:text-primary">Главная</Link>
                    <span className="mx-1">&#8250;</span>
                    <Link to="/catalog" className="hover:text-primary">Каталог</Link>
                    {product.category && (
                    <>
                        <span className="mx-1">&#8250;</span>
                        <Link to={`/catalog/${product.category}`} className="hover:text-primary">{product.category}</Link>
                    </>
                    )}
                    <span className="mx-1">&#8250;</span>
                    <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Галерея изображений */}
                    <div className="md:w-1/2 max-w-md">
                        {/* Кнопки навигации лево/право */}
                        <div className="relative">
                            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md z-10">
                                <span className="text-2xl font-bold text-black">&lt;</span>
                            </button>
                            
                            <div className="mb-4 aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-4 border border-gray-200">
                                <img 
                                    src={mainImage || product.images?.[0] || ''} 
                                    alt={product.name} 
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            
                            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md z-10">
                                <span className="text-2xl font-bold text-black">&gt;</span>
                            </button>
                        </div>
                        
                        {/* Миниатюры */}
                        {product.images && product.images.length > 0 && (
                            <div className="flex gap-3 justify-center">
                                {product.images.map((img: string, idx: number) => (
                                    <div 
                                        key={idx} 
                                        className={`w-16 h-16 flex-shrink-0 border cursor-pointer ${mainImage === img ? 'border-primary border-2' : 'border-gray-200'}`}
                                        onClick={() => changeMainImage(img)}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`${product.name}-${idx}`} 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Информация о товаре */}
                    <div className="md:w-1/2">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                            
                            {/* Описание — как на макете */}
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                {product.description || 'Профессиональный корм для кошек с чувствительным пищеварением'}
                            </p>
                            
                            {/* Характеристики */}
                            <div className="mb-4 py-2 border-t border-b border-gray-200">
                                <h3 className="text-sm font-bold mb-2">Характеристики:</h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                    <div className="text-gray-600">Категория:</div>
                                    <div>{product.category || 'Корма'}</div>
                                    
                                    <div className="text-gray-600">Бренд:</div>
                                    <div>{product.brand || 'Little One'}</div>
                                    
                                    <div className="text-gray-600">Фасовка:</div>
                                    <div>{product.heft[selectedVariant]}</div>
                                    
                                    <div className="text-gray-600">Назначение:</div>
                                    <div>Корма</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Рейтинг и отзывы */}
                        <div className="flex items-center mb-4">
                            <div className="flex items-center text-yellow-400 mr-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className={`text-sm ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-xs text-gray-600">
                                {averageRating.toFixed(1)} ({product.review?.length || 0} отзывов)
                            </span>
                        </div>
                        
                        {/* Выбор варианта в виде кнопок */}
                        {product.heft && product.heft.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap">
                                    {product.heft.length === 1 ? (
                                        <div className="text-xs inline-block px-3 py-2 bg-gray-100 text-gray-800 mr-2 mb-2">
                                            {product.heft[0]}
                                        </div>
                                    ) : product.heft.map((heft: string, idx: number) => (
                                        <button
                                            key={idx}
                                            className={`text-xs mr-2 mb-2 px-3 py-1 border ${selectedVariant === idx 
                                                ? 'bg-primary text-white' 
                                                : 'bg-gray-100 text-gray-800 hover:border-primary'}`}
                                            onClick={() => handleVariantChange(idx)}
                                        >
                                            {heft}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Цена */}
                        <div className="text-3xl font-bold mb-5 mt-3">
                            <span className="text-[26px]">{formatPrice(product.price[selectedVariant])}</span> руб.
                            {product.discount && (
                                <span className="ml-3 text-lg line-through text-gray-500">
                                    {formatPrice((parseFloat(product.price[selectedVariant]) * (1 + product.discount/100)).toFixed(2))} руб.
                                </span>
                            )}
                        </div>
                        
                        {/* Количество и добавление в корзину */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                            {/* Кнопки количества */}
                            <div className="flex border border-gray-300 rounded-md max-w-[150px]">
                                <button 
                                    onClick={decreaseQuantity}
                                    className="px-3 py-2 text-lg border-r border-gray-300"
                                >
                                    –
                                </button>
                                <span className="flex-1 flex items-center justify-center px-3 py-2 text-md">{quantity}</span>
                                <button 
                                    onClick={increaseQuantity}
                                    className="px-3 py-2 text-lg border-l border-gray-300"
                                >
                                    +
                                </button>
                            </div>
                            
                            {/* Кнопка в корзину */}
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-primary text-white rounded-md px-6 py-2 font-medium hover:bg-opacity-90 transition-colors"
                            >
                                В корзину
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Модальное окно с формой для отзыва */}
                <Modal 
                    isOpen={isReviewModalOpen} 
                    onClose={() => setIsReviewModalOpen(false)}
                    titleText="Оставить отзыв"
                    darkMode={darkMode}
                >
                    <div className="p-4">
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            // Здесь была бы логика отправки отзыва на сервер
                            console.log('Review submitted', { reviewName, reviewText, reviewRating });
                            // Добавляем отзыв локально (для демо)
                            if (product.review) {
                                const newReviews = [...product.review, {
                                    author: reviewName,
                                    text: reviewText,
                                    score: reviewRating.toString()
                                }];
                                setProduct({...product, review: newReviews});
                            }
                            // Очищаем форму и закрываем модальное окно
                            setReviewName('');
                            setReviewText('');
                            setReviewRating(5);
                            setIsReviewModalOpen(false);
                        }}>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="name">Ваше имя</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={reviewName}
                                    onChange={(e) => setReviewName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="text">Ваш отзыв</label>
                                <textarea 
                                    id="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Оценка</label>
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            type="button"
                                            className="text-2xl focus:outline-none"
                                            onClick={() => setReviewRating(star)}
                                        >
                                            <span className={star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4">
                                <button 
                                    type="button" 
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                    onClick={() => setIsReviewModalOpen(false)}
                                >
                                    Отмена
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                                >
                                    Отправить
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
                
                {/* Табы с отзывами и характеристиками */}
                <div className="mt-10 mb-10">
                    {/* Переключатели табов */}
                    <div className="flex border-b border-gray-200 mb-8">
                        <button 
                            className={`py-3 px-6 text-lg font-medium ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Отзывы
                        </button>
                        <button 
                            className={`py-3 px-6 text-lg font-medium ${activeTab === 'characteristics' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('characteristics')}
                        >
                            Характеристики
                        </button>
                    </div>
                    
                    {/* Содержимое таба с отзывами */}
                    {activeTab === 'reviews' && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {product.review?.map((review: any, idx: number) => (
                                    <div key={idx} className="bg-primary text-white p-4 rounded-md">
                                        <div className="flex items-start mb-3">
                                            <div className="mr-3">
                                                <div className="w-14 h-14 bg-white rounded-full overflow-hidden">
                                                    <img 
                                                        src={`https://i.pravatar.cc/150?img=${idx + 10}`} 
                                                        alt="Аватар" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">
                                                    {review.author || `Пользователь ${idx + 1}`}
                                                </h3>
                                                <div className="flex mt-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <span key={i} className={`text-lg ${i < parseInt(review.score) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm">
                                            {review.text || `Отличный товар! Мой питомец в восторге. Советую всем покупать.`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {/* Кнопка показать еще */}
                            <div className="mt-6 flex justify-center gap-4">
                                <button className="bg-white border border-primary text-primary px-6 py-2 rounded hover:bg-gray-50">
                                    Показать еще
                                </button>
                                <button 
                                    onClick={() => setIsReviewModalOpen(true)}
                                    className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90"
                                >
                                    Оставить отзыв
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Содержимое таба с полными характеристиками */}
                    {activeTab === 'characteristics' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-bold mb-4">Подробные характеристики</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Категория:</span>
                                        <span>{product.category || 'Корма'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Бренд:</span>
                                        <span>{product.brand || 'Little One'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Фасовка:</span>
                                        <span>{product.heft[selectedVariant]}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Вес/кол-во в 1 упаковке:</span>
                                        <span>{product.heft[selectedVariant]}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Назначение:</span>
                                        <span>Корма</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Страна производитель:</span>
                                        <span>Россия</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Срок годности:</span>
                                        <span>12 месяцев</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-4">Дополнительная информация</h3>
                                <div className="space-y-2 text-gray-600">
                                    <p>Хранить в сухом прохладном месте.</p>
                                    <p>После вскрытия упаковки хранить в плотно закрытой таре.</p>
                                    <p>Перед применением ознакомьтесь с инструкцией на упаковке.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Product;