import React, {useEffect} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import L from 'leaflet';
import type {MapMarker} from '../../lib/types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
                                                         markers,
                                                         onMarkerClick,
                                                         center = [55.751244, 37.618423],
                                                         zoom = 10,
                                                       }) => {
  return (
    <MapContainer attributionControl={false} center={center} zoom={zoom} scrollWheelZoom={true}
                  style={{height: '100%', width: '100%'}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
  );
};

export default InteractiveMap;