import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Account = () => {
    const { darkMode } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Состояния для редактирования
    const [isEditing, setIsEditing] = useState<{[key: string]: boolean}>({});
    const [editedValues, setEditedValues] = useState<{[key: string]: string}>({});
    
    // Проверяем, авторизован ли пользователь
    if (!user) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        navigate('/login');
        return null;
    }
    
    // Получаем дату регистрации
    const registrationDate = "01.01.2025"; // Для примера, в реальном приложении будет из пользователя
    
    // Функция начала редактирования поля
    const startEditing = (field: string, initialValue: string) => {
        setIsEditing(prev => ({ ...prev, [field]: true }));
        setEditedValues(prev => ({ ...prev, [field]: initialValue }));
    };
    
    // Функция завершения редактирования поля
    const saveField = (field: string) => {
        // Здесь была бы логика сохранения данных пользователя
        console.log(`Изменено поле ${field} на ${editedValues[field]}`);
        setIsEditing(prev => ({ ...prev, [field]: false }));
    };
    
    // Функция обработки изменения поля
    const handleInputChange = (field: string, value: string) => {
        setEditedValues(prev => ({ ...prev, [field]: value }));
    };
    
    // Функция выхода из аккаунта
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    return (
        <div className={`min-h-screen py-16 ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'}`}>
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-12">Личный кабинет</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Левая колонка с данными пользователя */}
                    <div className="lg:col-span-2">
                        {/* Имя пользователя */}
                        <div className="mb-6">
                            <p className="text-gray-500 mb-2">Имя пользователя</p>
                            <div className="flex">
                                {isEditing['name'] ? (
                                    <input
                                        type="text"
                                        className={`flex-1 p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                        value={editedValues['name'] || ''}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />
                                ) : (
                                    <div className={`flex-1 p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}>
                                        {user.name}
                                    </div>
                                )}
                                <button
                                    className={`p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                    onClick={() => isEditing['name'] 
                                        ? saveField('name') 
                                        : startEditing('name', user.name || '')}
                                >
                                    {isEditing['name'] ? 'Сохранить' : 'Изменить'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Пароль */}
                        <div className="mb-6">
                            <p className="text-gray-500 mb-2">Пароль</p>
                            <div className="flex">
                                {isEditing['password'] ? (
                                    <input
                                        type="password"
                                        className={`flex-1 p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                        value={editedValues['password'] || ''}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                    />
                                ) : (
                                    <div className={`flex-1 p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}>
                                        ••••••••••
                                    </div>
                                )}
                                <button
                                    className={`p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                    onClick={() => isEditing['password'] 
                                        ? saveField('password') 
                                        : startEditing('password', '')}
                                >
                                    {isEditing['password'] ? 'Сохранить' : 'Изменить'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Номер телефона */}
                        <div className="mb-6">
                            <p className="text-gray-500 mb-2">Номер телефона</p>
                            <div className="flex">
                                {isEditing['phone'] ? (
                                    <input
                                        type="text"
                                        className={`flex-1 p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                        value={editedValues['phone'] || ''}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                ) : (
                                    <div className={`flex-1 p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}>
                                        {user.phone}
                                    </div>
                                )}
                                <button
                                    className={`p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                    onClick={() => isEditing['phone'] 
                                        ? saveField('phone') 
                                        : startEditing('phone', user.phone || '')}
                                >
                                    {isEditing['phone'] ? 'Сохранить' : 'Изменить'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Почта */}
                        <div className="mb-6">
                            <p className="text-gray-500 mb-2">Почта</p>
                            <div className="flex">
                                {isEditing['email'] ? (
                                    <input
                                        type="email"
                                        className={`flex-1 p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                        value={editedValues['email'] || ''}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                ) : (
                                    <div className={`flex-1 p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}>
                                        example@mail.com
                                    </div>
                                )}
                                <button
                                    className={`p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                    onClick={() => isEditing['email'] 
                                        ? saveField('email') 
                                        : startEditing('email', 'example@mail.com')}
                                >
                                    {isEditing['email'] ? 'Сохранить' : 'Изменить'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Адрес доставки */}
                        <div className="mb-6">
                            <p className="text-gray-500 mb-2">Адрес доставки</p>
                            <div className="flex">
                                {isEditing['address'] ? (
                                    <input
                                        type="text"
                                        className={`flex-1 p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                        value={editedValues['address'] || ''}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                    />
                                ) : (
                                    <div className={`flex-1 p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}>
                                        г. Минск, ул. Некрасова, 2-3
                                    </div>
                                )}
                                <button
                                    className={`p-3 ${darkMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                    onClick={() => isEditing['address'] 
                                        ? saveField('address') 
                                        : startEditing('address', 'г. Минск, ул. Некрасова, 2-3')}
                                >
                                    {isEditing['address'] ? 'Сохранить' : 'Изменить'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Кнопки действий */}
                        <div className="mt-10">
                            <button
                                className="text-red-500 hover:underline mr-6"
                                onClick={handleLogout}
                            >
                                Удалить учетную запись
                            </button>
                            <button 
                                className="text-red-500 hover:underline mr-6"
                                onClick={handleLogout}
                            >
                                Выйти из учетной записи
                            </button>
                            <Link to="/history" className="text-blue-500 hover:underline">История заказов</Link>
                        </div>
                    </div>
                    
                    {/* Правая колонка с фото профиля */}
                    <div className="lg:col-span-1">
                        <div className="flex flex-col items-center">
                            <div className="w-64 h-64 rounded-full bg-gray-300 flex items-center justify-center mb-6 overflow-hidden">
                                <div className="text-8xl text-primary font-bold">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </div>
                            <p className="text-gray-500 text-center">
                                Дата регистрации: {registrationDate}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;