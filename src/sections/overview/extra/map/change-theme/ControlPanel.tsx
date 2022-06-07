import { memo } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Radio, Typography, RadioGroup, FormControlLabel } from '@mui/material';
// utils
import cssStyles from '../../../../../utils/cssStyles';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

type ControlPanelProps = {
  themes: Record<string, string>;
  selectTheme: string;
  onChangeTheme: (theme: string) => void;
};

function ControlPanel({ themes, selectTheme, onChangeTheme }: ControlPanelProps) {
  return (
    <RootStyle>
      <Typography gutterBottom variant="subtitle2" sx={{ color: 'common.white' }}>
        Select Theme:
      </Typography>
      <RadioGroup value={selectTheme} onChange={(e, value) => onChangeTheme(value)}>
        {Object.keys(themes).map((item) => (
          <FormControlLabel
            key={item}
            value={item}
            control={<Radio size="small" />}
            label={item}
            sx={{ color: 'common.white', textTransform: 'capitalize' }}
          />
        ))}
      </RadioGroup>
    </RootStyle>
  );
}

export default memo(ControlPanel);
