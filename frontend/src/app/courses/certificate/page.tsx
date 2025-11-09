import React from 'react';
import type {Course, User} from '../../../lib/types';
import {ArrowLeftIcon, DownloadIcon, HeartHandIcon, ShareIcon} from '../../../components/ui/icons';

const CertificatePage: React.FC<{
  courseId: number;
  allCourses: Course[]; // Passed down to avoid re-fetching all courses
  user: User;
  onBack: () => void;
}> = ({courseId, allCourses, user, onBack}) => {

  const course = allCourses.find(c => c.id === courseId);

  if (!course) {
    return <div className="w-full h-screen flex items-center justify-center">Сертификат не найден.</div>;
  }

  const userName = `${user.firstName} ${user.lastName}`;
  const issueDate = new Date().toLocaleDateString('ru-RU');
  const certificateId = `CERT-${String(course.id).padStart(4, '0')}-${new Date().getFullYear()}`;

  return (
    <div className="w-full h-screen font-sans antialiased bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                  aria-label="Назад">
            <ArrowLeftIcon className="w-6 h-6 text-gray-600"/>
          </button>
          <h1 className="text-lg font-bold text-[#0C0D0E] mx-auto">Ваш сертификат</h1>
          <div className="w-10"></div>
          {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {/* Certificate Element */}
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border-2 border-blue-200 aspect-[5/7] flex flex-col relative overflow-hidden">
          {/* Watermark */}
          <HeartHandIcon className="absolute -bottom-10 -right-10 w-48 h-48 text-gray-100/50 transform rotate-12"/>

          {/* Header with Logo */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <HeartHandIcon className="w-8 h-8 text-[#007AFF]"/>
              <span className="font-bold text-lg">MAX<span className="text-[#007AFF]">Добро</span></span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow flex flex-col justify-center items-center text-center space-y-3">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-gray-500 uppercase">СЕРТИФИКАТ</h2>
            <p className="text-base text-gray-600 pt-4">Настоящим подтверждается, что</p>
            <h1 className="text-4xl font-serif text-[#0C0D0E]">{userName}</h1>
            <p className="text-base text-gray-600">успешно прошел(а) курс</p>
            <h3 className="text-2xl font-serif text-[#007AFF] leading-tight">«{course.title}»</h3>
          </div>

          {/* Footer with Date/ID */}
          <div className="text-xs text-gray-400 flex justify-between pt-4 border-t border-gray-100 mt-4">
            <span>Дата: {issueDate}</span>
            <span>ID: {certificateId}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 w-full max-w-sm flex space-x-4">
          <button
            className="flex-1 flex items-center justify-center space-x-2 bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-colors">
            <ShareIcon className="w-5 h-5"/>
            <span>Поделиться</span>
          </button>
          <button
            className="flex-1 flex items-center justify-center space-x-2 bg-white border-2 border-[#007AFF] text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors">
            <DownloadIcon className="w-5 h-5"/>
            <span>Сохранить в PDF</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default CertificatePage;
