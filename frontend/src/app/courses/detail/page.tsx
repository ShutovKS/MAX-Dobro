import React, {useEffect, useState} from 'react';
import {fetchCourseById} from '../../../lib/api';
import type {Course, CourseLesson} from '../../../lib/types';
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
  PlayCircleIcon,
  ShareIcon,
  UserIcon
} from '../../../components/ui/icons';

const LessonRow: React.FC<{ lesson: CourseLesson; index: number; onSelect: () => void }> = ({
                                                                                              lesson,
                                                                                              index,
                                                                                              onSelect
                                                                                            }) => {
  const getIcon = () => {
    switch (lesson.status) {
      case 'completed':
        return <CheckCircleIcon className="w-6 h-6 text-green-500"/>;
      case 'current':
        return <PlayCircleIcon className="w-6 h-6 text-[#007AFF]"/>;
      case 'locked':
        return <LockClosedIcon className="w-6 h-6 text-gray-400"/>;
      default:
        return null;
    }
  };

  const isClickable = lesson.status !== 'locked' && (lesson.type === 'test' || lesson.content);
  const textColor = lesson.status === 'locked' ? 'text-gray-400' : 'text-[#0C0D0E]';

  return (
    <button
      onClick={onSelect}
      disabled={!isClickable}
      className={`w-full flex items-center p-4 rounded-xl space-x-4 ${isClickable ? 'hover:bg-gray-100' : 'cursor-default'} ${lesson.status === 'current' ? 'bg-blue-50' : ''} transition-colors text-left`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        <p
          className={`font-semibold ${textColor}`}>{`${index + 1}. ${lesson.type === 'test' ? 'Тест' : 'Урок'}: ${lesson.title}`}</p>
      </div>
    </button>
  );
};

const CourseDetailPage: React.FC<{
  id: number;
}> = ({id}) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      const data = await fetchCourseById(id);
      if (data) setCourse(data);
      setLoading(false);
    };
    loadCourse();
  }, [id]);

  const onBack = () => window.location.hash = '#/training';
  const onSelectLesson = (courseId: number, lessonIndex: number) => window.location.hash = `#/courses/${courseId}/lesson/${lessonIndex}`;
  const onViewCertificate = (courseId: number) => window.location.hash = `#/courses/${courseId}/certificate`;

  const handleCtaClick = () => {
    if (!course) return;
    if (course.status === 'completed') {
      onViewCertificate(course.id);
    } else {
      const currentLessonIndex = course.program.findIndex(l => l.status === 'current');
      if (currentLessonIndex !== -1) {
        onSelectLesson(course.id, currentLessonIndex);
      } else {
        // If no 'current', start from the first non-completed one
        const firstLessonIndex = course.program.findIndex(l => l.status !== 'completed');
        if (firstLessonIndex !== -1) {
          onSelectLesson(course.id, firstLessonIndex);
        }
      }
    }
  };

  const getButtonText = () => {
    if (!course) return '';
    switch (course.status) {
      case 'completed':
        return 'Посмотреть сертификат';
      case 'in-progress':
        return 'Продолжить';
      default:
        return 'Начать обучение';
    }
  };

  if (loading || !course) {
    return <div className="w-full h-screen flex items-center justify-center">Загрузка курса...</div>;
  }

  return (
    <div className="relative w-full h-screen font-sans antialiased bg-white overflow-y-auto">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
        <button onClick={onBack} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                aria-label="Назад">
          <ArrowLeftIcon className="w-6 h-6 text-white"/>
        </button>
        <button className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center" aria-label="Поделиться">
          <ShareIcon className="w-5 h-5 text-white"/>
        </button>
      </header>

      {/* Course Cover */}
      <div
        className="h-[40vh] w-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex flex-col items-center justify-center text-center p-4">
        <course.Icon className="w-24 h-24 text-white/60 mb-4"/>
        <h1 className="text-3xl font-bold text-white shadow-sm">{course.title}</h1>
      </div>

      <div className="relative bg-white rounded-t-2xl -mt-6 p-6 space-y-6">
        {/* Meta-information */}
        <section className="flex justify-around items-center bg-gray-50 rounded-xl p-3 text-sm text-center">
          <div className="flex flex-col items-center space-y-1">
            <ClockIcon className="w-5 h-5 text-gray-500"/>
            <span className="font-semibold text-[rgb(12,13,14,0.52)]">{course.duration}</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <AcademicCapIcon className="w-5 h-5 text-gray-500"/>
            <span
              className="font-semibold text-[rgb(12,13,14,0.52)]">{course.hasCertificate ? 'Сертификат' : 'Без сертификата'}</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <UserIcon className="w-5 h-5 text-gray-500"/>
            <span className="font-semibold text-[rgb(12,13,14,0.52)]">{course.level}</span>
          </div>
        </section>

        {/* Description */}
        <section>
          <h2 className="text-xl font-bold text-[#0C0D0E] mb-2">О чем этот курс?</h2>
          <p className="text-[rgb(12,13,14,0.52)] leading-relaxed">{course.description}</p>
        </section>

        {/* Program */}
        <section>
          <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Программа</h2>
          <div className="space-y-2">
            {course.program.map((lesson, index) => (
              <LessonRow key={index} lesson={lesson} index={index} onSelect={() => onSelectLesson(course.id, index)}/>
            ))}
          </div>
        </section>
      </div>

      <div className="h-28"></div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <button
          onClick={handleCtaClick}
          className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] hover:opacity-90"
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default CourseDetailPage;
