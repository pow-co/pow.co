import { useState, useEffect } from 'react';
import { Point } from 'geojson';
import MapGL, { Layer, LayerProps, Source } from 'react-map-gl';
import { InteractiveMapProps } from 'react-map-gl/src/components/interactive-map';
// @mui
import { useTheme } from '@mui/material/styles';
// components
import {
  MapControlScale,
  MapControlGeolocate,
  MapControlNavigation,
  MapControlFullscreen,
} from '../../../../components/map';

// ----------------------------------------------------------------------

function pointOnCircle({
  center,
  angle,
  radius,
}: {
  center: [number, number];
  angle: number;
  radius: number;
}): Point {
  return {
    type: 'Point',
    coordinates: [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(angle) * radius],
  };
}

export default function MapGeoJSONAnimation({ ...other }: InteractiveMapProps) {
  const theme = useTheme();

  const [pointData, setPointData] = useState<
    | {
        type: string;
        coordinates: number[];
      }
    | any
  >();
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: -100,
    zoom: 3,
    bearing: 0,
    pitch: 0,
  });

  const pointLayer: LayerProps = {
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': theme.palette.error.main,
    },
  };

  useEffect(() => {
    const animation = window.requestAnimationFrame(() =>
      setPointData(
        pointOnCircle({
          center: [-100, 0],
          angle: Date.now() / 1000,
          radius: 20,
        })
      )
    );
    return () => window.cancelAnimationFrame(animation);
  });

  return (
    <>
      <MapGL {...viewport} onViewportChange={setViewport} {...other}>
        <MapControlScale />
        <MapControlNavigation />
        <MapControlFullscreen />
        <MapControlGeolocate />

        {pointData && (
          <Source type="geojson" data={pointData}>
            <Layer {...pointLayer} />
          </Source>
        )}
      </MapGL>
    </>
  );
}
