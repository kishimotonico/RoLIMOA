import { FC, useEffect, useState } from 'react';
import { Box, Divider, FormControlLabel, Grid, IconButton, InputAdornment, Paper, Switch, TextField, Tooltip } from '@mui/material';
import { Dashboard } from 'components/Dashboard';
import { useResolvedPath } from 'react-router';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function useAbsoluteUrl(to: string) {
  // 現在のURLとpathnameから`to`のURLを生成
  const resolvedPath = useResolvedPath(to);
  const currentUrl = window.location.href;
  const currentPathname = window.location.pathname;
  return currentUrl.replace(currentPathname, resolvedPath.pathname);
}

function addQueryToUrl(baseUrl: string, query: Record<string, string | boolean | null | undefined> = {}) {
  const url = new URL(baseUrl);
  Object.entries(query).forEach(([k, v]) => {
    if (typeof v === "string") {
      url.searchParams.set(k, v);
      return;
    }
    if (v) {
      url.searchParams.set(k, "");
    }
  });
  return url.href;
}

export const StreamingOverlayOpenerPage: FC = () => {
  const baseUrl = useAbsoluteUrl("/streaming-overlay");
  const [overlayUrl, setOverlayUrl] = useState(baseUrl);

  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    const query = {
      reverse,
    };
    setOverlayUrl(addQueryToUrl(baseUrl, query));
  }, [baseUrl, reverse]);

  const [openTooltip, setOpenTooltip] = useState(false);

  return (
    <Dashboard title="配信オーバーレイ">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ padding: "1em" }}>
            <Box>
              <TextField
                label="配信オーバーレイURL"
                value={overlayUrl}
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <CopyToClipboard text={overlayUrl} onCopy={() => setOpenTooltip(true)}>
                        <Tooltip title="コピーしました！" arrow placement="top" open={openTooltip} onClose={() => setOpenTooltip(false)}>
                          <IconButton>
                            <ContentPasteIcon />
                          </IconButton>
                        </Tooltip>
                      </CopyToClipboard>
                      <a href={overlayUrl} target="_blank" rel="noreferrer">
                        <IconButton>
                          <OpenInNewIcon />
                        </IconButton>
                      </a>
                    </InputAdornment>
                  ),
                }}
              />
              <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
              <FormControlLabel
                control={
                  <Switch value={reverse} onChange={(event) => { setReverse(event.target.checked); }} />
                }
                label="左右を逆にする"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Dashboard>
  );
}
