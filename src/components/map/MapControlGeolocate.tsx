import { GeolocateControl } from 'react-map-gl';
import { GeolocateControlProps } from 'react-map-gl/src/components/geolocate-control';
// @mui
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const GeolocateControlStyle = styled(GeolocateControl)(({ theme }) => ({
  zIndex: 99,
  borderRadius: 8,
  overflow: 'hidden',
  top: theme.spacing(6),
  left: theme.spacing(1.5),
  boxShadow: theme.customShadows.z8
}));

// ----------------------------------------------------------------------

export default function MapControlGeolocate({ ...props }: GeolocateControlProps) {
  return (
    <GeolocateControlStyle
      positionOptions={{ enableHighAccuracy: true }}
      trackUserLocation={true}
      {...props}
    />
  );
}
