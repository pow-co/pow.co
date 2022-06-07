// @mui
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  query: string;
  options: { value: string; label: string }[];
  onSort: (value: string) => void;
};

export default function BlogPostsSort({ query, options, onSort }: Props) {
  return (
    <TextField
      select
      size="small"
      value={query}
      onChange={(event) => onSort(event.target.value)}
      sx={{
        '& .MuiSelect-select': {
          typography: 'body2',
        },
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{ typography: 'body2', mx: 1, my: 0.5, borderRadius: 0.75 }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
