import React, { useEffect, useState } from 'react';
import { fetchCourseById } from '../../../lib/api';
import { useNavigate } from 'react-router';
import type { Course, CourseLesson } from '../../../lib/types';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  GraduationCap,
  Lock,
  PlayCircle,
  Share2,
  User,
} from 'lucide-react';
import { iconMap } from '../../../lib/iconMap';
import { buildDeepLink, tgShareUrl } from '../../../lib/telegram-sdk';

const LessonRow: React.FC<{
  lesson: CourseLesson;
  index: number;
  onSelect: () => void;
}> = ({ lesson, index, onSelect }) => {
  const getIcon = () => {
    switch (lesson.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'current':
        return <PlayCircle className="w-6 h-6 text-[#007AFF]" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-400" />;
      default:
        return null;
    }
  };

  const isClickable = lesson.status !== 'locked';
  const textColor =
    lesson.status === 'locked' ? 'text-gray-400' : 'text-[#0C0D0E]';

  return (
    <button
      onClick={onSelect}
      disabled={!isClickable}
      className={`w-full flex items-center p-4 rounded-xl space-x-4 ${
        isClickable ? 'hover:bg-gray-100' : 'cursor-default'
      } ${
        lesson.status === 'current' ? 'bg-blue-50' : ''
      } transition-colors text-left`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        <p className={`font-semibold ${textColor}`}>{`${index + 1}. ${
          lesson.type === 'test' ? 'Тест' : 'Урок'
        }: ${lesson.title}`}</p>
      </div>
    </button>
  );
};

const CourseDetailPage: React.FC<{
  id: number;
}> = ({ id }) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      const data = await fetchCourseById(id);
      if (data && data.program) {
        const completedIds = data.completedLessonIds || [];
        let isCurrentSet = false;
        const programWithStatus = data.program.map((lesson) => {
          if (completedIds.includes(lesson.id)) {
            return { ...lesson, status: 'completed' as const };
          }
          if (!isCurrentSet && data.status !== 'completed') {
            isCurrentSet = true;
            return { ...lesson, status: 'current' as const };
          }
          return { ...lesson, status: 'locked' as const };
        });

        const completedCount = programWithStatus.filter(
          (l) => l.status === 'completed',
        ).length;
        const totalLessons = programWithStatus.length;
        const progress =
          totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;

        setCourse({
          ...data,
          program: programWithStatus,
          progress: data.status === 'completed' ? 100 : progress,
          status:
            data.status === 'completed'
              ? 'completed'
              : progress > 0
              ? 'in-progress'
              : 'not-started',
        });
      } else {
        setCourse(data || null);
      }
      setLoading(false);
    };
    loadCourse();
  }, [id]);

  const onBack = () => navigate('/app/training');
  const onSelectLesson = (courseId: number, lessonId: number) =>
    navigate(`/app/courses/${courseId}/lesson/${lessonId}`);
  const onViewCertificate = (courseId: number) =>
    navigate(`/app/courses/${courseId}/certificate`);

  const handleCtaClick = () => {
    if (!course?.program) return;
    if (course.status === 'completed') {
      onViewCertificate(course.id);
    } else {
      const firstIncompleteLesson = course.program.find(
        (l) => l.status !== 'completed',
      );
      if (firstIncompleteLesson) {
        onSelectLesson(course.id, firstIncompleteLesson.id);
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
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Загрузка курса...
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen font-sans antialiased bg-white overflow-y-auto">
      <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
          aria-label="Назад"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => course && tgShareUrl(buildDeepLink('course', course.id), `Курс «${course.title}» в Добро Club`)}
          className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
          aria-label="Поделиться"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
      </header>

      <div className="h-[40vh] w-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex flex-col items-center justify-center text-center p-4">
        {(() => {
          const IconComponent = iconMap[course.icon] || GraduationCap;
          return <IconComponent className="w-24 h-24 text-white/60 mb-4" />;
        })()}
        <h1 className="text-3xl font-bold text-white shadow-sm">{course.title}</h1>
      </div>

      <div className="relative bg-white rounded-t-2xl -mt-6 p-6 space-y-6">
        <section className="flex justify-around items-center bg-gray-50 rounded-xl p-3 text-sm text-center">
          <div className="flex flex-col items-center space-y-1">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-[rgb(12,13,14,0.52)]">
              {course.duration}
            </span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <GraduationCap className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-[rgb(12,13,14,0.52)]">
              {course.hasCertificate ? 'Сертификат' : 'Без сертификата'}
            </span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-[rgb(12,13,14,0.52)]">
              {course.level}
            </span>
          </div>
        </section>

        {course.status !== 'not-started' && (
          <section>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] h-2.5 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-right mt-1 text-[rgb(12,13,14,0.52)]">
              Пройдено {course.progress}%
            </p>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-[#0C0D0E] mb-2">О чем этот курс?</h2>
          <p className="text-[rgb(12,13,14,0.52)] leading-relaxed">
            {course.description}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Программа</h2>
          <div className="space-y-2">
            {course.program?.map((lesson, index) => (
              <LessonRow
                key={index}
                lesson={lesson}
                index={index}
                onSelect={() => onSelectLesson(course.id, lesson.id)}
              />
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