import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
  expanded?: boolean;
  type?: 'checkbox' | 'price-range' | 'radio';
  color?: string;
}

interface CategoryFiltersProps {
  onFilterChange: (filters: Record<string, any>) => void;
  products: any[];
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ onFilterChange, products }) => {
  const { darkMode } = useTheme();
  
  // Начальное состояние фильтров на основе макета
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    {
      id: 'price',
      title: 'Цена, р.',
      expanded: true,
      type: 'price-range',
      color: '#ff5722',
      options: []
    },
    {
      id: 'availability',
      title: 'Наличие',
      expanded: true,
      color: '#ff5722',
      options: [
        { id: 'inStock', label: 'В наличии' }
      ]
    },
    {
      id: 'special',
      title: 'Акции',
      expanded: true,
      color: '#ff5722',
      options: [
        { id: 'discount', label: 'Скидки' },
        { id: 'new', label: 'Новинки' }
      ]
    },
    {
      id: 'brand',
      title: 'Бренд',
      expanded: true,
      color: '#ff5722',
      options: []
    },
    {
      id: 'age',
      title: 'Возраст',
      expanded: true,
      color: '#ff5722',
      options: [
        { id: 'Для малышей', label: 'Для малышей' },
        { id: 'Для взрослых', label: 'Для взрослых' },
        { id: 'Для пожилых', label: 'Для пожилых' },
        { id: 'Для всех возрастов', label: 'Для всех возрастов' }
      ]
    },
    {
      id: 'appointment',
      title: 'Назначение',
      expanded: true,
      color: '#ff5722',
      options: [
        { id: 'Корм', label: 'Корм' },
        { id: 'Аксессуары', label: 'Аксессуары' },
        { id: 'Игрушки', label: 'Игрушки' },
        { id: 'Гигиена', label: 'Гигиена' }
      ]
    },
    {
      id: 'packagingType',
      title: 'Тип упаковки',
      expanded: true,
      color: '#ff5722',
      options: [
        { id: 'Пакет', label: 'Пакет' },
        { id: 'Штучно', label: 'Штучно' },
        { id: 'Флакон', label: 'Флакон' },
        { id: 'Банка', label: 'Банка' }
      ]
    }
  ]);
  
  // Состояние выбранных фильтров
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  // Состояние для диапазона цен
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({min: '', max: ''});
  
  // Формирование брендов из доступных продуктов
  useEffect(() => {
    if (products && products.length > 0) {
      // Получаем уникальные бренды из продуктов
      const brands = [...new Set(products.map(product => product.brand))]
        .filter(Boolean)
        .sort()
        .map(brand => ({ id: brand, label: brand }));
      
      // Обновляем группу фильтров с брендами
      setFilterGroups(prevGroups => {
        return prevGroups.map(group => {
          if (group.id === 'brand') {
            return { ...group, options: brands };
          }
          return group;
        });
      });
    }
  }, [products]);
  
  // Переключение раскрытия/свертывания группы фильтров
  const toggleGroup = (groupId: string) => {
    setFilterGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, expanded: !group.expanded } 
          : group
      )
    );
  };
  
  // Обработка выбора фильтра
  const handleFilterSelect = (groupId: string, optionId: string) => {
    setSelectedFilters(prevFilters => {
      const currentGroupFilters = prevFilters[groupId] || [];
      
      // Если опция уже выбрана, удаляем её, иначе добавляем
      const updatedGroupFilters = currentGroupFilters.includes(optionId)
        ? currentGroupFilters.filter((filterId: string) => filterId !== optionId)
        : [...currentGroupFilters, optionId];
      
      const updatedFilters = {
        ...prevFilters,
        [groupId]: updatedGroupFilters
      };
      
      // Вызываем колбэк для родительского компонента
      onFilterChange(updatedFilters);
      
      return updatedFilters;
    });
  };

  // Обработка изменения диапазона цен
  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    // Разрешаем только числа и пустую строку
    if (value === '' || /^\d+$/.test(value)) {
      const newPriceRange = { ...priceRange, [type]: value };
      setPriceRange(newPriceRange);
    }
  };
  
  // Применение фильтра по цене
  const applyPriceFilter = () => {
    const min = priceRange.min ? parseInt(priceRange.min) : 0;
    const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
    
    // Формируем строковое представление фильтра цен для обработки
    const priceFilters = [`${min}-${max === Infinity ? 'max' : max}`];
    
    const updatedFilters = {
      ...selectedFilters,
      'price': priceFilters
    };
    
    // Вызываем колбэк для родительского компонента
    onFilterChange(updatedFilters);
  };
  
  // Очистка всех фильтров
  const clearAllFilters = () => {
    setSelectedFilters({});
    setPriceRange({min: '', max: ''});
    onFilterChange({});
  };
  
  // Подсчет общего количества выбранных фильтров
  const getTotalSelectedFilters = () => {
    let count = 0;
    
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (key === 'price' && value) {
        count += 1; // Считаем фильтр цены как один фильтр
      } else if (Array.isArray(value)) {
        count += value.length;
      }
    });
    
    return count;
  };
  
  // Передача изменений фильтра родительскому компоненту
  useEffect(() => {
    // Передаем выбранные фильтры в родительский компонент
    // Сама логика фильтрации перенесена в компонент каталога
    onFilterChange(selectedFilters);
    // Удаляем onFilterChange из зависимостей, чтобы избежать бесконечного цикла
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters]);

  return (
    <div className={`category-filters }`}>
      {/* Скрытый заголовок фильтров на мобильных устройствах */}
      <div className="lg:hidden p-2 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold">Фильтры</h3>
        {getTotalSelectedFilters() > 0 && (
          <button 
            className="text-sm text-[#ff5722] hover:underline"
            onClick={clearAllFilters}
          >
            Сбросить все
          </button>
        )}
      </div>

      {filterGroups.map(group => (
        <div key={group.id} className={`filter-group mb-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} border-b pb-2`}>
          <div 
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleGroup(group.id)}
          >
            <h4 className="font-medium" style={{ color: group.color || 'inherit' }}>{group.title}</h4>
            <span className="text-lg" style={{ color: group.color || 'inherit' }}>
              {group.expanded ? '−' : '+'}
            </span>
          </div>
          
          {group.expanded && (
            <div className="space-y-1">
              {group.type === 'price-range' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        id="price-min"
                        value={priceRange.min}
                        onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                        placeholder="0"
                        className={`w-full p-1 text-sm border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded`}
                      />
                    </div>
                    <div className="flex items-center text-sm">—</div>
                    <div className="flex-1">
                      <input
                        type="text"
                        id="price-max"
                        value={priceRange.max}
                        onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                        placeholder="∞"
                        className={`w-full p-1 text-sm border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded`}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={applyPriceFilter}
                    className="w-full bg-[#ff5722] text-white text-sm py-1 rounded hover:brightness-95 transition-all"
                  >
                    Применить
                  </button>
                </div>
              ) : (
                // Стандартные чекбоксы для остальных фильтров
                <div className="grid grid-cols-1 gap-1">
                  {group.options.map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${group.id}-${option.id}`}
                        className="mr-1.5 w-3.5 h-3.5 accent-[#ff5722] cursor-pointer"
                        checked={(selectedFilters[group.id] || []).includes(option.id)}
                        onChange={() => handleFilterSelect(group.id, option.id)}
                      />
                      <label 
                        htmlFor={`${group.id}-${option.id}`}
                        className="flex justify-between w-full text-xs cursor-pointer"
                      >
                        <span>{option.label}</span>
                        {option.count !== undefined && (
                          <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ({option.count})
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Кнопку применить убираем, так как фильтрация происходит автоматически */}
    </div>
  );
};

export default CategoryFilters;
