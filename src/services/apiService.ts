/**
 * Имитация API для работы с JSON-файлами
 * В реальном проекте эти функции были бы заменены на запросы к серверу
 */

import usersData from '../data/users.json';

// Импорт типа User
import type { User } from './userService';

// Запись в localStorage
export const saveUsersToJson = (users: User[]): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      // Сохраняем в localStorage для текущей сессии
      localStorage.setItem('fauna_users', JSON.stringify(users));
      
      console.log('Пользователи сохранены в localStorage:', users);
      resolve(true);
    } catch (error) {
      console.error('Ошибка при сохранении пользователей:', error);
      reject(error);
    }
  });
};

// Получение пользователей из localStorage или JSON-файла
export const getUsersFromJson = (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    try {
      const storedUsers = localStorage.getItem('fauna_users');
      if (storedUsers) {
        resolve(JSON.parse(storedUsers));
      } else {
        // Если в localStorage ничего нет, возвращаем начальных пользователей из JSON
        resolve(usersData as User[]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      reject(error);
    }
  });
};

// Экспорт пользователей в JSON файл, который можно скачать
export const exportUsersToJson = (): void => {
  // Получаем пользователей из localStorage
  const storedUsers = localStorage.getItem('fauna_users');
  if (!storedUsers) {
    alert('Нет данных пользователей для экспорта');
    return;
  }
  
  // Создание Blob с данными JSON
  const users = JSON.parse(storedUsers);
  const jsonData = JSON.stringify(users, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  // Создание ссылки для скачивания
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users.json';
  
  // Нажатие на ссылку для скачивания
  document.body.appendChild(a);
  a.click();
  
  // Удаление элемента из DOM после скачивания
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('Файл users.json создан и готов к скачиванию');
};

// Импорт пользователей из загруженного JSON-файла
export const importUsersFromJson = (fileContent: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      // Парсим JSON из файла
      const users = JSON.parse(fileContent) as User[];
      
      // Сохраняем в localStorage
      localStorage.setItem('fauna_users', JSON.stringify(users));
      
      console.log('Пользователи успешно импортированы:', users);
      resolve(true);
    } catch (error) {
      console.error('Ошибка при импорте пользователей:', error);
      reject(error);
    }
  });
};
