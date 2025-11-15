import React from 'react';
import type { SVGProps } from 'react';

// --- Типы ---
type IconProps = SVGProps<SVGSVGElement>;

// --- Стили ---
// Добавлен новый класс .inner-pulse-heart для внутреннего элемента
const styles = `
  /* Анимация масштабирования, используется обоими элементами */
  @keyframes scale-pulse-animation {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  /* Класс для всей SVG-иконки (внешняя пульсация) */
  .pulsating-heart-container {
    animation: scale-pulse-animation 2s ease-in-out infinite;
    transform-origin: center;
  }

  /* Класс для нового внутреннего сердца */
  .inner-pulse-heart {
    /* Используем ту же анимацию, но с задержкой */
    animation: scale-pulse-animation 2s ease-in-out infinite;
    animation-delay: -0.25s; /* Задержка создает эффект эха */
    
    /* Устанавливаем базовую прозрачность */
    opacity: 0.7;
    
    /* Центрируем трансформацию */
    transform-origin: center;
  }
`;

/**
 * Анимированная иконка-сердце с двойным эффектом пульсации.
 * Внутренняя часть пульсирует асинхронно с основной.
 * @param {IconProps} props - Стандартные SVG-атрибуты.
 */
const HeartIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <>
    <style>{styles}</style>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="64"
      height="64"
      // Применяем анимацию к контейнеру SVG
      className={`pulsating-heart-container ${className || ''}`}
      {...props}
    >
      <defs>
        <linearGradient id="pulsatingHeartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5B9BFF" />
          <stop offset="100%" stopColor="#7B61FF" />
        </linearGradient>
      </defs>
      
      {/* СЛОЙ 1: Внешнее сердце с градиентом (самый нижний слой) */}
      <path
        fill="url(#pulsatingHeartGradient)"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
      
      {/* СЛОЙ 2: Белая "вырезанная" область (средний слой) */}
      <path
        fill="white"
        d="M12 18.5l-1.16-1.06C6.73 13.56 4 11.08 4 8.5 4 6.5 5.5 5 7.5 5c1.48 0 2.87.69 3.75 1.75L12 7.88l.75-1.13C13.63 5.69 15.02 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.58-2.73 5.06-6.84 8.94L12 18.5z"
      />

      {/* СЛОЙ 3: Новое пульсирующее полупрозрачное сердце (самый верхний слой) */}
      {/* Оно имеет ту же форму, что и белая область, но немного меньше */}
      <path
        className="inner-pulse-heart"
        fill="url(#pulsatingHeartGradient)"
        d="M12 18.5l-1.16-1.06C6.73 13.56 4 11.08 4 8.5 4 6.5 5.5 5 7.5 5c1.48 0 2.87.69 3.75 1.75L12 7.88l.75-1.13C13.63 5.69 15.02 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.58-2.73 5.06-6.84 8.94L12 18.5z"
        // Уменьшаем его статически, чтобы оно помещалось внутри белой области
        transform="scale(0.8)" 
      />
    </svg>
  </>
);

export default HeartIcon;