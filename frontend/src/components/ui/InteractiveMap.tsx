// FILE: frontend/src/components/ui/InteractiveMap.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Leaflet map for event markers and optional point picking.
//   SCOPE: Render tiles, markers, popups, click-to-pick, and resize invalidation
//   DEPENDS: M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI, export-InteractiveMap
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   InteractiveMap - Leaflet event map with marker click and optional pick mode
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useEffect} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import L from 'leaflet';
import type {MapMarker} from '../../lib/types';

// START_BLOCK_LEAFLET_DEFAULT_ICONS
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
// END_BLOCK_LEAFLET_DEFAULT_ICONS

const MapResizeHandler: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

interface InteractiveMapProps {
  markers: MapMarker[];
  onMarkerClick: (id: number) => void;
  center?: [number, number];
  zoom?: number;
  // Режим выбора точки: клик/перетаскивание маркера возвращает координаты.
  onMapClick?: (lat: number, lng: number) => void;
  pickedPosition?: [number, number] | null;
}

// Обрабатывает клик по карте в режиме выбора точки.
const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({
  onMapClick,
}) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// START_CONTRACT: InteractiveMap
//   PURPOSE: Render a Leaflet map of events with optional pick-point mode
//   INPUTS: { markers: MapMarker[]; onMarkerClick: (id: number) => void; center?: [number, number]; zoom?: number; onMapClick?: (lat, lng) => void; pickedPosition?: [number, number] | null }
//   OUTPUTS: { ReactElement - map container }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI, export-InteractiveMap
// END_CONTRACT: InteractiveMap
const InteractiveMap: React.FC<InteractiveMapProps> = ({
                                                         markers,
                                                         onMarkerClick,
                                                         center = [55.751244, 37.618423],
                                                         zoom = 10,
                                                         onMapClick,
                                                         pickedPosition,
                                                       }) => {
  return (
    // START_BLOCK_RENDER_MAP
    <MapContainer attributionControl={false} center={center} zoom={zoom} scrollWheelZoom={true}
                  style={{height: '100%', width: '100%'}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      {onMapClick && pickedPosition && (
        <Marker
          position={pickedPosition}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const m = e.target as L.Marker;
              const { lat, lng } = m.getLatLng();
              onMapClick(lat, lng);
            },
          }}
        />
      )}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          eventHandlers={{
            click: () => {
              onMarkerClick(marker.id);
            },
          }}
        >
          <Popup>
            <b>{marker.title}</b><br/>
            {marker.description}
          </Popup>
        </Marker>
      ))}
      <MapResizeHandler/>
    </MapContainer>
    // END_BLOCK_RENDER_MAP
  );
};

export default InteractiveMap;
