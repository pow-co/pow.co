import { memo, useEffect, useState } from 'react';
import { fromJS } from 'immutable';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Switch, Typography } from '@mui/material';
// _mock_
import MAP_STYLE from '../../../../../_mock/map/map-style-basic-v8.json';
// utils
import cssStyles from '../../../../../utils/cssStyles';

// ----------------------------------------------------------------------

const defaultMapStyle = fromJS(MAP_STYLE) as any;

const CATEGORIES = ['labels', 'roads', 'buildings', 'parks', 'water', 'background'] as const;

const LAYER_SELECTOR = {
  background: /background/,
  water: /water/,
  parks: /park/,
  buildings: /building/,
  roads: /bridge|road|tunnel/,
  labels: /label|place|poi/,
} as const;

type ColorClassKey = 'line' | 'fill' | 'background' | 'symbol';

const COLOR_CLASS = {
  line: 'line-color',
  fill: 'fill-color',
  background: 'background-color',
  symbol: 'text-color',
} as const;

const RootStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ color: theme.palette.grey[900] }),
  zIndex: 9,
  minWidth: 200,
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const ColorBoxStyle = styled('div')(({ theme }) => ({
  width: 20,
  height: 20,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1),
  border: `solid 1px ${theme.palette.grey[500]}`,
  '& input': {
    width: 12,
    height: 12,
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    backgroundColor: 'transparent',
    '&::-webkit-color-swatch-wrapper': { padding: 0 },
    '&::-moz-color-swatch': { border: 'none', borderRadius: '50%' },
    '&::-webkit-color-swatch': { border: 'none', borderRadius: '50%' },
  },
}));

// ----------------------------------------------------------------------

function ControlPanel({ onChange }: { onChange: (value: string) => void }) {
  const theme = useTheme();
  const [visibility, setVisibility] = useState({
    water: true,
    parks: true,
    roads: true,
    labels: true,
    buildings: true,
    background: true,
  });
  const [color, setColor] = useState({
    water: theme.palette.grey[900],
    labels: theme.palette.grey[800],
    parks: theme.palette.primary.dark,
    buildings: theme.palette.grey[900],
    background: theme.palette.grey[700],
    roads: theme.palette.warning.darker,
  });

  useEffect(() => {
    updateMapStyle({ color, visibility });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, visibility]);

  const onColorChange = (name: string, value: string) => {
    const state = {
      ...color,
      [name]: value,
    };
    setColor(state);
    updateMapStyle({
      color: state,
      visibility,
    });
  };

  const onVisibilityChange = (name: string, checked: boolean) => {
    const state = {
      ...visibility,
      [name]: checked,
    };
    setVisibility(state);
    updateMapStyle({
      color,
      visibility: state,
    });
  };

  const updateMapStyle = ({
    color,
    visibility,
  }: {
    color: Record<string, string>;
    visibility: Record<string, boolean>;
  }) => {
    const layers = defaultMapStyle
      .get('layers')
      .filter((layer: any) => {
        const id = layer.get('id');
        return CATEGORIES.every((name) => visibility[name] || !LAYER_SELECTOR[name].test(id));
      })
      .map((layer: any) => {
        const id = layer.get('id');
        const type: ColorClassKey = layer.get('type');
        const category = CATEGORIES.find((name) => LAYER_SELECTOR[name].test(id));
        if (category && COLOR_CLASS[type]) {
          return layer?.setIn(['paint', COLOR_CLASS[type]], color[category]);
        }
        return layer;
      });
    onChange(defaultMapStyle.set('layers', layers));
  };

  return (
    <RootStyle>
      {CATEGORIES.map((name) => (
        <Box key={name} sx={{ py: 1, display: 'flex', alignItems: 'center' }}>
          <ColorBoxStyle sx={{ ...(!visibility[name] && { opacity: 0.48 }) }}>
            <input
              type="color"
              value={color[name]}
              disabled={!visibility[name]}
              onChange={(event) => onColorChange(name, event.target.value)}
            />
          </ColorBoxStyle>
          <Typography
            variant="body2"
            sx={{
              flexGrow: 1,
              textTransform: 'capitalize',
              color: !visibility[name] ? 'text.disabled' : 'common.white',
            }}
          >
            {name}
          </Typography>
          <Switch
            size="small"
            checked={visibility[name]}
            onChange={(event) => onVisibilityChange(name, event.target.checked)}
          />
        </Box>
      ))}
    </RootStyle>
  );
}

export default memo(ControlPanel);
