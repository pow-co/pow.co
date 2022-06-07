import { memo } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
// @types
import { CityData } from '../../../../../components/map/type';
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
  data: CityData[];
  selectedCity?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, city: CityData) => void;
};

function ControlPanel({ data, selectedCity, handleChange }: ControlPanelProps) {
  return (
    <RootStyle>
      {data.map((city) => (
        <RadioGroup
          key={city.city}
          value={selectedCity}
          onChange={(event) => handleChange(event, city)}
        >
          <FormControlLabel
            value={city.city}
            label={city.city}
            control={<Radio size="small" />}
            sx={{ color: 'common.white' }}
          />
        </RadioGroup>
      ))}
    </RootStyle>
  );
}

export default memo(ControlPanel);
