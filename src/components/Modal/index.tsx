import React, { useEffect, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    titleText?: string;
    children: React.ReactNode;
    darkMode?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, titleText, children, darkMode = false }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const title = titleText || '';
    
    // Обработка нажатия ESC для закрытия модального окна
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        
        // Обработка клика вне модального окна
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleOutsideClick);
            // Блокировка скролла под модальным окном
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleOutsideClick);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;
    
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-opacity-75 bg-black' : 'bg-opacity-75 bg-gray-800'}`}>
            <div 
                ref={modalRef} 
                className={`relative rounded-lg ${darkMode ? 'bg-darkgray text-white' : 'bg-gray-100 text-dark'} w-full max-w-md`}
            >
                {/* Заголовок модального окна */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <h3 className="text-2xl font-semibold">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-3xl text-primary hover:text-opacity-80 focus:outline-none"
                    >
                        ✕
                    </button>
                </div>
                
                {/* Содержимое модального окна */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;