import usersData from '../data/users.json';
import { saveUsersToJson, getUsersFromJson } from './apiService';

// Интерфейс пользователя
export interface User {
  id: number;
  name: string;
  phone: string;
  password: string;
  isAdmin?: boolean;
  createdAt: string;
}

// Глобальный массив пользователей, загруженный из JSON
let users: User[] = [...usersData];

// Получение всех пользователей
export const getAllUsers = (): User[] => {
  return users;
};

// Поиск пользователя по телефону
export const findUserByPhone = (phone: string): User | undefined => {
  return users.find(user => user.phone === phone);
};

// Поиск пользователя по имени или телефону
export const findUserByNameOrPhone = (loginInfo: string): User | undefined => {
  return users.find(user => 
    user.name === loginInfo || user.phone === loginInfo
  );
};

// Проверка авторизации
export const authenticate = (loginInfo: string, password: string): User | null => {
  const user = findUserByNameOrPhone(loginInfo);
  if (user && user.password === password) {
    // Возвращаем копию пользователя без пароля для безопасности
    const { password, ...safeUser } = user;
    return safeUser as User;
  }
  return null;
};

// Добавление нового пользователя
export const addUser = (name: string, phone: string, password: string): User | null => {
  // Проверяем, не существует ли уже пользователь с таким номером
  if (findUserByPhone(phone)) {
    return null;
  }
  
  // Генерируем ID для нового пользователя
  const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
  
  // Создаем нового пользователя
  const newUser: User = {
    id: newId,
    name,
    phone,
    password,
    isAdmin: false,
    createdAt: new Date().toISOString()
  };
  
  // Добавляем пользователя в массив
  users.push(newUser);
  
  // Сохраняем обновленный массив в localStorage и JSON
  saveUsers();
  
  // Возвращаем копию пользователя без пароля
  const { password: pass, ...safeUser } = newUser;
  return safeUser as User;
};

// Сохранение пользователей
const saveUsers = async () => {
  try {
    // Сохраняем пользователей через API сервис
    await saveUsersToJson(users);
    console.log('Пользователи успешно сохранены');
  } catch (error) {
    console.error('Ошибка при сохранении пользователей:', error);
  }
};

// Примечание: в реальном проекте с сервером мы бы обновляли JSON-файл через API
// В текущей реализации мы можем экспортировать пользователей в JSON-файл через функцию из apiService

// Инициализация - загрузка пользователей из localStorage или JSON при запуске
export const initializeUsers = async () => {
  try {
    // Загружаем пользователей из localStorage или JSON
    const loadedUsers = await getUsersFromJson();
    users = loadedUsers;
    console.log('Пользователи успешно загружены:', users);
  } catch (error) {
    console.error('Ошибка при загрузке пользователей:', error);
  }
};

// Экспорт всех пользователей для администрирования
export const getAllUsersData = (): User[] => {
  return [...users]; // Возвращаем копию массива, чтобы избежать непреднамеренных изменений
};
