import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from '../Slider';
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

            <Slider 
                slidesToShow={slidesToShow} 
                slidesToScroll={1}
                autoplay={false}
                darkMode={darkMode}
                className="py-4"
            >
                {products.map(product => (
                    <div key={product.id} className="px-2">
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
            </Slider>
        </div>
    );
};

export default ProductSlider;
