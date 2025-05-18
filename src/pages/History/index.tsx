import React from 'react'; // нужен для JSX, не удалять
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useHistoryOrders } from '../../context/HistoryContext';
import type { Order } from '../../context/HistoryContext';
import HistoryProductCard from '../../components/HistoryProductCard';

const History = () => {
    const { darkMode } = useTheme();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { orders, removeOrder } = useHistoryOrders();

    const formatPrice = (price: number): string => price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    if (!user) {
        return (
            <div className={`py-8 ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'}`}>
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold mb-6">История заказов</h1>
                    <p className="text-xl mb-4">Для просмотра истории заказов необходимо войти в аккаунт</p>
                    <Link to="/login" className="inline-block px-6 py-3 bg-primary text-white text-lg font-medium hover:bg-opacity-90 transition-colors">
                        Войти
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`py-8 ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'}`}>
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">История заказов</h1>
                
                {orders.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-xl mb-4">У вас пока нет заказов</p>
                        <Link to="/" className="inline-block px-6 py-3 bg-primary text-white text-lg font-medium hover:bg-opacity-90 transition-colors">
                            Перейти к покупкам
                        </Link>
                    </div>
                ) : (
                    <div>
                        {orders.map((order: Order, idx: number) => (
                            <div key={order.id} className="mb-12">
                                {/* Сетка товаров — теперь HistoryProductCard */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
                                    {order.products.map((product) => (
                                        <HistoryProductCard
                                            key={product.id}
                                            product={product}
                                            darkMode={darkMode}
                                            onRepeat={() => addToCart({
                                                ...product,
                                                id: `${product.productId}-${product.variant ?? 0}`,
                                                quantity: product.quantity
                                            })}
                                            onRemove={() => removeOrder(order.id)}
                                        />
                                    ))}
                                </div>
                                {/* Итоговая сумма заказа */}
                                <div className="text-right text-2xl font-bold mb-2">
                                    {idx === 0 && <span>Итого:&nbsp;</span>}{formatPrice(order.totalAmount)} руб.
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;