import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  type AppBarProps as MuiAppBarProps,
  Drawer as MuiDrawer,
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  type Theme,
} from '@mui/material';
import { styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemIcon from '@mui/material/ListItemIcon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import BuildIcon from '@mui/icons-material/Build';
import CastIcon from '@mui/icons-material/Cast';
import VideocamIcon from '@mui/icons-material/Videocam';
import { StandaloneIndicator } from './StandaloneIndicator';
import { SettingButton } from './SettingModal';
import { isDrawerOpen } from '@/atoms/isDrawerOpen';
import { useRecoilState } from 'recoil';

const drawerWidth = 240;

const DrawerListLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
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
    }),
  },
}));

interface DashboardProps {
  children: React.ReactNode;
  title: string;
}

export const Dashboard: FC<DashboardProps> = ({ children, title }) => {
  const [_open, setOpen] = useRecoilState(isDrawerOpen);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const spMode = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'));
  const open = _open ?? !spMode;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar color="default" position="absolute" open={open}>
        <Toolbar
          sx={{
            paddingRight: '24px', // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {title}
          </Typography>
          <StandaloneIndicator />
          <SettingButton />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 8px',
          }}
        >
          <IconButton onClick={handleDrawerClose} size="large">
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <DrawerListLink to="/">
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </DrawerListLink>
          <DrawerListLink to="/referee">
            <ListItemButton>
              <ListItemIcon>
                <SportsScoreIcon />
              </ListItemIcon>
              <ListItemText primary="主審入力" />
            </ListItemButton>
          </DrawerListLink>
          <DrawerListLink to="/score/blue/">
            <ListItemButton>
              <ListItemIcon>
                <AssignmentIcon
                  sx={{ color: (theme) => theme.palette.primary.main }}
                />
              </ListItemIcon>
              <ListItemText primary="青チーム入力" />
            </ListItemButton>
          </DrawerListLink>
          <DrawerListLink to="/score/red/">
            <ListItemButton>
              <ListItemIcon>
                <AssignmentIcon
                  sx={{ color: (theme) => theme.palette.secondary.main }}
                />
              </ListItemIcon>
              <ListItemText primary="赤チーム入力" />
            </ListItemButton>
          </DrawerListLink>
        </List>
        <Divider />
        <List component="nav">
          <DrawerListLink to="/admin">
            <ListItemButton>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="試合管理" />
            </ListItemButton>
          </DrawerListLink>
          <DrawerListLink to="/screen">
            <ListItemButton>
              <ListItemIcon>
                <CastIcon />
              </ListItemIcon>
              <ListItemText primary="スクリーン" />
            </ListItemButton>
          </DrawerListLink>
          <DrawerListLink to="/streaming-overlay-opener">
            <ListItemButton>
              <ListItemIcon>
                <VideocamIcon />
              </ListItemIcon>
              <ListItemText primary="配信オーバーレイ" />
            </ListItemButton>
          </DrawerListLink>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Box sx={(theme) => theme.mixins.toolbar} />
        <Container maxWidth="lg" sx={{ my: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};
