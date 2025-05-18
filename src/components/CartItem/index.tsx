import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface CartItemProps {
    id: string | number;
    title: string;
    image: string;
    price: number;
    quantity: number;
    weight?: string;
    variant?: number;
    rating?: number;
    reviewCount?: number;
    onRemove: (id: string | number) => void;
    onQuantityChange: (id: string | number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
    id, 
    title, 
    image, 
    price, 
    quantity, 
    weight,
    rating,
    reviewCount,
    onRemove, 
    onQuantityChange 
}) => {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    
    // Получаем productId из id для перехода на страницу товара
    const productId = typeof id === 'string' ? id.split('-')[0] : id;
    
    const handleIncrement = () => {
        onQuantityChange(id, quantity + 1);
    };
    
    const handleDecrement = () => {
        if (quantity > 1) {
            onQuantityChange(id, quantity - 1);
        }
    };
    
    const handleRemove = () => {
        onRemove(id);
    };
    
    const formatPrice = (price: number) => {
        return price.toFixed(2).replace('.', ',');
    };

    return (
        <div className={`cart-item relative h-full flex flex-col ${darkMode ? 'text-white bg-darkgray' : 'text-dark bg-white'}`}>
            {/* Изображение товара */}
            <div 
                className="relative flex justify-center items-center mb-4 h-40 p-2 cursor-pointer"
                onClick={() => navigate(`/product/${productId}`)}
            >
                <img src={image} alt={title} className="max-h-full max-w-full object-contain" />
            </div>
            
            {/* Рейтинг */}
            {rating && (
                <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-yellow-500">{rating.toFixed(1)}</span>
                    {reviewCount && (
                        <span className="text-gray-500 text-sm ml-1">({reviewCount} {reviewCount === 1 ? 'отзыв' : 
                            reviewCount > 1 && reviewCount < 5 ? 'отзыва' : 'отзывов'})</span>
                    )}
                </div>
            )}
            
            <div className="flex-grow p-4 pt-0">
                <h3 
                    className="text-lg font-medium mb-1 min-h-[50px] line-clamp-2 cursor-pointer hover:text-primary transition-colors" 
                    onClick={() => navigate(`/product/${productId}`)}
                >{title}</h3>
                
                {/* Вес/объем, если есть */}
                {weight && <div className="text-primary text-sm mb-2">{weight}</div>}
                
                {/* Цена */}
                <div className="text-xl font-bold mt-auto mb-3">
                    {formatPrice(price)} р.
                </div>
            </div>
            
            {/* Кнопки управления количеством */}
            <div className="flex items-center bg-primary">
                <button 
                    className="px-4 py-2 text-white text-xl flex-1 border-r border-white border-opacity-20" 
                    onClick={handleDecrement}
                >
                    —
                </button>
                <span className="px-4 py-2 text-xl text-white flex-1 text-center">{quantity}</span>
                <button 
                    className="px-4 py-2 text-white text-xl flex-1 border-l border-white border-opacity-20" 
                    onClick={handleIncrement}
                >
                    +
                </button>
                <button 
                    className="px-3 py-2 bg-primary text-white ml-2" 
                    onClick={handleRemove}
                >
                    <span className="inline-block">🗑️</span>
                </button>
            </div>
        </div>
    );
};

export default CartItem;
