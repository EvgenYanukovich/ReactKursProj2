import React from 'react';

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
    // id параметр оставляем в интерфейсе, но не используем в деструктуризации, чтобы избежать предупреждения линтера
    name,
    price,
    heft,
    images,
    discount,
    isNew,
    review,
    darkMode = false
}) => {
    // Функция для расчета средней оценки
    const calculateAverageRating = () => {
        if (!review || review.length === 0) return 0;
        
        const totalScore = review.reduce((acc, item) => {
            return acc + parseInt(item.score, 10);
        }, 0);
        
        return totalScore / review.length;
    };

    // Функция для отображения звездного рейтинга
    const renderStarRating = (rating: number) => {
        return (
            <div className="flex items-center">
                <span className="text-primary text-lg mr-1">★</span>
                <span className="text-sm">{rating.toFixed(1)}</span>
                <span className="text-gray-400 text-xs ml-1">
                    ({review ? review.length : 0} отзывов)
                </span>
            </div>
        );
    };

    return (
        <div className={`product-card flex flex-col h-full ${darkMode ? 'bg-darkgray' : 'bg-white'} shadow-md rounded overflow-hidden`}>
            {/* Изображение товара */}
            <div className="relative">
                <img 
                    src={images?.[0] || "https://via.placeholder.com/300x300"} 
                    alt={name} 
                    className="w-full h-48 object-contain p-2"
                />
                
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
                <div className="h-14 overflow-hidden mb-2">
                    <h3 className="text-lg font-medium leading-tight">{name}</h3>
                </div>
                
                {/* Варианты веса/объема */}
                <div className="flex flex-wrap mb-3">
                    {heft.map((weight, idx) => (
                        <span 
                            key={idx} 
                            className={`mr-2 mb-2 px-2 py-1 text-sm rounded-sm ${idx === 0 ? 'bg-primary text-white' : `${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}`}
                        >
                            {weight}
                        </span>
                    ))}
                </div>
                
                {/* Рейтинг */}
                {renderStarRating(calculateAverageRating())}
            </div>
            
            {/* Цена и кнопка */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <span className="text-2xl font-bold text-primary">{price[0]}</span>
                    </div>
                </div>
                
                <button className="w-full bg-primary text-white py-2 hover:bg-opacity-90 transition-all">
                    В корзину
                </button>
            </div>
        </div>
    );
};

export default ProductCard;