import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const { darkMode } = useTheme();
    const { register } = useAuth();
    const navigate = useNavigate();
    
    // Состояния для формы регистрации
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    // Обработка отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        // Проверка заполнения всех полей
        if (!name || !phone || !password || !confirmPassword) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        
        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        
        // Проверка формата телефона
        const phoneRegex = /^\+375 \(\d{2}\) \d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(phone)) {
            setError('Некорректный формат телефона. Используйте формат +375 (XX) XXX-XX-XX');
            return;
        }
        
        // Отправка данных на регистрацию
        const success = await register(name, phone, password);
        if (success) {
            navigate('/'); // Переход на главную после успешной регистрации
        } else {
            setError('Пользователь с таким номером телефона уже существует');
        }
    };
    
    // Обработка изменения телефона с форматированием
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Если пользователь пытается стереть код страны, мы не даем ему это сделать
        if (value.length < 3) {
            setPhone('+375');
            return;
        }
        
        // Удаляем комментарий о проверке кода страны, так как у нас другая логика
        
        // Удаляем все нецифры
        let digits = value.replace(/\D/g, '');
        
        // Если у нас есть код страны в начале цифр, убираем его
        if (digits.startsWith('375')) {
            digits = digits.substring(3);
        }
        
        // Ограничиваем число цифр до 9 (XXX-XX-XX-XX)
        digits = digits.substring(0, 9);
        
        // Формируем номер телефона
        let formattedPhone = '+375';
        
        if (digits.length > 0) {
            // Добавляем код оператора (XX)
            formattedPhone += ' (' + digits.substring(0, Math.min(2, digits.length));
            if (digits.length >= 2) formattedPhone += ')';
            
            // Добавляем первую часть номера XXX
            if (digits.length > 2) {
                formattedPhone += ' ' + digits.substring(2, Math.min(5, digits.length));
            }
            
            // Добавляем вторую часть номера XX
            if (digits.length > 5) {
                formattedPhone += '-' + digits.substring(5, Math.min(7, digits.length));
            }
            
            // Добавляем третью часть номера XX
            if (digits.length > 7) {
                formattedPhone += '-' + digits.substring(7, 9);
            }
        }
        
        setPhone(formattedPhone);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-16 ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'}`}>
            <div className={`w-full max-w-md p-12 ${darkMode ? 'bg-darkgray text-white' : 'bg-white text-dark'} rounded shadow-lg`}>
                <h2 className="text-4xl font-bold text-center mb-8">Регистрация</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-500 text-white rounded">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Имя пользователя</label>
                        <input
                            type="text"
                            className={`w-full p-3 ${darkMode ? 'bg-primary text-white' : 'bg-gray-100 text-dark border border-gray-300'} focus:outline-none`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Иванов Иван"
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Номер телефона</label>
                        <input
                            type="text"
                            className={`w-full p-3 ${darkMode ? 'bg-primary text-white' : 'bg-gray-100 text-dark border border-gray-300'} focus:outline-none`}
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="+375 (29) 123-45-67"
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Пароль</label>
                        <input
                            type="password"
                            className={`w-full p-3 ${darkMode ? 'bg-primary text-white' : 'bg-gray-100 text-dark border border-gray-300'} focus:outline-none`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••"
                        />
                    </div>
                    
                    <div className="mb-8">
                        <label className="block text-sm font-medium mb-2">Повторите пароль</label>
                        <input
                            type="password"
                            className={`w-full p-3 ${darkMode ? 'bg-primary text-white' : 'bg-gray-100 text-dark border border-gray-300'} focus:outline-none`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••••"
                        />
                    </div>
                    
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-primary text-white font-medium hover:bg-opacity-90 transition"
                        >
                            Зарегистрироваться
                        </button>
                        
                        <Link 
                            to="/login" 
                            className="flex-1 p-3 bg-white text-dark text-center font-medium hover:bg-opacity-90 transition"
                        >
                            Вход
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;