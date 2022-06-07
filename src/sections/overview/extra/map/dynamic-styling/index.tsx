import { useState } from 'react';
import MapGL from 'react-map-gl';
import { InteractiveMapProps } from 'react-map-gl/src/components/interactive-map';
// components
import {
  MapControlScale,
  MapControlGeolocate,
  MapControlNavigation,
  MapControlFullscreen,
} from '../../../../../components/map';
//
import ControlPanel from './ControlPanel';

// ----------------------------------------------------------------------

export default function MapDynamicStyling({ ...other }: InteractiveMapProps) {
  const [mapStyle, setMapStyle] = useState('');
  const [viewport, setViewport] = useState({
    latitude: 37.805,
    longitude: -122.447,
    zoom: 15.5,
    bearing: 0,
    pitch: 0,
  });

  return (
    <>
      <MapGL {...viewport} mapStyle={mapStyle} onViewportChange={setViewport} {...other}>
        <MapControlScale />
        <MapControlNavigation />
        <MapControlFullscreen />
        <MapControlGeolocate />
      </MapGL>

      <ControlPanel onChange={setMapStyle} />
    </>
  );
}
