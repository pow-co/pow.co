import bbox from '@turf/bbox';
import { useState } from 'react';
import MapGL, { MapEvent, LinearInterpolator, WebMercatorViewport } from 'react-map-gl';
import { InteractiveMapProps } from 'react-map-gl/src/components/interactive-map';
// _mock_
import MAP_STYLE from '../../../../_mock/map/map-style-basic-v8.json';
// components
import {
  MapControlScale,
  MapControlGeolocate,
  MapControlNavigation,
  MapControlFullscreen,
} from '../../../../components/map';

// ----------------------------------------------------------------------

const mapStyle: Record<string, any> = {
  ...MAP_STYLE,
  sources: { ...MAP_STYLE.sources },
  layers: MAP_STYLE.layers.slice(),
};

mapStyle.sources['sf-neighborhoods'] = {
  type: 'geojson',
  data: 'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/feature-example-sf.json',
};

mapStyle.layers.push(
  {
    id: 'sf-neighborhoods-fill',
    source: 'sf-neighborhoods',
    type: 'fill',
    paint: {
      'fill-outline-color': '#0040c8',
      'fill-color': '#fff',
      'fill-opacity': 0,
    },
  },
  {
    id: 'sf-neighborhoods-outline',
    source: 'sf-neighborhoods',
    type: 'line',
    paint: {
      'line-width': 2,
      'line-color': '#0080ef',
    },
  }
);

// ----------------------------------------------------------------------

export default function MapZoomToBounds({ ...other }: InteractiveMapProps) {
  const [viewport, setViewport] = useState<Record<string, number | LinearInterpolator>>({
    latitude: 37.78,
    longitude: -122.4,
    zoom: 11,
    bearing: 0,
    pitch: 0,
  });

  const onClick = (event: MapEvent) => {
    const feature = event.features?.[0];
    if (feature) {
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);
      const viewports = new WebMercatorViewport(viewport as any);
      const { longitude, latitude, zoom } = viewports.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 40 }
      );
      setViewport({
        longitude,
        latitude,
        zoom,
        transitionInterpolator: new LinearInterpolator({
          around: [event.offsetCenter.x, event.offsetCenter.y],
        }),
        transitionDuration: 1000,
      });
    }
  };

  return (
    <>
      <MapGL
        {...viewport}
        mapStyle={mapStyle}
        onViewportChange={setViewport}
        onClick={onClick}
        interactiveLayerIds={['sf-neighborhoods-fill']}
        {...other}
      >
        <MapControlScale />
        <MapControlNavigation />
        <MapControlFullscreen />
        <MapControlGeolocate />
      </MapGL>
    </>
  );
}
