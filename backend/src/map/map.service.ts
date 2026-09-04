// FILE: backend/src/map/map.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Return map markers for events with coordinates.
//   SCOPE: Planned events that have latitude and longitude
//   DEPENDS: M-PRISMA
//   LINKS: M-MAP, V-M-MAP, class-MapService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   MapService - event coordinate markers
//   getMarkers - list planned events with lat/lng as map points
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// START_CONTRACT: MapService
//   PURPOSE: Query planned events with coordinates and map them to markers
//   INPUTS: { none }
//   OUTPUTS: { Promise<MapMarker[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-MAP, V-M-MAP, M-PRISMA, BLOCK_LIST_MARKERS
// END_CONTRACT: MapService
@Injectable()
export class MapService {
  constructor(private readonly prisma: PrismaService) {}

  // START_CONTRACT: getMarkers
  //   PURPOSE: List planned events that have coordinates as map markers
  //   INPUTS: { none }
  //   OUTPUTS: { Promise<{ id: number, title: string, description: string, position: [number, number] }[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-MAP, V-M-MAP, BLOCK_LIST_MARKERS
  // END_CONTRACT: getMarkers
  async getMarkers() {
    // START_BLOCK_LIST_MARKERS
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
    // END_BLOCK_LIST_MARKERS
  }
}
