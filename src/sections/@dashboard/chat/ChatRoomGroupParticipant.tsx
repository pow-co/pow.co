// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  List,
  Avatar,
  Button,
  Collapse,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// @types
import { Participant as TParticipant } from '../../../@types/chat';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import BadgeStatus from '../../../components/BadgeStatus';
//
import ChatRoomPopup from './ChatRoomPopup';

// ----------------------------------------------------------------------

const HEIGHT = 64;

const CollapseButtonStyle = styled(Button)(({ theme }) => ({
  ...theme.typography.overline,
  height: 40,
  borderRadius: 0,
  padding: theme.spacing(1, 2),
  justifyContent: 'space-between',
  color: theme.palette.text.disabled,
}));

type Props = {
  participants: TParticipant[];
  selectUserId: string | null;
  onShowPopupUserInfo: (id: string | null) => void;
  isCollapse: boolean;
  onCollapse: VoidFunction;
};

// ----------------------------------------------------------------------

export default function ChatRoomGroupParticipant({
  participants,
  selectUserId,
  onShowPopupUserInfo,
  isCollapse,
  onCollapse,
}: Props) {
  return (
    <>
      <CollapseButtonStyle
        fullWidth
        disableRipple
        color="inherit"
        onClick={onCollapse}
        endIcon={
          <Iconify
            icon={isCollapse ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
            width={16}
            height={16}
          />
        }
      >
        In room ({participants.length})
      </CollapseButtonStyle>

      <Box sx={{ height: isCollapse ? HEIGHT * 4 : 0 }}>
        <Scrollbar>
          <Collapse in={isCollapse} sx={{ height: isCollapse ? HEIGHT * 4 : 0 }}>
            <List disablePadding>
              {participants.map((participant) => (
                <Participant
                  key={participant.id}
                  participant={participant}
                  isOpen={selectUserId === participant.id}
                  onShowPopup={() => onShowPopupUserInfo(participant.id)}
                  onClosePopup={() => onShowPopupUserInfo(null)}
                />
              ))}
            </List>
          </Collapse>
        </Scrollbar>
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

type ParticipantProps = {
  participant: TParticipant;
  isOpen: boolean;
  onClosePopup: VoidFunction;
  onShowPopup: VoidFunction;
};

function Participant({ participant, isOpen, onClosePopup, onShowPopup }: ParticipantProps) {
  const { name, avatar, status, position } = participant;

  return (
    <>
      <ListItemButton onClick={onShowPopup} sx={{ height: HEIGHT, px: 2.5 }}>
        <ListItemAvatar>
          <Box sx={{ position: 'relative', width: 40, height: 40 }}>
            <Avatar alt={name} src={avatar} />
            <BadgeStatus status={status} sx={{ right: 0, bottom: 0, position: 'absolute' }} />
          </Box>
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={position}
          primaryTypographyProps={{ variant: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{ noWrap: true }}
        />
      </ListItemButton>
      <ChatRoomPopup participant={participant} isOpen={isOpen} onClose={onClosePopup} />
    </>
  );
}
