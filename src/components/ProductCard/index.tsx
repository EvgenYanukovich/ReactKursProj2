import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

interface ProductCardProps {
    id: number;
    name: string;
    price: string[];
    heft: string[];
    images?: string[];
    discount?: number;
    isNew?: number;
    review?: Array<{
        score: string;
    }>;
    count?: number[];
    darkMode?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    heft,
    images,
    discount,
    isNew,
    review,
    darkMode = false
}) => {
    // Используем для навигации на страницу товара
    const navigate = useNavigate();
    // Состояние для выбранного варианта граммовки/штук
    const [selectedVariant, setSelectedVariant] = useState(0);
    
    // Используем контекст корзины
    const { addToCart, isInCart, getItemVariant } = useCart();
    
    // Формируем уникальный идентификатор товара с учётом выбранного варианта
    const variantId = `${id}-${selectedVariant}`;
    
    // Проверяем, находится ли товар с выбранным вариантом в корзине
    const inCart = isInCart(variantId);
    
    // Проверяем, есть ли в корзине другие варианты этого товара
    const existingVariant = getItemVariant(id);
    
    // Если в корзине есть другой вариант, устанавливаем его как выбранный
    useEffect(() => {
        if (existingVariant !== null && existingVariant !== selectedVariant) {
            setSelectedVariant(existingVariant);
        }
    }, [existingVariant]);
    // Функция для расчета средней оценки
    const calculateAverageRating = () => {
        if (!review || review.length === 0) return 0;
        
        const totalScore = review.reduce((acc, item) => {
            return acc + parseInt(item.score, 10);
        }, 0);
        
        return totalScore / review.length;
    };

    // Функция для расчета средней оценки
    // Отображение звездного рейтинга перемещено в основной рендер

    return (
        <div className={`product-card flex flex-col h-full ${darkMode ? 'bg-darkgray' : 'bg-white'} shadow-md rounded overflow-hidden ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {/* Изображение товара */}
            <div className="relative">
                <div 
                    className={`w-full p-2 cursor-pointer`}
                    onClick={() => navigate(`/product/${id}`)}
                >
                    <img 
                        src={images?.[0] || "https://via.placeholder.com/300x300"} 
                        alt={name} 
                        className="w-full h-48 object-contain mx-auto"
                    />
                </div>
                
                {/* Метки скидки и новинки */}
                {discount && discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                        -{discount}%
                    </span>
                )}
                
                {isNew === 1 && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs font-bold">
                        Новинка
                    </span>
                )}
            </div>
            
            {/* Информация о товаре */}
            <div className="flex-grow p-4">
                <div 
                    className="h-14 overflow-hidden mb-2 cursor-pointer" 
                    onClick={() => navigate(`/product/${id}`)}
                >
                    <h3 className="text-lg font-medium leading-tight hover:text-primary transition-colors">{name}</h3>
                </div>
                
                {/* Варианты веса/объема */}
                <div className="flex flex-wrap mb-3">
                    {heft.map((weight, idx) => (
                        <button 
                            key={idx} 
                            className={`mr-2 mb-2 px-3 py-1 text-sm rounded-sm cursor-pointer transition-colors ${idx === selectedVariant ? 'bg-primary text-white' : darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setSelectedVariant(idx)}
                        >
                            {weight}
                        </button>
                    ))}
                </div>
                
                {/* Рейтинг */}
                <div className="flex items-center">
                    <span className="text-primary text-lg mr-1">★</span>
                    <span className="text-sm">{calculateAverageRating().toFixed(1)}</span>
                    <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        ({review ? review.length : 0} отзывов)
                    </span>
                </div>
            </div>
            
            {/* Цена и кнопка */}
            <div className={`p-4 ${darkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <span className="text-2xl font-bold text-primary">{price[selectedVariant] || price[0]}</span>
                    </div>
                </div>
                
                <button 
                    className={`w-full py-2 transition-all ${inCart ? 'bg-green-600' : 'bg-primary'} text-white hover:brightness-110`}
                    onClick={() => {
                        if (!inCart) {
                            // Добавляем товар в корзину
                            const priceText = price[selectedVariant] || price[0];
                            const cartItem: CartItem = {
                                id: variantId, // Используем уникальный идентификатор для каждого варианта
                                productId: id, // Сохраняем исходный ID товара
                                title: name,
                                image: images?.[0] || "https://via.placeholder.com/300x300",
                                price: parseFloat(priceText.replace(/[^\d,.]/g, '').replace(',', '.')),
                                quantity: 1,
                                weight: heft[selectedVariant],
                                variant: selectedVariant,
                                rating: calculateAverageRating(),
                                reviewCount: review ? review.length : 0
                            };
                            addToCart(cartItem);
                        }
                    }}
                >
                    {inCart ? 'В корзине' : 'В корзину'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;