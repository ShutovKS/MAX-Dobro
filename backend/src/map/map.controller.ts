// FILE: backend/src/map/map.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Public HTTP API for event map markers with coordinates.
//   SCOPE: GET /map-markers
//   DEPENDS: M-PRISMA
//   LINKS: M-MAP, V-M-MAP, class-MapService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   MapController - event coordinate marker endpoint
//   getMarkers - list planned events that have coordinates
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MapService } from './map.service';

// START_CONTRACT: MapController
//   PURPOSE: Expose public map-marker HTTP route
//   INPUTS: { none }
//   OUTPUTS: { MapMarker[] }
//   SIDE_EFFECTS: none at controller layer
//   LINKS: M-MAP, V-M-MAP, fn-getMarkers
// END_CONTRACT: MapController
@ApiTags('Map')
@Controller('map-markers')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  // START_CONTRACT: getMarkers
  //   PURPOSE: Return map markers for events with coordinates
  //   INPUTS: { none }
  //   OUTPUTS: { Promise<MapMarker[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-MAP, BLOCK_LIST_MARKERS
  // END_CONTRACT: getMarkers
  @Get()
  @ApiOperation({ summary: 'Get map markers for events' })
  @ApiResponse({ status: 200, description: 'List of map markers.' })
  getMarkers() {
    return this.mapService.getMarkers();
  }
}
