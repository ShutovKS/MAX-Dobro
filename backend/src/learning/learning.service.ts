// FILE: backend/src/learning/learning.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Serve courses and persist lesson and quiz completion on the server.
//   SCOPE: list/get shaped courses, score submitted quiz answers, mark lessons and issue certificates
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-LEARNING, V-M-LEARNING, M-PRISMA
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LearningService - courses, lessons, certificates
//   PASS_THRESHOLD - 0.7 quiz pass ratio aligned with frontend
//   findAll - shaped course catalog
//   findOne - shaped course by id
//   completeCourse - score submitted quiz answers without issuing a certificate
//   markLessonComplete - persist lesson progress and issue certificate when all lessons done
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteCourseDto } from './dto/complete-course.dto';

// Порог сдачи теста (доля верных ответов). Совпадает с фронтовым
// COURSE_PASS_THRESHOLD; раньше требовалось 100% (порог не применялся).
const PASS_THRESHOLD = 0.7;

@Injectable()
// START_CONTRACT: LearningService
//   PURPOSE: Course progress persistence
//   INPUTS: { PrismaService, courseId, lessonId, userId, CompleteCourseDto }
//   OUTPUTS: { shaped Course, quiz score, lesson progress }
//   SIDE_EFFECTS: reads Course/QuizAnswer; writes UserCourseProgress and UserCertificate
//   LINKS: M-LEARNING, V-M-LEARNING, M-PRISMA
// END_CONTRACT: LearningService
export class LearningService {
  constructor(private readonly prisma: PrismaService) {}

  // START_BLOCK_SHAPE_COURSE
  // Включаем answers с isCorrect для вычисления isMultiple на сервере,
  // но НЕ отдаём isCorrect клиенту (иначе видны правильные ответы до отправки).
  private readonly courseInclude = {
    lessons: {
      include: {
        questions: {
          include: {
            answers: { select: { id: true, answer: true, isCorrect: true } },
          },
        },
      },
    },
  } as const;

  // Преобразует курс из БД: id вопроса -> строка, добавляет isMultiple,
  // вырезает isCorrect из ответов.
  private shapeCourse(course: any) {
    return {
      ...course,
      lessons: course.lessons.map((lesson: any) => ({
        ...lesson,
        questions: lesson.questions.map((q: any) => ({
          id: q.id.toString(),
          question: q.question,
          isMultiple:
            q.answers.filter((a: any) => a.isCorrect).length > 1,
          answers: q.answers.map((a: any) => ({ id: a.id, answer: a.answer })),
        })),
      })),
    };
  }
  // END_BLOCK_SHAPE_COURSE

  // START_BLOCK_QUERY_COURSES
  // START_CONTRACT: findAll
  //   PURPOSE: List all courses with public quiz shape
  //   INPUTS: { none }
  //   OUTPUTS: { shaped Course[] }
  //   SIDE_EFFECTS: Prisma Course findMany
  //   LINKS: M-LEARNING, V-M-LEARNING, M-PRISMA
  // END_CONTRACT: findAll
  async findAll() {
    const courses = await this.prisma.course.findMany({
      include: this.courseInclude,
    });
    return courses.map((c) => this.shapeCourse(c));
  }

  // START_CONTRACT: findOne
  //   PURPOSE: Load one course with public quiz shape
  //   INPUTS: { id: number }
  //   OUTPUTS: { shaped Course }
  //   SIDE_EFFECTS: Prisma Course findUnique
  //   LINKS: M-LEARNING, V-M-LEARNING, M-PRISMA
  // END_CONTRACT: findOne
  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: this.courseInclude,
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return this.shapeCourse(course);
  }
  // END_BLOCK_QUERY_COURSES

  // Оценивает ОТПРАВЛЕННЫЕ ответы (квиз текущего урока). Сертификат здесь НЕ
  // выдаётся — выдача завязана на завершение всех уроков (markLessonComplete).
  // Возвращает correctAnswers (по отправленным вопросам) для подсветки ответов.
  // START_CONTRACT: completeCourse
  //   PURPOSE: Score submitted quiz answers against PASS_THRESHOLD without issuing a certificate
  //   INPUTS: { userId: number, courseId: number, completionDto: CompleteCourseDto }
  //   OUTPUTS: { isPassed, score, totalQuestions, correctAnswers }
  //   SIDE_EFFECTS: Prisma Course and QuizAnswer reads
  //   LINKS: M-LEARNING, V-M-LEARNING, M-PRISMA
  // END_CONTRACT: completeCourse
  // START_BLOCK_COMPLETE_COURSE
  async completeCourse(
    userId: number,
    courseId: number,
    completionDto: CompleteCourseDto,
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const submittedQuestionIds = [
      ...new Set(completionDto.answers.map((a) => a.questionId)),
    ];
    const totalQuestions = submittedQuestionIds.length;

    if (totalQuestions === 0) {
      return { isPassed: true, score: 0, totalQuestions: 0, correctAnswers: {} };
    }

    const correctAnswersFromDb = await this.prisma.quizAnswer.findMany({
      where: { questionId: { in: submittedQuestionIds }, isCorrect: true },
      select: { id: true, questionId: true },
    });

    const correctAnswersMap = new Map<number, Set<number>>();
    for (const answer of correctAnswersFromDb) {
      if (!correctAnswersMap.has(answer.questionId)) {
        correctAnswersMap.set(answer.questionId, new Set());
      }
      correctAnswersMap.get(answer.questionId)!.add(answer.id);
    }

    const userAnswersMap = new Map<number, Set<number>>();
    for (const answer of completionDto.answers) {
      if (!userAnswersMap.has(answer.questionId)) {
        userAnswersMap.set(answer.questionId, new Set());
      }
      userAnswersMap.get(answer.questionId)!.add(answer.answerId);
    }

    let score = 0;
    const areSetsEqual = (a: Set<number>, b: Set<number>) =>
      a.size === b.size && [...a].every((value) => b.has(value));

    for (const questionId of submittedQuestionIds) {
      const correctSet = correctAnswersMap.get(questionId) || new Set();
      const userSet = userAnswersMap.get(questionId) || new Set();
      if (areSetsEqual(correctSet, userSet)) {
        score++;
      }
    }

    const isPassed = score / totalQuestions >= PASS_THRESHOLD;

    // Правильные ответы по отправленным вопросам — для подсветки на клиенте
    // (после отправки, не раскрывая их заранее).
    const correctAnswers: Record<string, number[]> = {};
    for (const [questionId, ids] of correctAnswersMap) {
      correctAnswers[questionId.toString()] = [...ids];
    }

    return { isPassed, score, totalQuestions, correctAnswers };
  }
  // END_BLOCK_COMPLETE_COURSE

  // Отмечает урок завершённым (серверный прогресс). Когда завершены ВСЕ уроки
  // курса — выдаёт сертификат. Возвращает прогресс и флаг завершения курса.
  // START_CONTRACT: markLessonComplete
  //   PURPOSE: Persist lesson completion and issue a certificate when all lessons are done
  //   INPUTS: { userId: number, courseId: number, lessonId: number }
  //   OUTPUTS: { completedLessonIds, totalLessons, courseCompleted }
  //   SIDE_EFFECTS: transactional UserCourseProgress upsert and optional UserCertificate create
  //   LINKS: M-LEARNING, V-M-LEARNING, BLOCK_COMPLETE_LESSON
  // END_CONTRACT: markLessonComplete
  // START_BLOCK_COMPLETE_LESSON
  async markLessonComplete(userId: number, courseId: number, lessonId: number) {
    return this.prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: { lessons: { select: { id: true } } },
      });
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }
      if (!course.lessons.some((l) => l.id === lessonId)) {
        throw new BadRequestException('Lesson does not belong to this course');
      }

      const existing = await tx.userCourseProgress.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });
      const completed = new Set<number>(existing?.completedLessons ?? []);
      completed.add(lessonId);
      const completedLessons = [...completed];

      await tx.userCourseProgress.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId, completedLessons },
        update: { completedLessons },
      });

      const totalLessons = course.lessons.length;
      const courseCompleted =
        totalLessons > 0 && completedLessons.length >= totalLessons;

      if (courseCompleted) {
        const cert = await tx.userCertificate.findUnique({
          where: { userId_courseId: { userId, courseId } },
        });
        if (!cert) {
          await tx.userCertificate.create({ data: { userId, courseId } });
        }
      }

      return { completedLessonIds: completedLessons, totalLessons, courseCompleted };
    });
  }
  // END_BLOCK_COMPLETE_LESSON
}
