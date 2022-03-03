import React, { FC } from 'react';
import clsx from 'clsx';
import { Link } from "react-router-dom";
import { AppBar, Container, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemText, makeStyles, Toolbar, Typography, ListSubheader } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BuildIcon from '@material-ui/icons/Build';
import CastIcon from '@material-ui/icons/Cast';
import VideocamIcon from '@material-ui/icons/Videocam';
import { SettingButton } from './SettingModal';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  drawerListLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

interface DashboardProps {
  children: React.ReactChild;
  title: string;
}

export const Dashboard: FC<DashboardProps> = ({
  children,
  title,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => { setOpen(true); };
  const handleDrawerClose = () => { setOpen(false); };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar color="default" position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {title}
          </Typography>
          <SettingButton />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <Link to="/" className={classes.drawerListLink}>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>
          <Link to="/score/blue/" className={classes.drawerListLink}>
            <ListItem button>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="青チーム入力" />
            </ListItem>
          </Link>
          <Link to="/score/red/" className={classes.drawerListLink}>
            <ListItem button>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="赤チーム入力" />
            </ListItem>
          </Link>
        </List>
        <Divider />
          <ListSubheader inset>ふぇぇ…</ListSubheader>
          <Link to="/admin" className={classes.drawerListLink}>
            <ListItem button>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="試合管理" />
            </ListItem>
          </Link>
          <ListItem button>
            <ListItemIcon>
              <CastIcon />
            </ListItemIcon>
            <ListItemText primary="スクリーン" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <VideocamIcon />
            </ListItemIcon>
            <ListItemText primary="配信overlay" />
          </ListItem>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {children}
        </Container>
      </main>
    </div>
  );
}
