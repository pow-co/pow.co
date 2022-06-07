// @mui
import { InputAdornment, ClickAwayListener } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import InputStyle from '../../../components/InputStyle';

// ----------------------------------------------------------------------

type Props = {
  query: string;
  onChange: React.ChangeEventHandler;
  onFocus: VoidFunction;
  onClickAway: VoidFunction;
};

export default function ChatContactSearch({ query, onChange, onFocus, onClickAway }: Props) {
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <InputStyle
        fullWidth
        size="small"
        value={query}
        onFocus={onFocus}
        onChange={onChange}
        placeholder="Search contacts..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2 }}
      />
    </ClickAwayListener>
  );
}
