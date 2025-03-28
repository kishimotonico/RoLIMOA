import { Tooltip, type TooltipProps } from '@mui/material';

type ConditionalTooltipProp = TooltipProps & {
  condition?: boolean,
};

export const ConditionalTooltip = ({
  condition,
  children,
  ...rest
}: ConditionalTooltipProp) => (
  condition ? (
    <Tooltip {...rest}>
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  )
);
