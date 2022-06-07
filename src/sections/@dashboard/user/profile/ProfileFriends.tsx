// @mui
import {
  Box,
  Grid,
  Card,
  Link,
  Avatar,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';
// @types
import { Friend } from '../../../../@types/user';
// components
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';
import SocialsButton from '../../../../components/SocialsButton';
import SearchNotFound from '../../../../components/SearchNotFound';

// ----------------------------------------------------------------------

type Props = {
  friends: Friend[];
  findFriends: string;
  onFindFriends: (value: string) => void;
};

export default function ProfileFriends({ friends, findFriends, onFindFriends }: Props) {
  const friendFiltered = applyFilter(friends, findFriends);
  const isNotFound = friendFiltered.length === 0;

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Friends
      </Typography>

      <InputStyle
        stretchStart={240}
        value={findFriends}
        onChange={(event) => onFindFriends(event.target.value)}
        placeholder="Find friends..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={'eva:search-fill'}
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={3}>
        {friendFiltered.map((friend) => (
          <Grid key={friend.id} item xs={12} md={4}>
            <FriendCard friend={friend} />
          </Grid>
        ))}
      </Grid>

      {isNotFound && (
        <Box sx={{ mt: 5 }}>
          <SearchNotFound searchQuery={findFriends} />
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

function FriendCard({ friend }: { friend: Friend }) {
  const { name, role, avatarUrl } = friend;

  return (
    <Card
      sx={{
        py: 5,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Avatar alt={name} src={avatarUrl} sx={{ width: 64, height: 64, mb: 3 }} />
      <Link variant="subtitle1" color="text.primary">
        {name}
      </Link>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        {role}
      </Typography>

      <SocialsButton initialColor />

      <IconButton sx={{ top: 8, right: 8, position: 'absolute' }}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>
    </Card>
  );
}
// ----------------------------------------------------------------------

function applyFilter(array: Friend[], query: string) {
  if (query) {
    return array.filter((friend) => friend.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return array;
}
