import React, {useMemo, useState} from 'react';
import type {Course} from '../../../lib/types';
import {Check, Puzzle, Trophy, X} from 'lucide-react';
import CourseCompleteModal from '../../../components/ui/CourseCompleteModal';

const TestResultModal: React.FC<{
  isOpen: boolean;
  result: 'passed' | 'failed' | null;
  score: number;
  totalQuestions: number;
  onTryAgain: () => void;
  onViewCertificate: () => void;
  onBackToLesson: () => void;
}> = ({isOpen, result, score, totalQuestions, onTryAgain, onViewCertificate, onBackToLesson}) => {
  if (!isOpen) return null;

  const isSuccess = result === 'passed';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        {isSuccess ? (
          <>
            <Trophy className="w-24 h-24 text-yellow-400"/>
            <h2 className="text-2xl font-bold text-[#1ABE43]">Отлично! Тест пройден!</h2>
            <p className="text-[rgb(12,13,14,0.52)]">
              Вы набрали {score}/{totalQuestions} баллов. Теперь вы готовы помогать еще эффективнее!
            </p>
            <button
              onClick={onViewCertificate}
              className="w-full bg-[linear-gradient(158deg,#14E1D5_6.15%,#03C722_85.68%)] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            >
              Посмотреть сертификат
            </button>
            <button onClick={onBackToLesson} className="text-sm text-[rgb(12,13,14,0.52)] font-semibold">
              Закрыть
            </button>
          </>
        ) : (
          <>
            <Puzzle className="w-24 h-24 text-[#FF9315]"/>
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
      <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .animate-scale-in { animation: scale-in 0.2s ease-out; }
            `}</style>
    </div>
  );
};

const LessonPage: React.FC<{
  courseId: number;
  lessonIndex: number;
  allCourses: Course[]; // Passed down to avoid re-fetching
  onClose: () => void;
  onComplete: (courseId: number) => void;
}> = ({courseId, lessonIndex, allCourses, onClose, onComplete}) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<'passed' | 'failed' | null>(null);
  const [score, setScore] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showCourseCompleteModal, setShowCourseCompleteModal] = useState(false);

  const course = useMemo(() => allCourses.find(c => c.id === courseId), [allCourses, courseId]);
  const lesson = useMemo(() => course?.program[lessonIndex], [course, lessonIndex]);

  if (!course || !lesson) {
    return <div className="w-full h-screen flex items-center justify-center">Урок не найден.</div>;
  }

  const quiz = lesson.quiz || [];
  const questionsCount = quiz.length;

  const answeredQuestionsCount = Object.keys(answers).filter(key => {
    const answer = answers[key];
    return Array.isArray(answer) ? answer.length > 0 : !!answer;
  }).length;

  const isCtaActive = answeredQuestionsCount === questionsCount;

  const handleAnswerChange = (questionId: string, value: string, type: 'single' | 'multiple') => {
    if (isSubmitted) return;
    setAnswers(prev => {
      if (type === 'single') {
        return {...prev, [questionId]: value};
      } else {
        const currentAnswers = (prev[questionId] as string[] || []);
        const newAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter(a => a !== value)
          : [...currentAnswers, value];
        return {...prev, [questionId]: newAnswers};
      }
    });
  };

  const handleCheckAnswers = () => {
    if (!isCtaActive || isSubmitted) return;

    setIsSubmitted(true);
    let correctCount = 0;

    for (const q of quiz) {
      const userAnswer = answers[q.id];
      if (q.type === 'single') {
        if (userAnswer === q.correctAnswer) {
          correctCount++;
        }
      } else if (q.type === 'multiple') {
        const correct = q.correctAnswers || [];
        const user = (userAnswer as string[] || []);
        if (correct.length === user.length && correct.every(a => user.includes(a))) {
          correctCount++;
        }
      }
    }

    setScore(correctCount);
    const isPass = correctCount === questionsCount;
    const isFinalTestWithCert = course.hasCertificate &&
      course.program.indexOf(lesson) === course.program.length - 1 &&
      lesson.type === 'test';

    if (isPass && isFinalTestWithCert) {
      setShowCourseCompleteModal(true);
    } else {
      setTestResult(isPass ? 'passed' : 'failed');
      setShowResultModal(true);
    }
  };

  const handleTryAgain = () => {
    setAnswers({});
    setIsSubmitted(false);
    setTestResult(null);
    setScore(0);
    setShowResultModal(false);
  }

  const progressPercentage = questionsCount > 0 ? (answeredQuestionsCount / questionsCount) * 100 : 0;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans antialiased">
        {/* Header */}
        <header className="flex-shrink-0 p-4 flex items-center justify-between border-b border-gray-200">
          <div className="w-10"></div>
          <div className="text-center">
            <p className="text-sm text-gray-500">{course.title}</p>
            <h1 className="text-lg font-bold text-[#0C0D0E]">{lesson.title}</h1>
          </div>
          <button onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                  aria-label="Закрыть">
            <X className="w-6 h-6 text-gray-600"/>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto p-6 space-y-6">
          {lesson.content && (
            <section>
              <h2 className="text-2xl font-bold text-[#0C0D0E] mb-3">{lesson.contentTitle}</h2>
              <div className="prose text-[rgb(12,13,14,0.52)] leading-relaxed whitespace-pre-line">
                {lesson.content}
              </div>
            </section>
          )}

          {quiz.length > 0 && (
            <section className="space-y-6">
              {quiz.map((q, index) => (
                <div key={q.id} className="bg-gray-50 p-4 rounded-xl">
                  <p className="font-semibold text-[#0C0D0E] mb-3">{index + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map(option => {
                      const isChecked = q.type === 'single' ? answers[q.id] === option : (answers[q.id] as string[] || []).includes(option);
                      const isCorrect = isSubmitted && (q.type === 'single' ? option === q.correctAnswer : (q.correctAnswers || []).includes(option));
                      const isIncorrect = isSubmitted && isChecked && !isCorrect;

                      return (
                        <button
                          key={option}
                          onClick={() => handleAnswerChange(q.id, option, q.type)}
                          disabled={isSubmitted}
                          className={`w-full text-left flex items-center p-3 rounded-lg border-2 transition-colors ${
                            isSubmitted ?
                              isCorrect ? 'bg-[#1ABE43]/10 border-[#1ABE43]/40 text-green-800 font-semibold' :
                                isIncorrect ? 'bg-[#FF303C]/10 border-[#FF303C]/40 text-red-800 font-semibold' :
                                  'border-gray-200 text-gray-500'
                              : isChecked ?
                                'bg-blue-100 border-blue-400 text-blue-800 font-semibold' :
                                'bg-white border-gray-200 hover:bg-gray-100 text-[#0C0D0E]'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center mr-3 ${
                              isChecked ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                            }`}>
                            {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3}/>}
                          </div>
                          <span className="flex-1">{option}</span>
                          {isSubmitted && isCorrect && <Check className="w-5 h-5 text-[#1ABE43]"/>}
                          {isSubmitted && isIncorrect && <X className="w-5 h-5 text-[#FF303C]"/>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>

        {quiz.length > 0 && (
          <footer className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div className="bg-[#007AFF] h-1.5 rounded-full" style={{width: `${progressPercentage}%`}}></div>
            </div>
            <button
              onClick={handleCheckAnswers}
              disabled={!isCtaActive || isSubmitted}
              className="w-full text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#007AFF] hover:bg-blue-600 shadow-lg"
            >
              {isSubmitted ? (isSubmitted && score === questionsCount ? 'Отлично!' : 'Попробовать снова') : 'Проверить ответы'}
            </button>
          </footer>
        )}
      </div>

      <TestResultModal
        isOpen={showResultModal}
        result={testResult}
        score={score}
        totalQuestions={questionsCount}
        onTryAgain={handleTryAgain}
        onViewCertificate={() => onComplete(course.id)}
        onBackToLesson={() => setShowResultModal(false)}
      />

      <CourseCompleteModal
        isOpen={showCourseCompleteModal}
        courseTitle={course.title}
        onViewCertificate={() => onComplete(course.id)}
        onClose={onClose}
      />
    </>
  );
};

export default LessonPage;
