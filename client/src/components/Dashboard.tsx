import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Box, Container, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemText, Toolbar, Typography, ListSubheader } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemIcon from '@mui/material/ListItemIcon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import BuildIcon from '@mui/icons-material/Build';
import CastIcon from '@mui/icons-material/Cast';
import VideocamIcon from '@mui/icons-material/Videocam';
import { SettingButton } from './SettingModal';
import { isDrawerOpen } from 'atoms/isDrawerOpen';
import { useRecoilState } from 'recoil';
import { styled } from '@mui/material';

const drawerWidth = 240;

const DrawerListLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
}));

const ContentMain = styled('main')(({ theme }) => ({
  flexGrow: 1,
  height: '100vh',
  overflow: 'auto',
}));

interface DashboardProps {
  children: React.ReactChild;
  title: string;
}

export const Dashboard: FC<DashboardProps> = ({
  children,
  title,
}) => {
  const [open, setOpen] = useRecoilState(isDrawerOpen);
  const handleDrawerOpen = () => { setOpen(true); };
  const handleDrawerClose = () => { setOpen(false); };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar color="default" position="absolute"
        sx={[
          {
            zIndex: (theme) => theme.zIndex.drawer + 1,
            transition: (theme) => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
          open ? {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          } : {},
        ]}
      >
        <Toolbar sx={{ paddingRight: '24px' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
             }}
            size="large">
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <SettingButton />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={(theme) => ({
          position: 'relative',
          whiteSpace: 'nowrap',
          width: drawerWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
              width: theme.spacing(9),
            },
            background: "red",
          }),
         })}
        open={open}
      >
        <Box sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 8px',
            ...theme.mixins.toolbar,
         })}>
          <IconButton onClick={handleDrawerClose} size="large">
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <DrawerListLink to="/">
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </DrawerListLink>
          <DrawerListLink to="/referee">
            <ListItem button>
              <ListItemIcon>
                <SportsScoreIcon />
              </ListItemIcon>
              <ListItemText primary="主審入力" />
            </ListItem>
          </DrawerListLink>
          <DrawerListLink to="/score/blue/">
            <ListItem button>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="青チーム入力" />
            </ListItem>
          </DrawerListLink>
          <DrawerListLink to="/score/red/">
            <ListItem button>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="赤チーム入力" />
            </ListItem>
          </DrawerListLink>
        </List>
        <Divider />
        <ListSubheader inset>ふぇぇ…</ListSubheader>
        <DrawerListLink to="/admin">
          <ListItem button>
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="試合管理" />
          </ListItem>
        </DrawerListLink>
        <DrawerListLink to="/screen">
          <ListItem button>
            <ListItemIcon>
              <CastIcon />
            </ListItemIcon>
            <ListItemText primary="スクリーン" />
          </ListItem>
        </DrawerListLink>
        <DrawerListLink to="/streaming-overlay-opener">
          <ListItem button>
            <ListItemIcon>
              <VideocamIcon />
            </ListItemIcon>
            <ListItemText primary="配信オーバーレイ" />
          </ListItem>
        </DrawerListLink>
      </Drawer>
      <ContentMain>
        <Box sx={(theme) => theme.mixins.toolbar} />
        <Container maxWidth="lg" sx={{
          paddingTop: (theme) => theme.spacing(4),
          paddingBottom: (theme) => theme.spacing(4),
         }}>
          {children}
        </Container>
      </ContentMain>
    </Box>
  );
}
