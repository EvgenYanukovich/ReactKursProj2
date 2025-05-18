import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Интерфейс для товаров в корзине
export interface CartItem {
    id: string | number;
    productId: number; // Исходный ID товара (без учета варианта)
    title: string;
    image: string;
    price: number;
    quantity: number;
    weight?: string;
    variant?: number; // Индекс выбранного варианта
    rating?: number;
    reviewCount?: number;
}

// Интерфейс для контекста корзины
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string | number) => void;
    updateQuantity: (id: string | number, quantity: number) => void;
    clearCart: () => void;
    isInCart: (id: string | number) => boolean;
    getItemQuantity: (id: string | number) => number;
    getItemVariant: (productId: number) => number | null; // Функция для получения варианта товара в корзине
}

// Создание контекста с начальными значениями
const CartContext = createContext<CartContextType>({
    cartItems: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    isInCart: () => false,
    getItemQuantity: () => 0,
    getItemVariant: () => null
});

// Хук для использования контекста корзины
export const useCart = () => useContext(CartContext);

// Провайдер контекста корзины
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Состояние для товаров в корзине
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Загрузка данных корзины из localStorage при инициализации
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Ошибка при загрузке корзины:', error);
            }
        }
    }, []);

    // Сохранение данных корзины в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Добавление товара в корзину
    const addToCart = (item: CartItem) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
            
            if (existingItem) {
                // Если товар уже в корзине, увеличиваем количество
                return prevItems.map(cartItem => 
                    cartItem.id === item.id 
                        ? { ...cartItem, quantity: cartItem.quantity + item.quantity } 
                        : cartItem
                );
            } else {
                // Если товара нет в корзине, добавляем его
                return [...prevItems, item];
            }
        });
    };

    // Удаление товара из корзины
    const removeFromCart = (id: string | number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // Обновление количества товара в корзине
    const updateQuantity = (id: string | number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === id 
                    ? { ...item, quantity } 
                    : item
            )
        );
    };

    // Очистка корзины
    const clearCart = () => {
        setCartItems([]);
    };

    // Проверка наличия товара в корзине
    const isInCart = (id: string | number) => {
        return cartItems.some(item => item.id === id);
    };

    // Получение количества товара в корзине
    const getItemQuantity = (id: string | number) => {
        const item = cartItems.find(item => item.id === id);
        return item ? item.quantity : 0;
    };
    
    // Получение варианта товара в корзине
    const getItemVariant = (productId: number) => {
        const item = cartItems.find(item => item.productId === productId);
        return item && typeof item.variant === 'number' ? item.variant : null;
    };

    // Предоставление значений контекста
    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        getItemVariant
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
