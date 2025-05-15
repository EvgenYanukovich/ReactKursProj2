import React, { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface SliderProps {
    children: ReactNode[];
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    darkMode?: boolean;
    className?: string;
    arrowClassName?: string;
    dotsClassName?: string;
    showDots?: boolean;
}

const Slider: React.FC<SliderProps> = ({
    children,
    slidesToShow = 1,
    slidesToScroll = 1,
    autoplay = false,
    autoplaySpeed = 5000,
    darkMode = false,
    className = '',
    arrowClassName = '',
    dotsClassName = '',
    showDots = true
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const childrenArray = React.Children.toArray(children);
    const slidesCount = Math.ceil(childrenArray.length / slidesToShow);
    
    const nextSlide = () => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        setCurrentSlide((prev) => {
            const next = (prev + slidesToScroll) % slidesCount;
            return next;
        });
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };
    
    const prevSlide = () => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        setCurrentSlide((prev) => {
            const next = (prev - slidesToScroll + slidesCount) % slidesCount;
            return next;
        });
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };
    
    const goToSlide = (slideIndex: number) => {
        if (isTransitioning || slideIndex === currentSlide) return;
        
        setIsTransitioning(true);
        setCurrentSlide(slideIndex);
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };
    
    // Автоматическое прокручивание слайдера
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (autoplay) {
            interval = setInterval(() => {
                nextSlide();
            }, autoplaySpeed);
        }
        
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [autoplay, autoplaySpeed, currentSlide]);
    
    // Вычисляем стиль для контейнера слайдов
    const translateValue = `-${currentSlide * 100}%`;
    
    return (
        <div className={`relative overflow-hidden ${className}`} ref={sliderRef}>
            <div 
                className="flex transition-transform duration-500 ease-in-out" 
                style={{ transform: `translateX(${translateValue})` }}
            >
                {childrenArray.map((slide, index) => (
                    <div 
                        key={index} 
                        className="flex-shrink-0 w-full"
                        style={{ flex: slidesToShow === 1 ? '0 0 100%' : `0 0 ${100 / slidesToShow}%` }}
                    >
                        {slide}
                    </div>
                ))}
            </div>
            
            {/* Стрелки для навигации */}
            <button 
                onClick={prevSlide}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-4xl font-bold ${darkMode ? 'text-white' : 'text-black'} ${arrowClassName}`}
                aria-label="Предыдущий слайд"
            >
                &#8249;
            </button>
            
            <button 
                onClick={nextSlide}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-4xl font-bold ${darkMode ? 'text-white' : 'text-black'} ${arrowClassName}`}
                aria-label="Следующий слайд"
            >
                &#8250;
            </button>
            
            {/* Индикаторы (точки) */}
            {showDots && (
                <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 ${dotsClassName}`}>
                    {Array.from({ length: slidesCount }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-primary w-8' : darkMode ? 'bg-gray-400' : 'bg-gray-300'}`}
                            aria-label={`Перейти к слайду ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Slider;