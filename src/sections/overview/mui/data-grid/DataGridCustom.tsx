import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box, Rating, LinearProgress, IconButton } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridSelectionModel,
  GridFilterInputValueProps,
  getGridNumericColumnOperators,
} from '@mui/x-data-grid';
// utils
import createAvatar from '../../../../utils/createAvatar';
import { fPercent } from '../../../../utils/formatNumber';
// _mock_
import { _dataGrid } from '../../../../_mock';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

function RenderStatus(getStatus: string) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <Label
      variant={isLight ? 'ghost' : 'filled'}
      color={(getStatus === 'busy' && 'error') || (getStatus === 'away' && 'warning') || 'success'}
      sx={{ textTransform: 'capitalize', mx: 'auto' }}
    >
      {getStatus}
    </Label>
  );
}

const columns: GridColDef[] = [
  // OPTIONS
  // https://material-ui.com/api/data-grid/grid-col-def/#main-content
  // - hide: false (default)
  // - editable: false (default)
  // - filterable: true (default)
  // - sortable: true (default)
  // - disableColumnMenu: false (default)

  // FIELD TYPES
  // --------------------
  // 'string' (default)
  // 'number'
  // 'date'
  // 'dateTime'
  // 'boolean'
  // 'singleSelect'

  {
    field: 'id',
    hide: true,
  },
  {
    field: 'avatar',
    headerName: 'Avatar',
    width: 64,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: 'center',
    renderCell: (params) => {
      const getAvatar = params.getValue(params.id, 'name') as string;
      return (
        <Avatar color={createAvatar(getAvatar).color} sx={{ width: 36, height: 36 }}>
          {createAvatar(getAvatar).name}
        </Avatar>
      );
    },
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    editable: true,
    renderCell: (params) => {
      const getEmail = params.getValue(params.id, 'email');
      return (
        <Typography variant="body2" sx={{ textDecoration: 'underline' }} noWrap>
          {getEmail}
        </Typography>
      );
    },
  },
  {
    field: 'lastLogin',
    type: 'dateTime',
    headerName: 'Last login',
    width: 200,
    align: 'right',
    headerAlign: 'right',
  },
  {
    field: 'rating',
    type: 'number',
    headerName: 'Rating',
    width: 160,
    disableColumnMenu: true,
    renderCell: (params) => {
      const getRating = params.getValue(params.id, 'rating') as number;
      return <Rating size="small" value={getRating} precision={0.5} readOnly />;
    },
  },
  {
    field: 'status',
    type: 'singleSelect',
    headerName: 'Status',
    width: 120,
    valueOptions: ['online', 'away', 'busy'],
    renderCell: (params) => {
      const getStatus = params.getValue(params.id, 'status') as string;
      return RenderStatus(getStatus);
    },
  },
  {
    field: 'isAdmin',
    type: 'boolean',
    width: 120,
    renderCell: (params) => {
      const getAdmin = params.getValue(params.id, 'isAdmin');
      return (
        <Stack alignItems="center" sx={{ width: 1, textAlign: 'center' }}>
          {getAdmin ? (
            <Iconify
              icon={'eva:checkmark-circle-2-fill'}
              sx={{ width: 20, height: 20, color: 'primary.main' }}
            />
          ) : (
            '-'
          )}
        </Stack>
      );
    },
  },
  {
    field: 'performance',
    type: 'number',
    headerName: 'Performance',
    width: 160,
    renderCell: (params) => {
      const value = params.getValue(params.id, 'performance') as number;
      return (
        <Stack direction="row" alignItems="center" sx={{ px: 2, width: 1, height: 1 }}>
          <LinearProgress
            value={value}
            variant="determinate"
            color={(value < 30 && 'error') || (value > 30 && value < 70 && 'warning') || 'primary'}
            sx={{ width: 1, height: 6 }}
          />
          <Typography variant="caption" sx={{ width: 90 }}>
            {fPercent(value)}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: 'action',
    headerName: ' ',
    width: 80,
    align: 'right',
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const selectedID = params.row.id;

      const handleClick = () => {
        console.log('selectedID', selectedID);
      };

      return (
        <IconButton onClick={handleClick}>
          <Iconify icon={'eva:more-vertical-fill'} sx={{ width: 20, height: 20 }} />
        </IconButton>
      );
    },
  },
];

// ----------------------------------------------------------------------

function RatingInputValue({ item, applyValue }: GridFilterInputValueProps) {
  return (
    <Box sx={{ p: 1, height: 1, alignItems: 'flex-end', display: 'flex' }}>
      <Rating
        size="small"
        precision={0.5}
        placeholder="Filter value"
        value={Number(item.value)}
        onChange={(event, newValue) => {
          applyValue({ ...item, value: newValue });
        }}
      />
    </Box>
  );
}

export default function DataGridCustom() {
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  if (columns.length > 0) {
    const ratingColumn = columns.find((column) => column.field === 'rating')!;
    const ratingColIndex = columns.findIndex((col) => col.field === 'rating');

    const ratingFilterOperators = getGridNumericColumnOperators().map((operator) => ({
      ...operator,
      InputComponent: RatingInputValue,
    }));
    columns[ratingColIndex] = {
      ...ratingColumn,
      filterOperators: ratingFilterOperators,
    };
  }

  const selected = _dataGrid.filter((row) => selectionModel.includes(row.id));

  console.log('selected', selected);

  return (
    <>
      <DataGrid
        checkboxSelection
        disableSelectionOnClick
        rows={_dataGrid}
        columns={columns}
        pagination
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </>
  );
}
