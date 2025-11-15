// src/learning/learning.service.ts

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
                  select: { id: true, answer: true },
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

      const submittedQuestionIds = completionDto.answers.map(
        (a) => a.questionId,
      );

      if (submittedQuestionIds.length === 0) {
        throw new BadRequestException('Answers not provided.');
      }

      const questionsInDb = await tx.quizQuestion.count({
        where: { id: { in: submittedQuestionIds } },
      });

      if (questionsInDb !== submittedQuestionIds.length) {
        throw new BadRequestException('Some questions do not exist.');
      }

      const correctAnswers = await tx.quizAnswer.findMany({
        where: {
          questionId: { in: submittedQuestionIds },
          isCorrect: true,
        },
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

      if (userCorrectAnswers < completionDto.answers.length) {
        throw new BadRequestException(
          'Тест не пройден. Пожалуйста, проверьте ответы и попробуйте снова.',
        );
      }

      return tx.userCertificate.create({
        data: { userId, courseId },
      });
    });
  }
}