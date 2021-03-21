import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import RoutedModal, { useInModal } from '../components/RoutedModal';
import ViewportCard from '../components/ViewportCard';
import { useAuth } from '../contexts/AuthContext';

function AccountInformation() {
  // TODO add stats, ability to change email and password

  const { user } = useAuth();
  console.log(user);
  const fullName = `${user?.name.first} ${user?.name.last}`;
  return (
    <List>
      <ListItem disableGutters>
        <ListItemAvatar>
          <Avatar src={user?.picture.large} alt={fullName} />
        </ListItemAvatar>
        <ListItemText primary={fullName} secondary={user?.email} />
      </ListItem>
    </List>
  );
}

export default function AccountDialog() {
  // a lot of the dialogs have a very similar base structure, it would be beneficial to abstract
  const inModal = useInModal();
  if (inModal) {
    return (
      <RoutedModal
        title="Account Information"
        closeActionText="Close"
        dialogOptions={{ fullWidth: true, maxWidth: 'md' }}
      >
        <AccountInformation />
      </RoutedModal>
    );
  }

  return (
    <ViewportCard title="Account Information">
      <AccountInformation />
    </ViewportCard>
  );
}