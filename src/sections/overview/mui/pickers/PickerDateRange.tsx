import { useState } from 'react';
// @mui
import { Box, TextField, Typography } from '@mui/material';
import {
  Masonry,
  DateRange,
  DateRangePicker,
  MobileDateRangePicker,
  DesktopDateRangePicker,
  StaticDateRangePicker,
} from '@mui/lab';
//
import { Block } from '../../Block';

// ----------------------------------------------------------------------

export default function PickerDateRange() {
  const [value, setValue] = useState<DateRange<Date>>([null, null]);

  return (
    <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
      <Block title="Basic">
        <DateRangePicker
          startText="Check-in"
          endText="Check-out"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}>to</Box>
              <TextField {...endProps} />
            </>
          )}
        />
      </Block>

      <Block title="Responsiveness">
        <MobileDateRangePicker
          startText="Mobile start"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </>
          )}
        />
        <br />

        <DesktopDateRangePicker
          startText="Desktop start"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </>
          )}
        />
      </Block>

      <Block title="Different number of months">
        <Typography gutterBottom> 1 calendar </Typography>
        <DateRangePicker
          calendars={1}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}>to</Box>
              <TextField {...endProps} />
            </>
          )}
        />

        <br />

        <Typography gutterBottom> 2 calendars</Typography>
        <DateRangePicker
          calendars={2}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}>to</Box>
              <TextField {...endProps} />
            </>
          )}
        />

        <br />

        <Typography gutterBottom> 3 calendars</Typography>
        <DateRangePicker
          calendars={3}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}>to</Box>
              <TextField {...endProps} />
            </>
          )}
        />
      </Block>

      <Block title="Static mode">
        <StaticDateRangePicker
          displayStaticWrapperAs="desktop"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} variant="standard" />
              <Box sx={{ mx: 2 }}>to</Box>
              <TextField {...endProps} variant="standard" />
            </>
          )}
        />
      </Block>
    </Masonry>
  );
}
