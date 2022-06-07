import { Suspense, lazy } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Container, CardHeader, CardContent } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// config
import { MAPBOX_API } from '../../../config';
// _mock_
import { cities as CITIES } from '../../../_mock/map/cities';
import { countries as COUNTRIES } from '../../../_mock/map/countries';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import { SkeletonMap } from '../../../components/skeleton';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
const MapHeatmap = lazy(() => import('../../../sections/overview/extra/map/heatmap'));
const MapGeojson = lazy(() => import('../../../sections/overview/extra/map/geojson'));
const MapClusters = lazy(() => import('../../../sections/overview/extra/map/MapClusters'));
const MapInteraction = lazy(() => import('../../../sections/overview/extra/map/interaction'));
const MapChangeTheme = lazy(() => import('../../../sections/overview/extra/map/change-theme'));
const MapZoomToBounds = lazy(() => import('../../../sections/overview/extra/map/MapZoomToBounds'));
const MapMarkersPopups = lazy(
  () => import('../../../sections/overview/extra/map/MapMarkersPopups')
);
const MapDeckglOverlay = lazy(
  () => import('../../../sections/overview/extra/map/MapDeckglOverlay')
);
const MapDynamicStyling = lazy(
  () => import('../../../sections/overview/extra/map/dynamic-styling')
);
const MapDraggableMarkers = lazy(
  () => import('../../../sections/overview/extra/map/draggable-markers')
);
const MapGeoJSONAnimation = lazy(
  () => import('../../../sections/overview/extra/map/MapGeoJSONAnimation')
);
const MapViewportAnimation = lazy(
  () => import('../../../sections/overview/extra/map/viewport-animation')
);
const MapHighlightByFilter = lazy(
  () => import('../../../sections/overview/extra/map/MapHighlightByFilter')
);

// ----------------------------------------------------------------------

const THEMES = {
  streets: 'mapbox://styles/mapbox/streets-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
};

const baseSettings = {
  mapboxApiAccessToken: MAPBOX_API,
  width: '100%',
  height: '100%',
  minZoom: 1,
};

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15),
}));

const MapWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 560,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

// ----------------------------------------------------------------------

DemoMap.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function DemoMap() {
  return (
    <Page title="Components: Map">
      <RootStyle>
        <Box
          sx={{
            pt: 6,
            pb: 1,
            mb: 10,
            bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
          }}
        >
          <Container maxWidth="lg">
            <HeaderBreadcrumbs
              heading="Map"
              links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'Map' }]}
              moreLink={[
                'http://visgl.github.io/react-map-gl',
                'https://docs.mapbox.com-js/example',
              ]}
            />
          </Container>
        </Box>

        <Container maxWidth="lg">
          <Suspense fallback={<SkeletonMap />}>
            <Stack spacing={5}>
              <Card>
                <CardHeader title="Map Change Theme" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapChangeTheme {...baseSettings} themes={THEMES} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Dynamic Styling" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapDynamicStyling {...baseSettings} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Markers & Popups" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapMarkersPopups {...baseSettings} data={COUNTRIES} mapStyle={THEMES.light} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Draggable Markers" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapDraggableMarkers {...baseSettings} mapStyle={THEMES.light} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Geojson" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapGeojson {...baseSettings} mapStyle={THEMES.light} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Geojson Animation" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapGeoJSONAnimation {...baseSettings} mapStyle={THEMES.satelliteStreets} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Clusters" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapClusters {...baseSettings} mapStyle={THEMES.light} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Interaction" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapInteraction {...baseSettings} mapStyle={THEMES.light} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Viewport Animation" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapViewportAnimation
                      {...baseSettings}
                      data={CITIES.filter((city) => city.state === 'Texas')}
                      mapStyle={THEMES.light}
                    />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Highlight By Filter" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapHighlightByFilter {...baseSettings} mapStyle={THEMES.light} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Zoom To Bounds" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapZoomToBounds {...baseSettings} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Deckgl Overlay" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapDeckglOverlay {...baseSettings} mapStyle={THEMES.light} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Map Heatmap" />
                <CardContent>
                  <MapWrapperStyle>
                    <MapHeatmap {...baseSettings} mapStyle={THEMES.light} />
                  </MapWrapperStyle>
                </CardContent>
              </Card>
            </Stack>
          </Suspense>
        </Container>
      </RootStyle>
    </Page>
  );
}
