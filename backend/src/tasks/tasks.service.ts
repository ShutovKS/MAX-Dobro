// FILE: backend/src/tasks/tasks.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Schedule and complete planned events, awarding hours, karma, and achievements.
//   SCOPE: onModuleInit bootstrap, scheduleEventCompletion, handleEventCompletion
//   DEPENDS: M-PRISMA
//   LINKS: M-TASKS, V-M-TASKS, M-PRISMA, M-SCHEMA
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   TasksService - event completion scheduler
//   onModuleInit - schedule all PLANNED events at boot
//   scheduleEventCompletion - timeout job for a single event
//   handleEventCompletion - award hours/karma and mark COMPLETED
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Event } from '@prisma/client';
import { AchievementsService } from '../achievements/achievements.service';
import { PrismaService } from '../prisma/prisma.service';

// START_CONTRACT: TasksService
//   PURPOSE: Bootstrap timeouts for PLANNED events and process completion awards.
//   INPUTS: { prisma: PrismaService, schedulerRegistry: SchedulerRegistry, achievementsService: AchievementsService }
//   OUTPUTS: { scheduled timeouts; completed events with awarded stats }
//   SIDE_EFFECTS: mutates event status, user hours/karma, karma logs, achievement checks
//   LINKS: M-TASKS, V-M-TASKS, M-PRISMA
// END_CONTRACT: TasksService
@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly achievementsService: AchievementsService,
  ) {}

  // START_BLOCK_BOOTSTRAP_PLANNED_EVENTS
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
  // END_BLOCK_BOOTSTRAP_PLANNED_EVENTS

  // START_BLOCK_SCHEDULE_EVENT_COMPLETION
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
  // END_BLOCK_SCHEDULE_EVENT_COMPLETION

  // START_BLOCK_HANDLE_EVENT_COMPLETION
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
  // END_BLOCK_HANDLE_EVENT_COMPLETION
}
