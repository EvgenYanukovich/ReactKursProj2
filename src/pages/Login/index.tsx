import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { darkMode } = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();
    
    // Состояния для формы входа
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    // Обработка отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        // Проверка заполнения всех полей
        if (!username || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        
        // Отправка данных на вход
        const success = await login(username, password);
        if (success) {
            navigate('/'); // Переход на главную после успешного входа
        } else {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-16 ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'}`}>
            <div className={`w-full max-w-md p-12 ${darkMode ? 'bg-darkgray text-white' : 'bg-white text-dark'} rounded shadow-lg`}>
                <h2 className="text-4xl font-bold text-center mb-8">Вход</h2>
                
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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Иванов Иван"
                        />
                    </div>
                    
                    <div className="mb-8">
                        <label className="block text-sm font-medium mb-2">Пароль</label>
                        <input
                            type="password"
                            className={`w-full p-3 ${darkMode ? 'bg-primary text-white' : 'bg-gray-100 text-dark border border-gray-300'} focus:outline-none`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••"
                        />
                    </div>
                    
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-primary text-white font-medium hover:bg-opacity-90 transition"
                        >
                            Войти
                        </button>
                        
                        <Link 
                            to="/register" 
                            className="flex-1 p-3 bg-white text-dark text-center font-medium hover:bg-opacity-90 transition"
                        >
                            Регистрация
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;