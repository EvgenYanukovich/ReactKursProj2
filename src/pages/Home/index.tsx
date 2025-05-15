import { useState, useEffect } from 'react';
import BannerSlider from '../../components/BannerSlider';
import ProductSlider from '../../components/ProductSlider';

// Импортируем типы для товаров
interface Product {
    id: number;
    name: string;
    price: string[];
    heft: string[];
    images?: string[];
    category: string;
    discount?: number;
    isNew?: number;
    review?: Array<{
        score: string;
    }>;
    count?: number[];
}

const Home = ({ darkMode = false }: { darkMode?: boolean }) => {
    // Состояние для хранения данных о товарах
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const [newProducts, setNewProducts] = useState<Product[]>([]);
    const [saleProducts, setSaleProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Загрузка данных о товарах
    useEffect(() => {
        // В реальном проекте здесь был бы API-запрос
        try {
            // Импортируем JSON напрямую (в реальном проекте используем fetch)
            import('../../data/cards.json')
                .then(data => {
                    const allProducts = data.default || [];
                    
                    // Рекомендуемые товары (первые 8)
                    setRecommendedProducts(allProducts.slice(0, 8));
                    
                    // Новые товары (где isNew = 1)
                    setNewProducts(allProducts.filter((product: Product) => product.isNew === 1).slice(0, 8));
                    
                    // Товары со скидкой (где discount > 0)
                    setSaleProducts(allProducts.filter((product: Product) => product.discount && product.discount > 0).slice(0, 8));
                    
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Ошибка загрузки данных:', err);
                    setError('Ошибка загрузки данных товаров');
                    setLoading(false);
                });
        } catch (err) {
            console.error('Ошибка загрузки данных:', err);
            setError('Ошибка загрузки данных товаров');
            setLoading(false);
        }
    }, []);

    return (
        <div className={`home-page ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Баннерный слайдер */}
            <BannerSlider darkMode={darkMode} />
            
            {/* Контент страницы */}
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">{error}</div>
                ) : (
                    <>
                        {/* Слайдер рекомендуемых товаров */}
                        {recommendedProducts.length > 0 && (
                            <ProductSlider 
                                title="Рекомендуемое" 
                                products={recommendedProducts} 
                                viewAllLink="/catalog"
                                darkMode={darkMode}
                            />
                        )}
                        
                        {/* Слайдер новых товаров */}
                        {newProducts.length > 0 && (
                            <ProductSlider 
                                title="Новинки" 
                                products={newProducts} 
                                viewAllLink="/catalog"
                                darkMode={darkMode}
                            />
                        )}
                        
                        {/* Слайдер товаров со скидкой */}
                        {saleProducts.length > 0 && (
                            <ProductSlider 
                                title="Распродажа!" 
                                products={saleProducts} 
                                viewAllLink="/catalog"
                                darkMode={darkMode}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;