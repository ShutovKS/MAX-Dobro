import React, {useEffect, useMemo, useState} from 'react';
import {fetchAllCourses} from '../../../lib/api';
import type {Course, User} from '../../../lib/types';
import {DiplomaStandIllustrationIcon, HeartHandIcon} from '../../../components/ui/icons';
import {ArrowLeft} from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState';

const CertificatePreviewCard: React.FC<{ course: Course; userName: string; onSelect: () => void; }> = ({
                                                                                                         course,
                                                                                                         userName,
                                                                                                         onSelect
                                                                                                       }) => (
  <button onClick={onSelect}
          className="bg-white rounded-2xl shadow-lg w-full p-4 border-2 border-transparent hover:border-blue-400 aspect-[5/7] flex flex-col relative overflow-hidden transition-all duration-200 active:scale-95">
    <HeartHandIcon className="absolute -bottom-6 -right-6 w-24 h-24 text-gray-100/70 transform rotate-12"/>
    <div className="flex items-center space-x-1.5 mb-4">
      <HeartHandIcon className="w-6 h-6 text-[#007AFF]"/>
      <span className="font-bold text-sm">MAX<span className="text-[#007AFF]">Добро</span></span>
    </div>
    <div className="flex-grow flex flex-col justify-center items-center text-center space-y-1">
      <h2 className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">СЕРТИФИКАТ</h2>
      <p className="text-xs text-gray-500 pt-2">Настоящим подтверждается, что</p>
      <h1 className="text-xl font-serif text-[#0C0D0E] leading-tight">{userName}</h1>
      <p className="text-xs text-gray-500">успешно прошел(а) курс</p>
      <h3 className="text-base font-serif text-[#007AFF] leading-tight mt-1">«{course.title}»</h3>
    </div>
  </button>
);

const MyCertificatesPage: React.FC<{
  user: User;
  onBack: () => void;
  onSelectCertificate: (courseId: number) => void;
  onGoToTraining: () => void;
}> = ({user, onBack, onSelectCertificate, onGoToTraining}) => {

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const courses = await fetchAllCourses();
        setAllCourses(courses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const completedCourses = useMemo(() => {
    return allCourses.filter(c => c.status === 'completed' && c.hasCertificate);
  }, [allCourses]);

  const userName = `${user.firstName} ${user.lastName}`;

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-500">Загрузка сертификатов...</p>;
    }
    if (completedCourses.length > 0) {
      return (
        <div className="grid grid-cols-2 gap-4">
          {completedCourses.map(course => (
            <CertificatePreviewCard
              key={course.id}
              course={course}
              userName={userName}
              onSelect={() => onSelectCertificate(course.id)}
            />
          ))}
        </div>
      );
    }
    return (
      <EmptyState
        Icon={DiplomaStandIllustrationIcon}
        title="Знания ждут вас"
        subtitle="Пройдите свой первый курс, чтобы получить красивый сертификат и новые навыки."
        action={{
          text: 'Перейти к обучению',
          onClick: onGoToTraining,
          type: 'primary'
        }}
      />
    );
  };

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-2xl font-bold text-[#0C0D0E] mx-auto">Мои сертификаты</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default MyCertificatesPage;
