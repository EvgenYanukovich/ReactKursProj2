import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { addUser, authenticate, initializeUsers } from '../services/userService';
import type { User as UserType } from '../services/userService';

interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (name: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверяем, авторизован ли пользователь при загрузке приложения
  useEffect(() => {
    // Инициализируем пользователей из JSON и localStorage
    initializeUsers();
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Функция для входа с использованием userService
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Используем функцию аутентификации из userService
      const authenticatedUser = authenticate(username, password);
      
      if (authenticatedUser) {
        // Сохраняем данные пользователя в localStorage и состояние
        const userData = {
          id: authenticatedUser.id,
          name: authenticatedUser.name,
          phone: authenticatedUser.phone
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData as UserType);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Ошибка входа:', error);
      return false;
    }
  };

  // Функция для регистрации с использованием userService
  const register = async (name: string, phone: string, password: string): Promise<boolean> => {
    try {
      // Добавляем пользователя с помощью сервиса
      const newUser = addUser(name, phone, password);
      
      // Если пользователь с таким телефоном уже существует, вернется null
      if (!newUser) {
        return false;
      }
      
      // Автоматически входим после регистрации
      const userData = {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData as UserType);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return false;
    }
  };

  // Функция для выхода
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
