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
    return this.prisma.course.findMany();
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
                  select: { id: true, answer: true },
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

      const correctAnswersMap = new Map(
        correctAnswers.map((a) => [a.questionId, a.id]),
      );

      let userCorrectAnswers = 0;
      for (const userAnswer of completionDto.answers) {
        if (
          correctAnswersMap.get(userAnswer.questionId) === userAnswer.answerId
        ) {
          userCorrectAnswers++;
        }
      }

      if (userCorrectAnswers !== totalQuestions) {
        throw new BadRequestException('Quiz failed. Please try again.');
      }

      return tx.userCertificate.create({
        data: { userId, courseId },
      });
    });
  }
}