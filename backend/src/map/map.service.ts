import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MapService {
  constructor(private readonly prisma: PrismaService) {}

  async getMarkers() {
    const eventsWithLocation = await this.prisma.event.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        status: 'PLANNED',
      },
      select: {
        id: true,
        title: true,
        description: true,
        latitude: true,
        longitude: true,
      },
    });

    return eventsWithLocation.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      position: [event.latitude!, event.longitude!],
    }));
  }
}