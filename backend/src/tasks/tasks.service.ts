import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Event } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    this.logger.log('Bootstrapping schedulers for existing events...');
    const eventsToSchedule = await this.prisma.event.findMany({
      where: {
        status: 'PLANNED',
      },
    });

    await Promise.all(
      eventsToSchedule.map((event) => this.scheduleEventCompletion(event)),
    );

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

    if (completionTime < now) {
      this.logger.warn(
        `Event ${event.id} completion time is in the past. Processing immediately.`,
      );
      this.handleEventCompletion(event.id);
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
          `Event ${event.id} is too far in the future to be scheduled with setTimeout. It will be picked up on next restart.`,
        );
        return;
      }
      this.schedulerRegistry.addTimeout(jobName, setTimeout(callback, timeout));
      this.logger.log(
        `Scheduled job for event ${event.id} to run at ${completionTime.toISOString()}`,
      );
    } catch (error) {
      if (error.message.includes('already exists')) {
        this.logger.warn(`Job ${jobName} already exists. Skipping.`);
      } else {
        throw error;
      }
    }
  }

  async handleEventCompletion(eventId: number) {
    this.logger.log(`Processing event completion for ID: ${eventId}`);

    try {
      await this.prisma.$transaction(async (tx) => {
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
          return;
        }

        const userIds = event.participants.map((p) => p.userId);

        if (userIds.length > 0) {
          await tx.user.updateMany({
            where: { id: { in: userIds } },
            data: { totalHours: { increment: event.durationHours } },
          });
        }

        await tx.event.update({
          where: { id: eventId },
          data: { status: 'COMPLETED' },
        });

        this.logger.log(
          `Successfully processed event ${eventId} and awarded ${event.durationHours} hours to ${userIds.length} users.`,
        );
      });
    } catch (error) {
      this.logger.error(
        `Transaction failed for event ${eventId}: ${error.message}`,
      );
    }
  }
}