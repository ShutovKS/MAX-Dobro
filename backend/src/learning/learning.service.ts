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
      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: { lessons: { include: { questions: true } } },
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      const existingCertificate = await tx.userCertificate.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (existingCertificate) {
        throw new ConflictException('You have already completed this course.');
      }

      const totalQuestions = course.lessons.reduce(
        (acc, lesson) => acc + lesson.questions.length,
        0,
      );

      const questionIds = course.lessons.flatMap((l) =>
        l.questions.map((q) => q.id),
      );

      const correctAnswers = await tx.quizAnswer.findMany({
        where: { questionId: { in: questionIds }, isCorrect: true },
      });

      // Группируем правильные ответы по вопросам
      const correctAnswersMap = new Map<number, Set<number>>();
      for (const answer of correctAnswers) {
        if (!correctAnswersMap.has(answer.questionId)) {
          correctAnswersMap.set(answer.questionId, new Set());
        }
        correctAnswersMap.get(answer.questionId)!.add(answer.id);
      }

      // Группируем ответы пользователя по вопросам
      const userAnswersMap = new Map<number, Set<number>>();
      for (const userAnswer of completionDto.answers) {
        if (!userAnswersMap.has(userAnswer.questionId)) {
          userAnswersMap.set(userAnswer.questionId, new Set());
        }
        userAnswersMap.get(userAnswer.questionId)!.add(userAnswer.answerId);
      }

      // Проверяем каждый вопрос
      let userCorrectAnswers = 0;
      for (const questionId of questionIds) {
        const correctSet = correctAnswersMap.get(questionId) || new Set();
        const userSet = userAnswersMap.get(questionId) || new Set();

        // Проверяем, что пользователь выбрал ВСЕ правильные ответы и НЕ выбрал лишних
        if (
          correctSet.size === userSet.size &&
          [...correctSet].every((id) => userSet.has(id))
        ) {
          userCorrectAnswers++;
        }
      }

      // Требуем минимум 70% правильных ответов (как на фронтенде)
      const PASS_THRESHOLD = 0.7;
      const passScore = Math.ceil(totalQuestions * PASS_THRESHOLD);

      if (userCorrectAnswers < passScore) {
        throw new BadRequestException(
          `Quiz failed. You got ${userCorrectAnswers} out of ${totalQuestions} correct. Need at least ${passScore} to pass.`,
        );
      }

      return tx.userCertificate.create({
        data: { userId, courseId },
      });
    });
  }
}
