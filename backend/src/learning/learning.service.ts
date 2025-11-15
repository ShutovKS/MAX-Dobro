import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteCourseDto } from './dto/complete-course.dto';

@Injectable()
export class LearningService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.course.findMany({
      include: {
        lessons: {
          include: {
            questions: {
              include: {
                answers: {
                  select: { id: true, answer: true, isCorrect: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          include: {
            questions: {
              include: {
                answers: {
                  select: { id: true, answer: true, isCorrect: true },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    course.lessons.forEach((lesson) => {
      lesson.questions.forEach((question) => {
        // @ts-expect-error - Converting number ID to string for compatibility with frontend
        question.id = question.id.toString();
      });
    });

    return course;
  }

  async completeCourse(
    userId: number,
    courseId: number,
    completionDto: CompleteCourseDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({ where: { id: courseId } });
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      const existingCertificate = await tx.userCertificate.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });
      if (existingCertificate) {
        return { isPassed: true, score: 0, totalQuestions: 0 };
      }

      const submittedQuestionIds = [
        ...new Set(completionDto.answers.map((a) => a.questionId)),
      ];
      const totalQuestionsInSubmission = submittedQuestionIds.length;

      if (totalQuestionsInSubmission === 0) {
        await tx.userCertificate.create({ data: { userId, courseId } });
        return { isPassed: true, score: 0, totalQuestions: 0 };
      }

      const correctAnswersFromDb = await tx.quizAnswer.findMany({
        where: {
          questionId: { in: submittedQuestionIds },
          isCorrect: true,
        },
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

      const isPassed = score >= totalQuestionsInSubmission;

      if (isPassed) {
        const allQuestionsInCourse = await tx.quizQuestion.count({
          where: { lesson: { courseId } },
        });
        
        const totalCorrectAnswersInDb = await tx.quizAnswer.count({
            where: { question: { lesson: { courseId } }, isCorrect: true }
        });

        if (completionDto.answers.length >= totalCorrectAnswersInDb && score >= allQuestionsInCourse) {
           await tx.userCertificate.create({
              data: { userId, courseId },
           });
        }
      }

      return { isPassed, score, totalQuestions: totalQuestionsInSubmission };
    });
  }
}