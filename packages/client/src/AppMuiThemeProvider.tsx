import type { ReactNode } from 'react';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
  alpha,
} from '@mui/material/styles';
import { blue, grey, pink } from '@mui/material/colors';
import '@fontsource/noto-sans-jp/index.css';

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    grey: true;
  }
}

const fontFamily = ['Noto Sans JP', 'sans-serif'].join(',');

const baseTheme = createTheme({
  typography: {
    fontFamily,
  },
  palette: {
    primary: blue,
    secondary: pink,
    grey: grey,
  },
});

// v4までの"default"の色を再現する"grey"を追加
// https://github.com/mui/material-ui/issues/27468
const appTheme = createTheme(baseTheme, {
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained', color: 'grey' },
          style: {
            color: baseTheme.palette.getContrastText(
              baseTheme.palette.grey[300],
            ),
          },
        },
        {
          props: { variant: 'outlined', color: 'grey' },
          style: {
            color: baseTheme.palette.text.primary,
            borderColor:
              baseTheme.palette.mode === 'light'
                ? 'rgba(0, 0, 0, 0.23)'
                : 'rgba(255, 255, 255, 0.23)',
            '&.Mui-disabled': {
              border: `1px solid ${baseTheme.palette.action.disabledBackground}`,
            },
            '&:hover': {
              borderColor:
                baseTheme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.23)'
                  : 'rgba(255, 255, 255, 0.23)',
              backgroundColor: alpha(
                baseTheme.palette.text.primary,
                baseTheme.palette.action.hoverOpacity,
              ),
            },
          },
        },
        {
          props: { color: 'grey', variant: 'text' },
          style: {
            color: baseTheme.palette.text.primary,
            '&:hover': {
              backgroundColor: alpha(
                baseTheme.palette.text.primary,
                baseTheme.palette.action.hoverOpacity,
              ),
            },
          },
        },
      ],
    },
  },
});

type Props = {
  children: ReactNode;
};

export const AppMuiThemeProvider = ({ children }: Props) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};
