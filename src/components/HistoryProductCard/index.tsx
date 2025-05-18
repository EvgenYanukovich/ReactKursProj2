import React from "react";
import type { Order } from "../../context/HistoryContext";
import { useNavigate } from 'react-router-dom';

interface HistoryProductCardProps {
    product: Order["products"][number];
    onRepeat: () => void;
    onRemove: () => void;
    darkMode?: boolean;
}

const HistoryProductCard: React.FC<HistoryProductCardProps> = ({
    product,
    onRepeat,
    onRemove,
    darkMode = false
}) => {
    const navigate = useNavigate();
    const productId = product.productId;
    return (
        <div className={`w-full max-w-2xl flex flex-row gap-6 rounded-lg shadow-md mb-6 ${darkMode ? "bg-darkgray text-white" : "bg-white text-dark"}`}>
            <div 
                className="flex items-center justify-center min-w-[120px] w-40 h-40 bg-gray-50 rounded-lg cursor-pointer" 
                onClick={() => navigate(`/product/${productId}`)}
            >
                <img src={product.image} alt={product.title} className="max-h-36 max-w-full object-contain" />
            </div>
            <div className="flex-1 flex flex-col justify-between py-4">
                <div>
                    <div 
                        className="text-lg font-bold mb-1 cursor-pointer hover:text-primary transition-colors" 
                        onClick={() => navigate(`/product/${productId}`)}
                    >{product.title}</div>
                    <div className="text-sm text-black/70 dark:text-white/70 mb-1">{product.weight}</div>
                    <div className="flex items-center text-xs mb-1">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span>{product.rating} ({product.reviewCount} отзывов)</span>
                    </div>
                    <div className="text-sm">Количество: <span className="font-semibold">{product.quantity}</span></div>
                </div>
                <div className="flex items-end justify-between mt-4">
                    <span className="text-2xl font-bold text-primary">{product.price.toFixed(2).replace('.', ',')} руб.</span>
                    <div className="flex gap-2">
                        <button onClick={onRepeat} title="Повторить заказ" className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
                            Повторить
                        </button>
                        <button onClick={onRemove} title="Удалить товар" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryProductCard;
