import React, {useEffect, useMemo, useState} from 'react';
import {courseCategories} from '../../../lib/mockData';
import {fetchAllCourses} from '../../../lib/api';
import type {Course} from '../../../lib/types';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  EmptySearchIcon,
  NatureProtectorIcon
} from '../../../components/ui/icons';
import EmptyState from '../../../components/ui/EmptyState';

const CourseSkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 animate-pulse w-full">
    <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0"></div>
    <div className="flex-1 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-2 bg-gray-200 rounded-full w-full mt-2"></div>
    </div>
  </div>
);

const CourseCard: React.FC<{ course: Course; onSelect: () => void; }> = React.memo(({course, onSelect}) => (
  <button onClick={onSelect}
          className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 w-full text-left transition-transform duration-200 active:scale-95">
    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center">
      <course.Icon className="w-14 h-14"/>
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-lg text-[#0C0D0E]">{course.title}</h3>
      <p className="text-sm text-[rgb(12,13,14,0.52)] mt-1">{course.description}</p>
      <div className="flex items-center space-x-4 text-xs text-[rgb(12,13,14,0.52)] mt-2">
        <div className="flex items-center space-x-1">
          <ClockIcon className="w-4 h-4"/>
          <span>{course.duration}</span>
        </div>
        {course.hasCertificate && (
          <div className="flex items-center space-x-1">
            <AcademicCapIcon className="w-4 h-4"/>
            <span>Сертификат</span>
          </div>
        )}
      </div>
      {course.status === 'in-progress' && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-[#007AFF] h-1.5 rounded-full" style={{width: `${course.progress}%`}}></div>
          </div>
        </div>
      )}
      {course.status === 'completed' && (
        <div className="flex items-center space-x-1 text-[#1ABE43] mt-2 font-semibold text-sm">
          <CheckCircleIcon className="w-5 h-5"/>
          <span>Курс пройден</span>
        </div>
      )}
    </div>
  </button>
));

const CoursesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const courses = await fetchAllCourses();
        setAllCourses(courses);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить курсы.");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const onSelectCourse = (id: number) => {
    window.location.hash = `#/courses/${id}`;
  };

  const filteredCourses = useMemo(() => {
    if (selectedCategory === 'Все') return allCourses;
    return allCourses.filter(c => c.category === selectedCategory);
  }, [selectedCategory, allCourses]);

  return (
    <div className="w-full bg-white">
      <header className="p-6">
        <h1 className="text-[28px] font-bold text-[#0C0D0E]">Обучение</h1>
      </header>

      <div className="px-6 mb-6">
        <div
          className="bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] rounded-[20px] p-6 flex items-center text-white shadow-lg">
          <div className="flex-1">
            <h2 className="font-bold text-xl">Курс недели</h2>
            <p className="text-sm mt-1 opacity-90">Эко-волонтерство: С чего начать?</p>
            <button onClick={() => onSelectCourse(2)}
                    className="mt-4 bg-white/30 text-white font-semibold py-2 px-4 rounded-lg text-sm">Начать
            </button>
          </div>
          <NatureProtectorIcon className="w-20 h-20 opacity-80"/>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 -mx-6 px-6">
          {courseCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-[#007AFF] text-white' : 'bg-gray-100 text-[#0C0D0E]'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="px-6 space-y-4">
        {loading ? (
          <>
            <CourseSkeletonCard/>
            <CourseSkeletonCard/>
            <CourseSkeletonCard/>
          </>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onSelect={() => onSelectCourse(course.id)}/>
          ))
        ) : (
          <EmptyState
            Icon={EmptySearchIcon}
            title="Курсы не найдены"
            subtitle="Новые курсы по этой теме скоро появятся здесь!"
          />
        )}
      </main>
    </div>
  );
};

export default CoursesPage;
