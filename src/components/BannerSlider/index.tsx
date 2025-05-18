import React from 'react';
import Slider from '../Slider';

// @ts-ignore - игнорируем ошибки импорта изображений
import bannerImage1 from '../../assets/images/banners/banner1.png';
// @ts-ignore
import bannerImage2 from '../../assets/images/banners/banner2.png';
// @ts-ignore
import bannerImage3 from '../../assets/images/banners/banner3.png';

interface BannerSliderProps {
    darkMode?: boolean;
}

const BannerSlider: React.FC<BannerSliderProps> = ({ darkMode = false }) => {
    // Массив баннеров для слайдера
    const banners = [
        {
            id: 1,
            image: bannerImage1 || 'https://via.placeholder.com/1200x400/f5f5f5/ffa500?text=Все+для+счастья+вашего+питомца!',
            title: 'Всё для счастья вашего питомца!',
            link: '/catalog',
            buttonText: 'Подробнее'
        },
        {
            id: 2,
            image: bannerImage2 || 'https://via.placeholder.com/1200x400/f5f5f5/ffa500?text=Скидки+на+корма+до+30%',
            title: 'Скидки на корма до 30%',
            link: '/catalog',
            buttonText: 'Подробнее'
        },
        {
            id: 3,
            image: bannerImage3 || 'https://via.placeholder.com/1200x400/f5f5f5/ffa500?text=Новая+коллекция+аксессуаров',
            title: 'Новая коллекция аксессуаров',
            link: '/catalog',
            buttonText: 'Подробнее'
        }
    ];

    return (
        <div className="banner-slider w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <Slider
                autoplay={true}
                autoplaySpeed={5000}
                darkMode={darkMode}
                className="w-full max-w-none"
                arrowClassName="hover:opacity-80 transition-opacity"
            >
                {banners.map(banner => (
                    <div key={banner.id} className="relative w-full h-[600px]">
                        <div 
                            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                            style={{ 
                                backgroundImage: `url(${banner.image})`,
                                backgroundPosition: 'center 20%'
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-6 max-w-xl">
                                <h2 className="text-5xl font-bold text-primary mb-6">{banner.title}</h2>
                                <a
                                    href={banner.link}
                                    className="inline-block bg-primary text-white px-8 py-3 text-xl font-medium hover:bg-opacity-90 transition-all"
                                >
                                    {banner.buttonText}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default BannerSlider;
