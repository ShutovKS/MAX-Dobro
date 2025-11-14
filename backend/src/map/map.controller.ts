import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MapService } from './map.service';

@ApiTags('Map')
@Controller('map-markers')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  @ApiOperation({ summary: 'Get map markers for events' })
  @ApiResponse({ status: 200, description: 'List of map markers.' })
  getMarkers() {
    return this.mapService.getMarkers();
  }
}