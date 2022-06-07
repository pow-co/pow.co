import { memo } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Slider, Typography } from '@mui/material';
// utils
import cssStyles from '../../../../../utils/cssStyles';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ color: theme.palette.grey[900] }),
  zIndex: 99,
  minWidth: 200,
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

// ----------------------------------------------------------------------

type ControlPanelProps = {
  year: number;
  onChange: (year: number) => void;
};

function ControlPanel({ year, onChange }: ControlPanelProps) {
  return (
    <RootStyle>
      <Typography variant="body2" sx={{ color: 'common.white' }}>
        Year: {year}
      </Typography>
      <Slider
        name="year"
        value={year}
        step={1}
        min={1995}
        max={2015}
        onChange={(e, value) => {
          if (typeof value === 'number') {
            onChange(value);
          }
        }}
      />
    </RootStyle>
  );
}

export default memo(ControlPanel);
