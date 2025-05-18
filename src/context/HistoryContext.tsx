import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface HistoryProduct {
    id: string | number;
    productId: number;
    title: string;
    image: string;
    price: number;
    quantity: number;
    weight?: string;
    variant?: number;
    rating?: number;
    reviewCount?: number;
}

export interface Order {
    id: string;
    date: string;
    products: HistoryProduct[];
    totalAmount: number;
}

interface HistoryContextType {
    orders: Order[];
    addOrder: (order: Order) => void;
    repeatOrder: (orderId: string) => void;
    removeOrder: (orderId: string) => void;
}

const HistoryContext = createContext<HistoryContextType>({
    orders: [],
    addOrder: () => {},
    repeatOrder: () => {},
    removeOrder: () => {},
});

export const useHistoryOrders = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('orderHistory');
        if (stored) setOrders(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem('orderHistory', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (order: Order) => {
        setOrders(prev => [order, ...prev]);
    };

    const repeatOrder = (_orderId: string) => {
        // Реализация будет через CartContext, см. Cart
        // underscore показывает, что параметр не используется в данный момент
    };

    const removeOrder = (orderId: string) => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
    };

    return (
        <HistoryContext.Provider value={{ orders, addOrder, repeatOrder, removeOrder }}>
            {children}
        </HistoryContext.Provider>
    );
};
