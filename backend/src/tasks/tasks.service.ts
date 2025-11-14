import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Event } from '@prisma/client';
import { AchievementsService } from '../achievements/achievements.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly achievementsService: AchievementsService,
  ) {}

  async onModuleInit() {
    this.logger.log('Bootstrapping schedulers for existing events...');
    const eventsToSchedule = await this.prisma.event.findMany({
      where: {
        status: 'PLANNED',
      },
    });

    for (const event of eventsToSchedule) {
      this.scheduleEventCompletion(event);
    }

    this.logger.log(
      `Bootstrap finished. Processed ${eventsToSchedule.length} PLANNED events.`,
    );
  }

  scheduleEventCompletion(event: Event) {
    if (event.durationHours === null) {
      return;
    }

    const jobName = `complete-event-${event.id}`;
    const now = new Date();
    const completionTime = new Date(
      event.date.getTime() + event.durationHours * 60 * 60 * 1000,
    );

    if (completionTime <= now) {
      this.logger.warn(
        `Event ${event.id} completion time is in the past. Processing immediately.`,
      );
      setTimeout(() => this.handleEventCompletion(event.id), 0);
      return;
    }

    const timeout = completionTime.getTime() - now.getTime();
    const callback = () => {
      this.handleEventCompletion(event.id);
      this.schedulerRegistry.deleteTimeout(jobName);
    };

    try {
      const MAX_TIMEOUT = 2147483647;
      if (timeout > MAX_TIMEOUT) {
        this.logger.warn(
          `Event ${event.id} is too far in the future to be scheduled. It will be picked up on next restart.`,
        );
        return;
      }
      if (this.schedulerRegistry.doesExist('timeout', jobName)) {
        this.schedulerRegistry.deleteTimeout(jobName);
      }
      this.schedulerRegistry.addTimeout(jobName, setTimeout(callback, timeout));
      this.logger.log(
        `Scheduled job for event ${event.id} to run at ${completionTime.toISOString()}`,
      );
    } catch (error) {
      this.logger.error(`Failed to schedule job ${jobName}: ${error.message}`);
    }
  }

  async handleEventCompletion(eventId: number) {
    this.logger.log(`Processing event completion for ID: ${eventId}`);

    try {
      const completedEvent = await this.prisma.$transaction(async (tx) => {
        const event = await tx.event.findFirst({
          where: { id: eventId, status: 'PLANNED' },
          include: {
            participants: { where: { status: 'approved' } },
          },
        });

        if (!event || event.durationHours === null) {
          this.logger.warn(
            `Event ${eventId} not found or already processed. Skipping transaction.`,
          );
          return null;
        }

        const userIds = event.participants.map((p) => p.userId);

        if (userIds.length > 0) {
          await tx.user.updateMany({
            where: { id: { in: userIds } },
            data: {
              totalHours: { increment: event.durationHours },
              karmaPoints: { increment: event.karmaPoints },
            },
          });

          await tx.karmaLog.createMany({
            data: userIds.map((userId) => ({
              userId,
              points: event.karmaPoints,
              description: `Participation in event: ${event.title}`,
            })),
          });
        }

        await tx.event.update({
          where: { id: eventId },
          data: { status: 'COMPLETED' },
        });

        this.logger.log(
          `Successfully processed event ${eventId}. Awarded ${event.durationHours} hours and ${event.karmaPoints} karma to ${userIds.length} users.`,
        );
        return { userIds };
      });

      if (completedEvent?.userIds) {
        this.logger.log(
          `Triggering achievement checks for ${completedEvent.userIds.length} users.`,
        );
        for (const userId of completedEvent.userIds) {
          try {
            await this.achievementsService.checkAndAwardAchievements(userId);
          } catch (e) {
            this.logger.error(
              `Failed to check achievements for user ${userId}: ${e.message}`,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `Transaction failed for event ${eventId}: ${error.message}`,
      );
    }
  }
}