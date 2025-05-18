import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../ProductCard';
import { useTheme } from '../../context/ThemeContext';

interface Product {
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
  category?: string;
  brand?: string;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  itemsPerPage?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title, itemsPerPage = 9 }) => {
  const { darkMode } = useTheme();
  const [sortOption, setSortOption] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Функция сортировки товаров
  const getSortedProducts = () => {
    switch (sortOption) {
      case 'price-asc':
        return [...products].sort((a, b) => {
          const priceA = parseFloat(a.price[0].replace(/[^\d,]/g, '').replace(',', '.'));
          const priceB = parseFloat(b.price[0].replace(/[^\d,]/g, '').replace(',', '.'));
          return priceA - priceB;
        });
      case 'price-desc':
        return [...products].sort((a, b) => {
          const priceA = parseFloat(a.price[0].replace(/[^\d,]/g, '').replace(',', '.'));
          const priceB = parseFloat(b.price[0].replace(/[^\d,]/g, '').replace(',', '.'));
          return priceB - priceA;
        });
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'popular':
      default:
        // По умолчанию сортировка по популярности (здесь просто используем существующий порядок)
        return products;
    }
  };

  const sortedProducts = getSortedProducts();
  
  // Рассчитываем общее количество страниц при изменении количества товаров
  useEffect(() => {
    setTotalPages(Math.ceil(sortedProducts.length / itemsPerPage));
    // Сбрасываем на первую страницу при изменении списка товаров или фильтров
    setCurrentPage(1);
  }, [sortedProducts.length, itemsPerPage]);
  
  // Функция получения товаров текущей страницы
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  };
  
  // Получаем товары для текущей страницы
  const currentPageProducts = useMemo(() => getCurrentPageProducts(), [sortedProducts, currentPage, itemsPerPage]);
  
  // Переход на предыдущую страницу
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Прокручиваем страницу вверх при смене страницы
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Переход на следующую страницу
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Прокручиваем страницу вверх при смене страницы
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Переход на конкретную страницу
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Прокручиваем страницу вверх при смене страницы
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Генерация массива номеров страниц для отображения
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Максимальное число кнопок страниц для отображения
    
    if (totalPages <= maxVisiblePages) {
      // Если страниц меньше maxVisiblePages, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Иначе показываем только часть страниц с многоточием
      if (currentPage <= 3) {
        // Если текущая страница в начале, показываем первые 3 страницы, многоточие и последнюю
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Если текущая страница в конце, показываем первую, многоточие и последние 3 страницы
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Если текущая страница в середине, показываем первую, многоточие, текущую и соседние, многоточие и последнюю
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className={`product-grid ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      {/* Заголовок категории и счетчик товаров */}
      <div className="mb-6">
        {title && (
          <h1 className="text-3xl font-bold">{title}</h1>
        )}
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Найдено товаров: {products.length}
        </p>
      </div>

      {/* Панель сортировки */}
      <div className={`flex justify-between items-center mb-6 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-2">
          <button className={`px-3 py-1 text-sm rounded-md ${sortOption === 'popular' ? 'bg-primary text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                  onClick={() => setSortOption('popular')}>
            Популярные
          </button>
          <button className={`px-3 py-1 text-sm rounded-md ${sortOption === 'price-asc' ? 'bg-primary text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                  onClick={() => setSortOption('price-asc')}>
            Сначала дешевые
          </button>
          <button className={`px-3 py-1 text-sm rounded-md ${sortOption === 'price-desc' ? 'bg-primary text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                  onClick={() => setSortOption('price-desc')}>
            Сначала дорогие
          </button>
          <button className={`px-3 py-1 text-sm rounded-md ${sortOption === 'name' ? 'bg-primary text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                  onClick={() => setSortOption('name')}>
            По названию
          </button>
        </div>
      </div>

      {/* Сетка карточек товаров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {currentPageProducts.length > 0 ? (
          currentPageProducts.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              heft={product.heft}
              images={product.images}
              discount={product.discount}
              isNew={product.isNew}
              review={product.review}
              darkMode={darkMode}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-lg">
              По заданным критериям товары не найдены. Попробуйте изменить параметры фильтрации.
            </p>
          </div>
        )}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <div className="flex items-center space-x-2">
            {/* Кнопка Предыдущая страница */}
            <button 
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#ff5722] hover:text-white'}`}
            >
              &lt;
            </button>
            
            {/* Кнопки с номерами страниц */}
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2">...</span>
                ) : (
                  <button 
                    onClick={() => typeof page === 'number' && goToPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === page ? 'bg-[#ff5722] text-white' : darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200'} hover:bg-[#ff5722] hover:text-white transition-colors`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
            
            {/* Кнопка Следующая страница */}
            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#ff5722] hover:text-white'}`}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
