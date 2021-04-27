import axios from 'axios';
import { useState } from 'react';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

import {
  ChevronRight as ChevronRightIcon,
  Inbox as BoxIcon,
} from '@material-ui/icons';

import BoxForm from './BoxForm';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import { default as RouteLink } from './Link';
import { useAuth } from '../contexts/AuthContext';
import { useBoxes } from '../contexts/BoxContext';
import { useLocation } from 'react-router';
import { jsonDeepCopy, unhandledError } from '../util';

const useStyles = makeStyles((theme) => ({
  userActions: {
    margin: theme.spacing(0, 1),
  },
  actionGroup: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function BoxListItem({
  _id,
  name,
  description = '',
  recipes = [],
}) {
  const classes = useStyles();
  const { token, isAuthenticated } = useAuth();
  const { refresh } = useBoxes();
  const [boxFormVisible, setBoxFormVisible] = useState(false);
  const [working, setWorking] = useState(false);
  const location = useLocation();

  const completeAction = () => {
    console.debug('Refreshing Boxes');
    refresh();
    setWorking(false);
  };

  return (
    <>
      <ListItem button>
        <ListItemIcon>
          <BoxIcon />
        </ListItemIcon>
        <ListItemText
          primary={name}
          secondary={`${recipes.length} Recipes${
            description ? `: ${description}` : ''
          }`}
        />
        <ListItemSecondaryAction className={classes.actionGroup}>
          <RouteLink
            to={{
              pathname: `/box/${_id}`,
              state: { backdrop: location },
            }}
          >
            <IconButton>
              <ChevronRightIcon />
            </IconButton>
          </RouteLink>
          {isAuthenticated && (
            <>
              <EditButton
                size="small"
                pending={working}
                className={classes.userActions}
                onClick={() => {
                  console.debug(`Edit Box (${_id})`);
                  setWorking(true);
                  setBoxFormVisible(true);
                }}
              />
              <DeleteButton
                size="small"
                pending={working}
                className={classes.userActions}
                onClick={() => {
                  console.debug(`Delete Box (${_id})`);
                  setWorking(true);
                  axios
                    .delete(`${process.env.REACT_APP_API_URL}/box/${_id}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    })
                    .then(() => completeAction()) // refresh boxes
                    .catch(unhandledError);
                }}
              />
            </>
          )}
        </ListItemSecondaryAction>
      </ListItem>
      {boxFormVisible && (
        <BoxForm
          initialValues={jsonDeepCopy({ name, description, recipes })}
          onClose={() => {
            setWorking(false);
            setBoxFormVisible(false);
          }}
          onSubmit={(values) => {
            console.debug('Update Box', values);
            axios
              .patch(`${process.env.REACT_APP_API_URL}/box/${_id}`, values, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then(() => completeAction())
              .catch(unhandledError)
              .finally(() => setBoxFormVisible(false));
          }}
        />
      )}
    </>
  );
}
