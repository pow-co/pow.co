import { useState, useRef } from 'react';
import MapGL, { Source, Layer, MapEvent, MapRef, LayerProps } from 'react-map-gl';

// ----------------------------------------------------------------------

const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
  }
};

const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  },
  paint: {}
};

const unClusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'earthquakes',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#11b4da',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
};

// ----------------------------------------------------------------------

export default function MapClusters({ ...other }) {
  const mapRef = useRef<MapRef>(null);
  const [viewport, setViewport] = useState({
    latitude: 40.67,
    longitude: -103.59,
    zoom: 3,
    bearing: 0,
    pitch: 0,
    transitionDuration: 500
  });

  const onClick = (event: MapEvent) => {
    const feature = event?.features?.[0];
    const clusterId = feature && feature.properties.cluster_id;
    const mapboxSource = mapRef.current?.getMap().getSource('earthquakes');

    mapboxSource.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
      if (err) {
        return;
      }
      setViewport({
        ...viewport,
        longitude: feature && feature.geometry.coordinates[0],
        latitude: feature && feature.geometry.coordinates[1],
        zoom: isNaN(zoom) ? 3 : zoom,
        transitionDuration: 500
      });
    });
  };

  const interactiveLayerIds = clusterLayer.id ? [clusterLayer.id] : undefined;

  return (
    <>
      <MapGL
        {...viewport}
        onViewportChange={setViewport}
        interactiveLayerIds={interactiveLayerIds}
        onClick={onClick}
        ref={mapRef}
        {...other}
      >
        <Source
          id="earthquakes"
          type="geojson"
          data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unClusteredPointLayer} />
        </Source>
      </MapGL>
    </>
  );
}
