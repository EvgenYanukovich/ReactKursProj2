import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';

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
}

interface ProductSliderProps {
    title: string;
    products: Product[];
    viewAllLink?: string;
    darkMode?: boolean;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ 
    title, 
    products, 
    viewAllLink = '/catalog',
    darkMode = false 
}) => {
    const [slidesToShow, setSlidesToShow] = useState(4);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    // Адаптивное количество карточек в зависимости от ширины экрана
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setSlidesToShow(1);
            } else if (window.innerWidth < 768) {
                setSlidesToShow(2);
            } else if (window.innerWidth < 1024) {
                setSlidesToShow(3);
            } else {
                setSlidesToShow(4);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Функции для управления слайдером
    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        
        const totalSlides = Math.ceil(products.length / slidesToShow);
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };
    
    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        
        const totalSlides = Math.ceil(products.length / slidesToShow);
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };



    return (
        <div className={`product-slider py-6 ${darkMode ? 'text-white' : 'text-dark'}`}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="text-primary mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold">{title}</h2>
                </div>
                <Link 
                    to={viewAllLink} 
                    className="bg-primary text-white px-4 py-2 hover:bg-opacity-90 transition-all"
                >
                    Показать все
                </Link>
            </div>

            {/* Контейнер с кнопками навигации и слайдером */}
            <div className="relative py-4">
                {/* Стрелка влево (расположена отдельно от слайдера) */}
                <button 
                    onClick={prevSlide}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 ${darkMode ? 'text-black' : 'text-black'} bg-white shadow-md rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform`}
                    aria-label="Предыдущий слайд"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                {/* Слайдер */}
                <div className="px-14 overflow-hidden" ref={sliderRef}>
                    <div 
                        className="flex transition-transform duration-500 ease-in-out" 
                        style={{ transform: `translateX(${-currentSlide * 100}%)` }}
                    >
                        {products.map(product => (
                            <div 
                                key={product.id} 
                                className="px-2 flex-shrink-0"
                                style={{ flex: `0 0 ${100 / slidesToShow}%` }}
                            >
                                <ProductCard 
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
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Стрелка вправо (расположена отдельно от слайдера) */}
                <button 
                    onClick={nextSlide}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 ${darkMode ? 'text-black' : 'text-black'} bg-white shadow-md rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform`}
                    aria-label="Следующий слайд"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                
                {/* Индикаторы (точки) */}
                <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: Math.ceil(products.length / slidesToShow) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setIsTransitioning(true);
                                setCurrentSlide(index);
                                setTimeout(() => {
                                    setIsTransitioning(false);
                                }, 500);
                            }}
                            className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-primary w-8' : darkMode ? 'bg-gray-400' : 'bg-gray-300'}`}
                            aria-label={`Перейти к слайду ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductSlider;
