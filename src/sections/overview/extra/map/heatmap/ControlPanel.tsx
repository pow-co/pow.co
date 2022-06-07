import { memo } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Slider, Switch, Typography } from '@mui/material';
// utils
import { fDate } from '../../../../../utils/formatTime';
import cssStyles from '../../../../../utils/cssStyles';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ color: theme.palette.grey[900] }),
  zIndex: 9,
  minWidth: 240,
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

// ----------------------------------------------------------------------

type ControlPanelProps = {
  startTime: number;
  endTime: number;
  allDays: boolean;
  selectedTime: number;
  onChangeTime: (value: number) => void;
  onChangeAllDays: (value: boolean) => void;
};

function ControlPanel({
  startTime,
  endTime,
  allDays,
  selectedTime,
  onChangeTime,
  onChangeAllDays,
}: ControlPanelProps) {
  const day = 24 * 60 * 60 * 1000;
  const days = Math.round((endTime - startTime) / day);
  const selectedDay = Math.round((selectedTime - startTime) / day);

  const handleChangeDays = (value: number) => {
    const daysToAdd = value;
    const newTime = startTime + daysToAdd * day;
    onChangeTime(newTime);
  };

  return (
    <RootStyle>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'common.white' }}>
          All Days
        </Typography>
        <Switch
          size="small"
          checked={allDays}
          onChange={(event) => onChangeAllDays(event.target.checked)}
        />
      </Box>
      <br />
      <Typography
        gutterBottom
        variant="body2"
        sx={{ color: allDays ? 'text.disabled' : 'common.white' }}
      >
        Each Day: {fDate(selectedTime)}
      </Typography>
      <Slider
        min={1}
        step={1}
        max={days}
        disabled={allDays}
        value={selectedDay}
        onChange={(e, value) => {
          if (typeof value === 'number') handleChangeDays(value);
        }}
      />
    </RootStyle>
  );
}

export default memo(ControlPanel);
