import ReactMapGL from 'react-map-gl';
import { useState, useCallback } from 'react';
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

interface MapChangeThemeProps extends InteractiveMapProps {
  themes: Record<string, string>;
}

export default function MapChangeTheme({ themes, ...other }: MapChangeThemeProps) {
  const [selectTheme, setSelectTheme] = useState('outdoors');
  const [viewport, setViewport] = useState({
    latitude: 37.785164,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });

  const handleChangeTheme = useCallback((value: string) => setSelectTheme(value), []);

  return (
    <>
      <ReactMapGL
        {...viewport}
        onViewportChange={setViewport}
        mapStyle={themes?.[selectTheme]}
        {...other}
      >
        <MapControlScale />
        <MapControlNavigation />
        <MapControlFullscreen />
        <MapControlGeolocate />
      </ReactMapGL>

      <ControlPanel themes={themes} selectTheme={selectTheme} onChangeTheme={handleChangeTheme} />
    </>
  );
}
