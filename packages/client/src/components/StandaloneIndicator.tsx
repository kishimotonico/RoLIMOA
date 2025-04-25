import PowerOffIcon from '@mui/icons-material/PowerOff';
import { Badge, Tooltip } from '@mui/material';
import { config } from '@rolimoa/common/config';

export const StandaloneIndicator = () => {
  if (!config.client.standalone_mode) {
    return null;
  }

  return (
    <Tooltip title="スタンドアローンモードです。このページは単体で動作し、得点の同期やタイマー機能が無効です。">
      <Badge sx={{ mr: 1 }} invisible>
        <PowerOffIcon sx={{ color: 'error' }} />
        standalone
      </Badge>
    </Tooltip>
  );
};
