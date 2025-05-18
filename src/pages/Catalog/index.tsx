import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import CategoryFilters from '../../components/CategoryFilters';
import ProductGrid from '../../components/ProductGrid';

interface Product {
    id: number;
    name: string;
    price: string[];
    heft: string[];
    images?: string[];
    category: string;
    brand: string;
    age: string;
    packagingType: string;
    appointment: string;
    discount?: number;
    isNew?: number;
    review?: Array<{
        score: string;
    }>;
    count?: number[];
    [key: string]: any; // Индексированный тип для доступа к полям по строковому ключу
}

const Catalog = () => {
    const { darkMode } = useTheme();
    const location = useLocation();
    
    // Получаем параметры из URL
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';
    const categoryParam = searchParams.get('category') || '';
    
    // Состояния для хранения данных
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 16;

    // Получаем название категории для отображения
    const getCategoryTitle = () => {
        // Если есть поисковый запрос, показываем его в заголовке
        if (searchQuery) {
            return `Результаты поиска: ${searchQuery}`;
        }
        
        // Если есть категория в параметрах запроса, используем её
        if (categoryParam) {
            // Категория уже представлена в читаемом виде, например "Кошкам"
            return `Товары ${categoryParam.toLowerCase()}`;
        }
        
        return 'Все товары';
    };
    
    // Загрузка данных о товарах и применение поиска, если есть
    useEffect(() => {
        try {
            // Импортируем JSON напрямую (в реальном проекте используем fetch)
            import('../../data/cards.json')
                .then(data => {
                    const allProducts = data.default || [];
                    
                    // Фильтруем по категории, если она указана
                    let categoryProducts = allProducts;
                    
                    // Фильтрация по категории из параметра запроса
                    if (categoryParam) {
                        // Параметр запроса уже содержит точное название категории
                        categoryProducts = allProducts.filter(product => 
                            product.category === categoryParam
                        );
                    }
                    
                    // Фильтрация по поисковому запросу, если он есть
                    if (searchQuery) {
                        const searchLowerCase = searchQuery.toLowerCase();
                        categoryProducts = categoryProducts.filter(product => 
                            product.name.toLowerCase().includes(searchLowerCase) ||
                            (product.description && product.description.toLowerCase().includes(searchLowerCase))
                        );
                    }
                    
                    setProducts(categoryProducts);
                    setFilteredProducts(categoryProducts);
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
    }, [categoryParam, searchQuery]);
    
    // Обработка изменения фильтров
    const handleFilterChange = (newFilters: Record<string, any>) => {
        setActiveFilters(newFilters);
        
        // Фильтрация товаров на основе выбранных фильтров
        // Реализуем клиентскую фильтрацию продуктов
        const filtered = products.filter(product => {
            // Если нет фильтров или они пустые, возвращаем все продукты
            if (Object.keys(newFilters).length === 0) {
                return true;
            }

            // Проверяем каждый фильтр
            for (const [key, value] of Object.entries(newFilters)) {
                if (!value || (Array.isArray(value) && value.length === 0)) {
                    continue;
                }
                
                // Фильтрация по цене
                if (key === 'price' && Array.isArray(value) && value.length > 0) {
                    const priceRange = value[0].split('-');
                    const minPrice = parseFloat(priceRange[0]);
                    const maxPrice = priceRange[1] === 'max' ? Infinity : parseFloat(priceRange[1]);
                    
                    // Получаем цену из первого элемента массива цен
                    const productPrice = parseFloat(product.price[0].replace(/[^\d,]/g, '').replace(',', '.'));
                    
                    if (productPrice < minPrice || productPrice > maxPrice) {
                        return false;
                    }
                }
                // Фильтрация по наличию
                else if (key === 'availability' && Array.isArray(value) && value.includes('inStock')) {
                    // Проверяем, что хотя бы в одном варианте товара есть положительное количество
                    const hasStock = product.count && product.count.some((qty: number) => qty > 0);
                    if (!hasStock) {
                        return false;
                    }
                }
                // Фильтрация по скидкам и новинкам
                else if (key === 'special' && Array.isArray(value)) {
                    if (value.includes('discount') && (!product.discount || product.discount <= 0)) {
                        return false;
                    }
                    if (value.includes('new') && (!product.isNew || product.isNew <= 0)) {
                        return false;
                    }
                }
                // Фильтрация по остальным полям (бренд, возраст, назначение, тип упаковки)
                else if (Array.isArray(value) && value.length > 0) {
                    const fieldValue = product[key];
                    
                    if (!fieldValue || !value.includes(fieldValue)) {
                        return false;
                    }
                }
            }
            
            return true;
        });
        
        // Обновляем список отфильтрованных продуктов
        setFilteredProducts(filtered);
    };

    return (
        <div className={`catalog-page ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-10">{error}</div>
            ) : (
                <div className="container mx-auto px-4 py-8">
                    {/* Хлебные крошки */}
                    <nav className="text-sm mb-6">
                        <ol className="flex">
                            <li className="flex items-center">
                                <a href="/" className="text-primary hover:underline">Главная</a>
                                <span className="mx-2">/</span>
                            </li>
                            <li className="flex items-center">
                                <a href="/catalog" className="text-primary hover:underline">Каталог</a>
                                {(categoryParam || searchQuery) && <span className="mx-2">/</span>}
                            </li>
                            {(categoryParam || searchQuery) && (
                                <li className="text-gray-500 dark:text-gray-400">
                                    {getCategoryTitle()}
                                </li>
                            )}
                        </ol>
                    </nav>
                    
                    {/* Основное содержимое */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Боковая панель с фильтрами */}
                        <div className="lg:col-span-1">
                            <CategoryFilters 
                                onFilterChange={handleFilterChange} 
                                products={products} 
                            />
                        </div>
                        
                        {/* Сетка товаров */}
                        <div className="lg:col-span-3">
                            <ProductGrid 
                                products={filteredProducts} 
                                title={getCategoryTitle()} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalog;