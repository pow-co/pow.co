import MapGL from 'react-map-gl';
import { useState, useCallback } from 'react';
import { Coordinate, CallbackEvent } from 'react-map-gl/src/components/draggable-control';
// components
import {
  MapControlMarker,
  MapControlScale,
  MapControlGeolocate,
  MapControlNavigation,
  MapControlFullscreen,
} from '../../../../../components/map';
//
import ControlPanel from './ControlPanel';

// ----------------------------------------------------------------------

export default function MapDraggableMarkers({ ...other }) {
  const [events, logEvents] = useState<{
    onDragStart?: Coordinate;
    onDrag?: Coordinate;
    onDragEnd?: Coordinate;
  }>({});
  const [marker, setMarker] = useState({
    latitude: 40,
    longitude: -100,
  });
  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });

  const onMarkerDragStart: (evt: CallbackEvent) => void = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag: (evt: CallbackEvent) => void = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));
  }, []);

  const onMarkerDragEnd: (evt: CallbackEvent) => void = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
  }, []);

  return (
    <>
      <MapGL {...viewport} onViewportChange={setViewport} {...other}>
        <MapControlScale />
        <MapControlNavigation />
        <MapControlFullscreen />
        <MapControlGeolocate />

        <MapControlMarker
          draggable
          longitude={marker.longitude}
          latitude={marker.latitude}
          offsetTop={-20}
          offsetLeft={-10}
          onDragStart={onMarkerDragStart}
          onDrag={onMarkerDrag}
          onDragEnd={onMarkerDragEnd}
        />
      </MapGL>

      <ControlPanel events={events} />
    </>
  );
}
