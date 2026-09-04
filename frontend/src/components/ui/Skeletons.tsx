// FILE: frontend/src/components/ui/Skeletons.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Screen-shaped loading skeletons for detail, lesson, chat, and article views.
//   SCOPE: Hero, lesson, chat, and article pulse placeholders
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   HeroDetailSkeleton - hero plus content-card loading layout
//   LessonSkeleton - lesson header, progress, and body loading layout
//   ChatSkeleton - chat header and message-bubble loading layout
//   ArticleSkeleton - story image and comment loading layout
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';

// Переиспользуемые скелетоны загрузки в стиле дашборда (серые блоки animate-pulse),
// повторяют структуру экрана — вместо текста «Загрузка...».

/** Экран-деталь с «героем» сверху и карточкой контента (курс, организация). */
// START_CONTRACT: HeroDetailSkeleton
//   PURPOSE: Render a hero-plus-card loading placeholder
//   INPUTS: { none }
//   OUTPUTS: { ReactElement - pulse skeleton }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: HeroDetailSkeleton
export const HeroDetailSkeleton: React.FC = () => (
  <div className="w-full h-screen bg-white overflow-hidden animate-pulse">
    <div className="h-[35vh] w-full bg-gray-200" />
    <div className="relative bg-white rounded-t-2xl -mt-6 p-6 space-y-5">
      <div className="h-6 w-24 bg-gray-200 rounded-full" />
      <div className="space-y-2">
        <div className="h-7 w-3/4 bg-gray-200 rounded" />
        <div className="h-7 w-1/2 bg-gray-200 rounded" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-5/6 bg-gray-100 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
      </div>
      <div className="h-16 w-full bg-gray-100 rounded-2xl" />
      <div className="h-16 w-full bg-gray-100 rounded-2xl" />
    </div>
  </div>
);

/** Экран урока: шапка, полоса прогресса, абзацы текста. */
// START_CONTRACT: LessonSkeleton
//   PURPOSE: Render a lesson-screen loading placeholder
//   INPUTS: { none }
//   OUTPUTS: { ReactElement - pulse skeleton }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: LessonSkeleton
export const LessonSkeleton: React.FC = () => (
  <div className="w-full h-screen bg-white flex flex-col animate-pulse">
    <div className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center space-x-2">
      <div className="w-8 h-8 rounded-lg bg-gray-200" />
      <div className="space-y-2">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="w-full h-1 bg-gray-200" />
    <div className="flex-grow p-6 space-y-4">
      <div className="h-7 w-2/3 bg-gray-200 rounded" />
      <div className="h-4 w-full bg-gray-100 rounded" />
      <div className="h-4 w-full bg-gray-100 rounded" />
      <div className="h-4 w-5/6 bg-gray-100 rounded" />
      <div className="h-4 w-3/4 bg-gray-100 rounded" />
      <div className="h-4 w-full bg-gray-100 rounded" />
    </div>
    <div className="flex-shrink-0 p-4 border-t border-gray-100">
      <div className="h-14 w-full bg-gray-200 rounded-xl" />
    </div>
  </div>
);

/** Экран чата: шапка и чередующиеся «пузыри» сообщений. */
// START_CONTRACT: ChatSkeleton
//   PURPOSE: Render a chat-screen loading placeholder
//   INPUTS: { none }
//   OUTPUTS: { ReactElement - pulse skeleton }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: ChatSkeleton
export const ChatSkeleton: React.FC = () => (
  <div className="w-full h-screen bg-[#F0F0F0] flex flex-col animate-pulse">
    <div className="flex-shrink-0 p-4 bg-white border-b border-gray-200 flex items-center justify-between">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="h-5 w-40 bg-gray-200 rounded" />
      <div className="w-10 h-10 rounded-full bg-gray-200" />
    </div>
    <div className="flex-grow p-4 space-y-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`h-12 ${i % 2 ? 'w-1/2 bg-blue-200' : 'w-2/3 bg-white'} rounded-2xl shadow-sm`}
          />
        </div>
      ))}
    </div>
    <div className="flex-shrink-0 p-3 bg-white border-t border-gray-200">
      <div className="h-12 w-full bg-gray-100 rounded-full" />
    </div>
  </div>
);

/** Экран истории/статьи: картинка, строки текста, блок комментариев. */
// START_CONTRACT: ArticleSkeleton
//   PURPOSE: Render a story/article loading placeholder
//   INPUTS: { none }
//   OUTPUTS: { ReactElement - pulse skeleton }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: ArticleSkeleton
export const ArticleSkeleton: React.FC = () => (
  <div className="w-full h-screen bg-white flex flex-col animate-pulse">
    <div className="flex-shrink-0 p-4 flex items-center space-x-3 border-b border-gray-100">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="h-4 w-32 bg-gray-200 rounded" />
    </div>
    <div className="w-full aspect-square bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-full bg-gray-100 rounded" />
      <div className="h-4 w-5/6 bg-gray-100 rounded" />
      <div className="h-10 w-full bg-gray-100 rounded-2xl mt-4" />
      <div className="h-10 w-full bg-gray-100 rounded-2xl" />
    </div>
  </div>
);
