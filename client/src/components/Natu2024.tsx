import { SxProps } from '@mui/material';
import { CenterFlex } from '@/ui/CenterFlex';

const Item = (props: { color: string, label: string, stat: boolean, sx?: SxProps }) => (
  <CenterFlex sx={{
    boxSizing: 'border-box',
    pt: 0.4,
    height: '100%',
    color: props.stat ? 'rgba(255, 255, 255, 1.0)' : 'rgba(20, 20, 20, 1.0)',
    backgroundColor: props.stat ? props.color : 'rgba(150, 150, 150, 0.9)',
    borderWidth: '1px',
    width: '80px',
    position: 'relative',
    clipPath: 'polygon(85% 0, 100% 50%, 85% 100%, 0% 100%, 15% 50%, 0% 0%)',
    marginX: '-5px',
    ...props.sx,
  }}>
    {props.label}
  </CenterFlex>
);

const Progression = (props: { color: string, label: string, phase: 0|1|2|3 }) => (
  <CenterFlex sx={{
    fontSize: '15px',
    height: '32px',
    flexDirection: 'row',
  }}>
    <Item color={props.color} label={props.label} stat={props.phase == 0} sx={{
      clipPath: 'polygon(85% 0, 100% 50%, 85% 100%, 10% 100%, 10% 0%)',
    }} />
    <Item color={props.color} label='加熱中' stat={props.phase == 1} />
    <Item color={props.color} label='料理済' stat={props.phase == 2} />
    <Item color={props.color} label='配膳済' stat={props.phase == 3} sx={{
        clipPath: 'polygon(90% 0, 90% 100%, 0% 100%, 15% 50%, 0% 0%)',
    }} />
  </CenterFlex>
);

export const StateDisplay = (props: {color: string, cooked: number, served: number , heating: boolean }) => {
  const { color, cooked, served, heating } = props;
  const phase_1 = served >= 1 ? 3 : cooked >= 1 ? 2 : heating ? 1 : 0;
  const phase_2 = served >= 2 ? 3 : cooked >= 2 ? 2 : heating && phase_1 >= 2 ? 1 : 0;
  const phase_3 = served >= 3 ? 3 : cooked >= 3 ? 2 : heating && phase_2 >= 2 ? 1 : 0;

  return <>
    <CenterFlex sx={{
      gap: '8px',
      opacity: '0.8',
    }}>
      <Progression label='食材①' color={color} phase={phase_1} />
      <Progression label='食材②' color={color} phase={phase_2} />
      <Progression label='食材③' color={color} phase={phase_3} />
    </CenterFlex>
  </>;
}
