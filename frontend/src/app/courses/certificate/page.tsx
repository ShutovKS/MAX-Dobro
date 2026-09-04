// FILE: frontend/src/app/courses/certificate/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Render a completed-course certificate with share and download actions.
//   SCOPE: Certificate card, Telegram share, PNG export
//   DEPENDS: M-FRONTEND-UI, M-FRONTEND-TYPES, M-FRONTEND-TELEGRAM
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   CertificatePage - course completion certificate screen
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useRef} from 'react';
import {toPng} from 'html-to-image';
import type {Course, User} from '../../../lib/types';
import {ArrowLeft, Download, Share2} from 'lucide-react';
import {HeartHandIcon} from '../../../components/ui/icons';
import {CERTIFICATE_DEFAULTS} from '../../../lib/constants';
import {buildDeepLink, tgDownloadFile, tgHaptic, tgShareUrl} from '../../../lib/telegram-sdk';
import {useTelegramBackButton} from '../../../lib/useTelegramUI';

// START_CONTRACT: CertificatePage
//   PURPOSE: Show a course certificate and share or download it
//   INPUTS: { courseId: number; allCourses: Course[]; user: User; onBack: () => void }
//   OUTPUTS: { ReactElement - certificate card or not-found }
//   SIDE_EFFECTS: tgShareUrl, tgDownloadFile, haptic
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
// END_CONTRACT: CertificatePage
const CertificatePage: React.FC<{
  courseId: number;
  allCourses: Course[];
  user: User;
  onBack: () => void;
}> = ({courseId, allCourses, user, onBack}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useTelegramBackButton(onBack);

  const course = allCourses.find(c => c.id === courseId);

  if (!course) {
    return <div className="w-full h-screen flex items-center justify-center">Сертификат не найден.</div>;
  }

  const userName = `${user.firstName} ${user.lastName}`;
  const issueDate = new Date().toLocaleDateString('ru-RU');
  const certificateId = `${CERTIFICATE_DEFAULTS.ID_PREFIX}${String(course.id).padStart(CERTIFICATE_DEFAULTS.ID_PADDING, CERTIFICATE_DEFAULTS.ID_PAD_CHAR)}-${new Date().getFullYear()}`;

  // START_BLOCK_SHARE_DOWNLOAD
  const handleShare = () => {
    tgShareUrl(
      buildDeepLink('course', course.id),
      `Я прошёл(ла) курс «${course.title}» в Добро Club! 🎓`,
    );
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      tgDownloadFile({ url: dataUrl, file_name: `certificate-${certificateId}.png` });
      tgHaptic.notification('success');
    } catch (e) {
      console.error('Failed to export certificate:', e);
    }
  };
  // END_BLOCK_SHARE_DOWNLOAD

  // START_BLOCK_RENDER_CERTIFICATE
  return (
    <div className="w-full h-screen font-sans antialiased bg-gray-100 flex flex-col">
      <header className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                  aria-label="Назад">
            <ArrowLeft className="w-6 h-6 text-gray-600"/>
          </button>
          <h1 className="text-lg font-bold text-[#0C0D0E] mx-auto">Ваш сертификат</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div
          ref={cardRef}
          className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border-2 border-blue-200 aspect-[5/7] flex flex-col relative overflow-hidden">
          <HeartHandIcon className="absolute -bottom-10 -right-10 w-48 h-48 text-gray-100/50 transform rotate-12"/>

          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <HeartHandIcon className="w-8 h-8 text-[#007AFF]"/>
              <span className="font-bold text-lg">MAX<span className="text-[#007AFF]">Добро</span></span>
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center text-center space-y-3">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-gray-500 uppercase">СЕРТИФИКАТ</h2>
            <p className="text-base text-gray-600 pt-4">Настоящим подтверждается, что</p>
            <h1 className="text-4xl font-serif text-[#0C0D0E]">{userName}</h1>
            <p className="text-base text-gray-600">успешно прошел(а) курс</p>
            <h3 className="text-2xl font-serif text-[#007AFF] leading-tight">«{course.title}»</h3>
          </div>

          <div className="text-xs text-gray-400 flex justify-between pt-4 border-t border-gray-100 mt-4">
            <span>Дата: {issueDate}</span>
            <span>ID: {certificateId}</span>
          </div>
        </div>

        <div className="mt-8 w-full max-w-sm flex space-x-4">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-colors">
            <Share2 className="w-5 h-5"/>
            <span>Поделиться</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center space-x-2 bg-white border-2 border-[#007AFF] text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors">
            <Download className="w-5 h-5"/>
            <span>Сохранить</span>
          </button>
        </div>
      </main>
    </div>
  );
  // END_BLOCK_RENDER_CERTIFICATE
};

export default CertificatePage;