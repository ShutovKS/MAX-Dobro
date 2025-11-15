import React, { useEffect, useMemo, useState } from 'react';
import type { Course } from '../../../lib/types';
import { Check, Puzzle, Trophy, X } from 'lucide-react';
import CourseCompleteModal from '../../../components/ui/CourseCompleteModal';
import { fetchCourseById, completeCourse } from '../../../lib/api';

const TestResultModal: React.FC<{
  isOpen: boolean;
  result: 'passed' | 'failed' | null;
  score: number;
  totalQuestions: number;
  onTryAgain: () => void;
  onViewCertificate: () => void;
  onBackToLesson: () => void;
}> = ({
  isOpen,
  result,
  score,
  totalQuestions,
  onTryAgain,
  onViewCertificate,
  onBackToLesson,
}) => {
  if (!isOpen) return null;

  const isSuccess = result === 'passed';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        {isSuccess ? (
          <>
            <Trophy className="w-24 h-24 text-yellow-400" />
            <h2 className="text-2xl font-bold text-[#1ABE43]">
              Отлично! Тест пройден!
            </h2>
            <p className="text-[rgb(12,13,14,0.52)]">
              Вы набрали {score}/{totalQuestions} баллов. Теперь вы готовы
              помогать еще эффективнее!
            </p>
            <button
              onClick={onViewCertificate}
              className="w-full bg-[linear-gradient(158deg,#14E1D5_6.15%,#03C722_85.68%)] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            >
              Посмотреть сертификат
            </button>
            <button
              onClick={onBackToLesson}
              className="text-sm text-[rgb(12,13,14,0.52)] font-semibold"
            >
              Закрыть
            </button>
          </>
        ) : (
          <>
            <Puzzle className="w-24 h-24 text-[#FF9315]" />
            <h2 className="text-2xl font-bold text-[#0C0D0E]">Почти у цели!</h2>
            <p className="text-[rgb(12,13,14,0.52)]">
              {`Ваш результат: ${score} из ${totalQuestions}. Повторение — мать учения. Попробуйте еще раз, чтобы закрепить знания!`}
            </p>
            <div className="w-full flex flex-col space-y-3 pt-2">
              <button
                onClick={onTryAgain}
                className="w-full bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
              >
                Попробовать снова
              </button>
              <button
                onClick={onBackToLesson}
                className="w-full bg-transparent text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Вернуться к уроку
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const saveLessonProgress = (courseId: number, lessonId: number) => {
  const storageKey = `course_progress_${courseId}`;
  const completedLessons: number[] = JSON.parse(
    localStorage.getItem(storageKey) || '[]',
  );
  if (!completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
    localStorage.setItem(storageKey, JSON.stringify(completedLessons));
  }
};

const renderMarkdown = (text: string | undefined) => {
  if (!text) return null;

  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .split('\n\n')
    .map((paragraph) => {
      if (paragraph.trim().startsWith('- ')) {
        const listItems = paragraph
          .trim()
          .split('\n')
          .map((item) => `<li>${item.trim().substring(2)}</li>`)
          .join('');
        return `<ul>${listItems}</ul>`;
      }
      return `<p>${paragraph}</p>`;
    })
    .join('');

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const LessonPage: React.FC<{
  courseId: number;
  lessonId: number;
  onClose: () => void;
  onComplete: (courseId: number) => void;
}> = ({ courseId, lessonId, onClose, onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<'passed' | 'failed' | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showCourseCompleteModal, setShowCourseCompleteModal] = useState(false);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      try {
        const data = await fetchCourseById(courseId);
        setCourse(data);
      } catch (error) {
        console.error('Failed to load course for lesson page:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const lesson = useMemo(() => {
    if (!course?.program) return null;
    return course.program.find((l) => l.id === lessonId);
  }, [course, lessonId]);

  const lessonIndex = useMemo(() => {
    if (!course?.program || !lesson) return -1;
    return course.program.findIndex((l) => l.id === lessonId);
  }, [course, lesson, lessonId]);

  const handleAnswerChange = (questionId: string, answerId: number) => {
    if (!lesson?.quiz) return;
    const question = lesson.quiz.find((q) => q.id === questionId);
    if (!question) return;

    setAnswers((prev) => {
      const newAnswers = { ...prev };
      if (question.type === 'single') {
        newAnswers[questionId] = [answerId];
      } else {
        const currentAnswers = prev[questionId] || [];
        newAnswers[questionId] = currentAnswers.includes(answerId)
          ? currentAnswers.filter((id) => id !== answerId)
          : [...currentAnswers, answerId];
      }
      return newAnswers;
    });
  };

  const handleSubmitTest = async () => {
    if (!lesson?.quiz || !course?.program) return;

    const storageKey = `course_${courseId}_answers`;
    const allAnswers = JSON.parse(localStorage.getItem(storageKey) || '{}');
    Object.assign(allAnswers, answers);
    localStorage.setItem(storageKey, JSON.stringify(allAnswers));

    setIsSubmitted(true);

    const isFinalTest = lessonIndex === course.program.length - 1;

    let answersToSubmit = Object.entries(answers).flatMap(
      ([questionId, answerIds]: [string, number[]]) =>
        answerIds.map((answerId) => ({
          questionId: parseInt(questionId, 10),
          answerId,
        })),
    );

    if (isFinalTest) {
      answersToSubmit = Object.entries(allAnswers).flatMap(
        ([questionId, answerIds]: [string, number[]]) =>
          answerIds.map((answerId) => ({
            questionId: parseInt(questionId, 10),
            answerId,
          })),
      );
    }

    try {
      const result = await completeCourse(course.id, answersToSubmit);

      setScore(result.score);
      setTotalQuestions(result.totalQuestions);
      setTestResult(result.isPassed ? 'passed' : 'failed');
      setShowResultModal(true);

      if (result.isPassed) {
        saveLessonProgress(courseId, lessonId);
        if (isFinalTest) {
          localStorage.removeItem(storageKey);
          setTimeout(() => {
            setShowResultModal(false);
            setShowCourseCompleteModal(true);
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Failed to submit test:', error);
      setScore(0);
      setTotalQuestions(lesson.quiz.length);
      setTestResult('failed');
      setShowResultModal(true);
    }
  };

  const handleTryAgain = () => {
    setAnswers({});
    setIsSubmitted(false);
    setTestResult(null);
    setScore(0);
    setShowResultModal(false);
  };

  const handleContinue = () => {
    if (lesson?.type === 'lesson') {
      saveLessonProgress(courseId, lessonId);
    }
    onClose();
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Урок не найден.
      </div>
    );
  }

  const isTest = lesson.type === 'test';
  const allQuestionsAnswered =
    isTest && lesson.quiz?.every((q) => answers[q.id]?.length > 0);

  return (
    <>
      <div className="w-full h-screen font-sans antialiased bg-white flex flex-col">
        <header className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
              {isTest ? (
                <Puzzle className="w-5 h-5 text-[#007AFF]" />
              ) : (
                <Check className="w-5 h-5 text-[#007AFF]" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">{course.title}</p>
              <h1 className="text-lg font-bold text-[#0C0D0E]">{lesson.title}</h1>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </header>

        <div className="w-full h-1 bg-gray-200">
          <div
            className="h-1 bg-[#007AFF]"
            style={{
              width: `${
                course.program
                  ? ((lessonIndex + 1) / course.program.length) * 100
                  : 0
              }%`,
            }}
          ></div>
        </div>

        <main className="flex-grow overflow-y-auto p-6 space-y-6">
          {isTest ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{lesson.contentTitle}</h2>
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                {renderMarkdown(lesson.content)}
              </div>
              {lesson.quiz?.map((q, index) => (
                <div key={q.id} className="border-t border-gray-200 pt-4">
                  <p className="font-semibold">{`${index + 1}. ${
                    q.question
                  }`}</p>
                  <div className="mt-2 space-y-2">
                    {q.options.map((opt) => {
                      const answerId = q.answerIds?.[opt];
                      if (answerId === undefined) return null;

                      const isChecked = answers[q.id]?.includes(answerId);

                      const correctAnswersForQuestion =
                        q.type === 'single'
                          ? q.correctAnswer
                            ? [q.answerIds?.[q.correctAnswer]]
                            : []
                          : q.correctAnswers?.map(
                              (ans) => q.answerIds?.[ans],
                            ) || [];

                      const isCorrect = correctAnswersForQuestion.includes(
                        answerId,
                      );

                      return (
                        <label
                          key={opt}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${
                            isSubmitted
                              ? isCorrect
                                ? 'border-green-400 bg-green-50'
                                : isChecked
                                ? 'border-red-400 bg-red-50'
                                : 'border-gray-200'
                              : 'border-gray-200'
                          }`}
                        >
                          <input
                            type={q.type === 'single' ? 'radio' : 'checkbox'}
                            name={q.id}
                            value={opt}
                            checked={isChecked}
                            onChange={() => handleAnswerChange(q.id, answerId)}
                            disabled={isSubmitted}
                            className="w-5 h-5"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="prose max-w-none">
              <h2>{lesson.contentTitle}</h2>
              {renderMarkdown(lesson.content)}
            </div>
          )}
        </main>

        <footer className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <button
            onClick={isTest ? handleSubmitTest : handleContinue}
            disabled={isTest && !allQuestionsAnswered}
            className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isTest ? 'Проверить ответы' : 'Завершить урок'}
          </button>
        </footer>
      </div>
      <TestResultModal
        isOpen={showResultModal}
        result={testResult}
        score={score}
        totalQuestions={totalQuestions}
        onTryAgain={handleTryAgain}
        onBackToLesson={() => setShowResultModal(false)}
        onViewCertificate={() => onComplete(courseId)}
      />
      <CourseCompleteModal
        isOpen={showCourseCompleteModal}
        courseTitle={course.title}
        onClose={() => {
          setShowCourseCompleteModal(false);
          onClose();
        }}
        onViewCertificate={() => onComplete(courseId)}
      />
    </>
  );
};

export default LessonPage;