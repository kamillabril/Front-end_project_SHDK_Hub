ЩДК.Hub — веб-платформа для ведучих та гравців інтелектуальної гри "Що? Де? Коли?" який покриває потреби ведучих у зручному інструменті для підготовки та проведення ігор.

Мета проєкту:  
Створити простий, функціональний інструмент для:  
  - Створення пакетів з питаннями
  - Додавання та редагування питань
  - Персоналізованої взаємодії з користувачем

Основні функції:
 -  Авторизація користувачів
 -  Створення нових пакетів
  - Додавання та перегляд питань
  - Відтворення гри — покроково, з таймером
 -  Власник або адмін може видаляти питання
 -  Сторінка профілю з особистою статистикою
 -  Базова перевірка прав доступу (гостьовий режим без редагування)

client/               
 ├── App.tsx          # Головний компонент, маршрутизація, логіка авторизації\
 ├── App.css          # Базові стилі для застосунку\
 ├── types.ts         # Типи: Package, Question\
 ├── index.tsx        # Точка входу у React-додаток\
 └── pages/           # RegisterPage, HomePage, PackagePage, PlayPage, ProfilePage\
 └── components/      # Header, окремі UI-компоненти

server/\
 ├── index.js         # Основні маршрути Express API\
 └── db.js            # Конфігурація підключення до PostgreSQL

PostgreSQL            # Таблиці: users, packages, questions

