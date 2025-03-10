/*
(i) Код потрапляє у підсумковий файл,
тільки коли викликана функція,
наприклад flsFunctions.spollers();
Або коли імпортовано весь файл,
наприклад, import "files/script.js";
Невикористовуваний (не викликаний)
код у підсумковий файл не потрапляє.

Якщо ми хочемо додати модуль
слід його розкоментувати
*/

// Увімкнути/вимкнути FLS (Full Logging System) (в роботі)
window['FLS'] = true;

// Підключення основного файлу стилів
import '../scss/style.scss';

//============================================================================================================================================================================================================================================
// React ========================================================================================================================================================================================================================================================
//============================================================================================================================================================================================================================================
// import Index from './react/Index.jsx';
//============================================================================================================================================================================================================================================

// ========================================================================================================================================================================================================================================================
// Функціонал ========================================================================================================================================================================================================================================================
// ========================================================================================================================================================================================================================================================
import * as flsFunctions from './files/functions.js';

/* Перевірка підтримки webp, додавання класу webp або no-webp для HTML */
/* (i) необхідно для коректного відображення webp із css */
// flsFunctions.isWebp();

import './libs/popup.js';
import './files/sliders.js';

// Спостерігач за об'єктами з атрибутом data-watch
// Документація: https://template.fls.guru/template-docs/modul-nabljudatel-za-poyavleniem-elementa-pri-skrolle.html
import './libs/watcher.js';

// Модуль паралаксу
// Документація: https://template.fls.guru/template-docs/paralaks-pri-skroli.html
import './libs/parallax.js';

/* Підключаємо файли зі своїм кодом */
import './files/calendar.js';
import './files/script.js';
//============================================================================================================================================================================================================================================
