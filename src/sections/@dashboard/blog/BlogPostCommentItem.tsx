import { useState } from 'react';
// @mui
import {
  Box,
  Button,
  Avatar,
  Divider,
  ListItem,
  TextField,
  Typography,
  ListItemText,
  ListItemAvatar,
  ListItemProps,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

interface BlogPostCommentItemProps extends ListItemProps {
  name: string;
  avatarUrl?: string;
  message: string;
  tagUser?: string;
  postedAt: Date;
  hasReply?: boolean;
}

export default function BlogPostCommentItem({
  name,
  avatarUrl,
  message,
  tagUser,
  postedAt,
  hasReply,
}: BlogPostCommentItemProps) {
  const [openReply, setOpenReply] = useState(false);

  const handleOpenReply = () => {
    setOpenReply(true);
  };

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          alignItems: 'flex-start',
          py: 3,
          ...(hasReply && {
            ml: 'auto',
            width: (theme) => `calc(100% - ${theme.spacing(7)})`,
          }),
        }}
      >
        <ListItemAvatar>
          <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />
        </ListItemAvatar>

        <ListItemText
          primary={name}
          primaryTypographyProps={{ variant: 'subtitle1' }}
          secondary={
            <>
              <Typography
                gutterBottom
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.disabled',
                }}
              >
                {fDate(postedAt)}
              </Typography>
              <Typography component="span" variant="body2">
                <strong>{tagUser}</strong> {message}
              </Typography>
            </>
          }
        />

        {!hasReply && (
          <Button size="small" onClick={handleOpenReply} sx={{ position: 'absolute', right: 0 }}>
            Reply
          </Button>
        )}
      </ListItem>

      {!hasReply && openReply && (
        <Box
          sx={{
            mb: 3,
            ml: 'auto',
            width: (theme) => `calc(100% - ${theme.spacing(7)})`,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Write comment"
            InputProps={{
              sx: {
                border: (theme) => `solid 1px ${theme.palette.grey[500_32]} !important`,
              },
            }}
          />
        </Box>
      )}

      <Divider
        sx={{
          ml: 'auto',
          width: (theme) => `calc(100% - ${theme.spacing(7)})`,
        }}
      />
    </>
  );
}
