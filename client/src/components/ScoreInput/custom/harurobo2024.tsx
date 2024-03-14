import { CSSProperties } from 'react';
import { FieldSideType } from '@/slices/score';
import { Box, Stack, SxProps } from '@mui/material';

const HinaNingyoSvg = (props: { style?: CSSProperties }) => (
  <svg
    width='100%'
    height='100%'
    viewBox='0 0 30 44'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      strokeMiterlimit: 2,
      strokeWidth: 1,
      ...props.style
    }}
  >
    <g transform="matrix(1,0,0,1,-675,-129)">
        <g transform="matrix(1,0,0,1,-5.2756,4.59614)">
            <g transform="matrix(0.56924,0,0,0.56924,353.731,70.0915)">
                <path d="M611.698,132.946C615.625,135.822 625,144.502 625,161.83L625,171.83L575,171.83L575,161.83C575,142.701 584.033,135.204 588.099,132.798C583.186,129.152 580,123.309 580,116.727C580,105.688 588.962,96.727 600,96.727C611.038,96.727 620,105.688 620,116.727C620,123.398 616.726,129.312 611.698,132.946Z" />
            </g>
        </g>
    </g>
  </svg>
);

export const HinaNingyoIcon = (props: { stat: 'none'|'red'|'blue' }) => (
  <HinaNingyoSvg style={{
    width: '32px',
    stroke: props.stat === 'none' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
    strokeDasharray: props.stat === 'none' ? '4 2' : undefined,
    fill: props.stat === 'red' ? 'rgba(240, 0, 0, 0.9)'
        : props.stat === 'blue' ? 'rgba(0, 0, 240, 0.9)' : 'rgba(127,127,127,0.3)',
  }} />
);

export const HinaBaseLayer = (props: {
  label: string,
  isPlaced: boolean,
  boxHeight: number,
  boxWidth: number,
  color: string,
  children?: React.ReactNode,
  sx?: SxProps,
}) => (
  <Box sx={{
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '100px',
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    ...props.sx,
  }}>
    <Box sx={{ 
      width: `${props.boxWidth}px`,
      height: `${props.boxHeight}px`,
      lineHeight: `${props.boxHeight + 3}px`,
      fontSize: '14px',
      color: props.isPlaced ? 'rgba(255, 255, 255, 0.8)' : 'rgba(60, 60, 60, 0.8)',
      backgroundColor: props.isPlaced ? props.color : 'rgba(240, 240, 240, 0.2)',
      borderWidth: '1px',
      borderStyle: props.isPlaced ? 'solid' : 'dashed',
      borderColor: props.isPlaced ? 'rgba(255, 255, 255, 0.8)' : 'rgba(60, 60, 60, 0.5)',
    }}>
      {props.isPlaced ? '☑' : '□'} {props.label}
    </Box>
    {props.isPlaced && <Stack direction='row' spacing='48px'>
      {props.children}
    </Stack>}
  </Box>
);

export const ScoreDetailDisplay = (props: {
    color: string,
    fieldSide: FieldSideType,
    taskObjects: { [key: string]: number },
  }) => {
    const boxColor = {
      red: 'rgba(240, 50, 50, 0.9)',
      blue: 'rgba(50, 50, 240, 0.9)',
    }[props.fieldSide];
    const 内裏雛の数 = props.taskObjects["rule_F"];
    const 三人官女の数 = props.taskObjects["rule_G"];
  
    return <Box sx={{ 
      width: '300px',
      height: '120px',
      position: 'relative',
    }}>
  
      <HinaBaseLayer
        label="小台座"
        isPlaced={Boolean(props.taskObjects["rule_D"])}
        boxHeight={25} 
        boxWidth={135}
        color={boxColor}
        sx={{ bottom: 26 }}
      >
        <HinaNingyoIcon stat={内裏雛の数 >= 1 ? props.fieldSide : 'none'} />
        <HinaNingyoIcon stat={内裏雛の数 >= 2 ? props.fieldSide : 'none'} />
      </HinaBaseLayer>
  
      <HinaBaseLayer
        label="大台座"
        isPlaced={Boolean(props.taskObjects["rule_C"])}
        boxHeight={25}
        boxWidth={240}
        color={boxColor}
        sx={{ bottom: 0 }}
      >
        <HinaNingyoIcon stat={三人官女の数 >= 1 ? props.fieldSide : 'none'} />
        <HinaNingyoIcon stat={三人官女の数 >= 2 ? props.fieldSide : 'none'} />
        <HinaNingyoIcon stat={三人官女の数 >= 3 ? props.fieldSide : 'none'} />
      </HinaBaseLayer>
    </Box>
  };
  