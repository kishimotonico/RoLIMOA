import { FC, Ref, SVGProps } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { FieldSideType, ObjectsStateType } from '@/slices/score';
import { Avatar, Box, Divider, Slide, Stack, SxProps } from '@mui/material';
import { Theme } from '@emotion/react';
import { useDisplayScore } from '@/functional/useDisplayScore';
import { useDisplayTimer } from '@/functional/useDisplayTimer';
import { useSearchParams } from 'react-router-dom';
import { CenterFlex } from '@/ui/CenterFlex';
import { formatTime } from '@/util/formatTime';
import { config } from '@/config/load';
import { SlideTransition } from '@/ui/SlideTransition';
import { useCurrentMatchState } from '@/functional/useCurrentMatchState';
import TimerIcon from '@mui/icons-material/Timer';

const StateDisplay = (props: {
  fieldSide: FieldSideType,
  placement: "left" | "right",
  honneyKuma: number,
  beehiveKuma: number,
  honneyBarrel: number,
  beehiveBarrel: number,
}) => {
  const color = props.fieldSide === "blue"
    ? (opacity = 0.95) => `rgba(0, 0, 240, ${opacity})`
    : (opacity = 0.95) => `rgba(240, 0, 0, ${opacity})`;

  const honneies = Array.from({ length: 4 }, (_, i) => i);
  const beehives = Array.from({ length: 4 }, (_, i) => i);

  console.log(`${props.fieldSide}`, honneies, beehives);

  const sxProps: SxProps<Theme> = {
    width: "240px",
    height: "60px",
    flexDirection: props.placement === "left" ? "row" : "row-reverse",
    justifyContent: "flex-start",
    gap: "10px",
  };

  return (
    <CenterFlex>
      <CenterFlex sx={sxProps}>
        {honneies.map((i) => (
          i < props.honneyBarrel ? <BeehiveIcon style={{ width: "45px", fill: color(), stroke: "#fff" }} /> :
          i < props.honneyKuma ? <BeehiveIcon style={{ width: "45px", fill: color(0.2) }} /> :
          <BeehiveIcon style={{ width: "45px", fill: "rgba(64, 64, 64, 0.2)" }} />
        ))}
      </CenterFlex>
      <CenterFlex sx={sxProps}>
        {beehives.map((i) => (
          i < props.beehiveBarrel ? <HonneyIcon style={{ width: "45px", fill: color(), stroke: "#fff" }} /> :
          i < props.beehiveKuma ? <HonneyIcon style={{ width: "45px", fill: color(0.2) }} /> :
          <HonneyIcon style={{ width: "45px", fill: "rgba(64, 64, 64, 0.2)" }} />
        ))}
      </CenterFlex>
    </CenterFlex>
  )
}

type ScoreBlockProps = {
  fieldSide: FieldSideType,
  placement: "left" | "right",
};

const ScoreBlock = ({
  fieldSide,
  placement,
}: ScoreBlockProps) => {
  const teamName = useSelector<RootState, string | undefined>((state) => state.match.teams[fieldSide]?.shortName);
  const displayScore = useDisplayScore(fieldSide);
  const { taskObjects } = useCurrentMatchState(fieldSide);

  const color = fieldSide == "blue" ? "rgba(0, 0, 240, 0.8)" : "rgba(240, 0, 0, 0.8)";

  const containerHeight = 260;
  const outlineBorderWidth = 0;
  const innerBorderWidth = 6;
  const nameBlockHeight = 60;
  const scoreBlockHeight = 16 + containerHeight - nameBlockHeight - outlineBorderWidth * 2 - innerBorderWidth; // 文字を下に下げるため微調整
  const teamNameFontSize = 30;

  return (
    <Box>
      <Box sx={{
        width: '600px',
        height: `${containerHeight}px`,
        textAlign: 'center',
        border: `${outlineBorderWidth}px solid`,
        borderColor: color,
        boxSizing: 'border-box',
        backgroundColor: 'rgba(240, 240, 240, 0.8)',
        clipPath: 'polygon(0 0, 0 100%, 30% 100%, 50% 190px, 100% 190px, 100% 0)',
        transform: placement === "left" ? '' : 'scaleX(-1)',
      }}>
        <Box sx={{
          height: `${nameBlockHeight - 5}px`, // ちょっと調整
          lineHeight: `${nameBlockHeight}px`,
          backgroundColor: color,
          fontSize: `${teamNameFontSize}px`,
          color: "rgba(255, 255, 255, 0.9)",
          transform: placement === "left" ? '' : 'scaleX(-1)',
        }}>
          {teamName ?? " "}
        </Box>
        <Box sx={{
          height: `${scoreBlockHeight}px`,
          fontSize: '100px',
          flexDirection: placement === "left" ? 'row' : 'row-reverse',
          display: 'flex',
          transform: placement === "left" ? '' : 'scaleX(-1)',
        }}>
          {/* 点数表示 */}
          <CenterFlex sx={{
            width: '280px',
           }}>
            {displayScore.scoreState.vgoal ? (
              <Box sx={{ fontSize: "48px", pb: 3 }}>
                <Box>
                  {config.rule.vgoal.name}
                </Box>
                <CenterFlex sx={{ fontSize: "32px", flexDirection: "row", color: "rgba(30, 30, 30, 0.9)" }}>
                  {displayScore.value}
                  &nbsp;/&nbsp;
                  <TimerIcon sx={{ mr: 1 }} />{formatTime(displayScore.scoreState.vgoal, "m:ss")}
                </CenterFlex>
              </Box>
            ) : (
              <CenterFlex sx={{ fontSize: '90px', lineHeight: `${scoreBlockHeight}px` }}>
                {displayScore.value}
              </CenterFlex>
            )}
          </CenterFlex>
          {/* 詳細表示 */}
          <Box sx={{ 
            width: '300px',
            height: '130px',
            padding: placement === "left" ? '0 0 0 20px' : '0 20px 0 0',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <StateDisplay
              fieldSide={fieldSide}
              placement={placement}
              honneyKuma={taskObjects.honney_kuma}
              beehiveKuma={taskObjects.beehive_kuma}
              honneyBarrel={taskObjects.honney_barrel}
              beehiveBarrel={taskObjects.beehive_barrel}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{
        display: "flex",
        justifyContent: placement === "left" ? "flex-start" : "flex-end",
        position: "relative",
        width: '420px',
        top: "-70px",
        left: placement === "left" ? "180px" : "0",
        clipPath: placement === "left" ? 'polygon(0 100%, 71% 100%, 100% 0, 29% 0)'
                                      : 'polygon(0 0, 29% 100%, 100% 100%, 71% 0)',
      }}>
        {displayScore.scoreState.winner && 
          <CenterFlex sx={{
            height: "70px",
            width: '420px',
            backgroundColor: `${color}`,
            fontSize: "42px",
            color: "rgba(255, 255, 255, 0.95)",
          }}>
            Winner
          </CenterFlex>
        }
      </Box>
    </Box>
  );
};

const TimerDisplay: FC<{ ref?: Ref<null> }> = ({ ref }) => {
  const { description, displayTime } = useDisplayTimer();
  const matchName = useSelector<RootState, string>((state) => state.match.name);

  return <>
    <Box ref={ref} sx={{
      width: '400px',
      height: '190px',
      textAlign: 'center',
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      boxSizing: 'border-box',
      color: 'rgba(240, 240, 240, 0.95)',
      zIndex: 10,
    }}>
      <Box sx={{
        height: '50px',
        lineHeight: '50px',
        fontSize: '20px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        {description}
      </Box>
      <Box sx={{
        fontFamily: "DSEG14-Classic",
        fontWeight: 500,
        height: '90px',
        lineHeight: '90px',
        fontSize: '60px',
      }}>
        {displayTime}
      </Box>
      <Divider sx={{
        margin: '0 30px',
        borderColor: 'rgba(240, 240, 240, 0.5)',
      }}/>
      <Box sx={{
        height: '50px',
        lineHeight: '50px',
        fontSize: '20px',
      }}>
        {matchName ?? ""}
      </Box>
    </Box>
  </>;
};

const SubHudDisplay = () => {
  return (
    <Box>
    </Box>
  );
};

export type StreamingOverlayPageParams = {
  reverse: boolean,
};

export const StreamingOverlayPage: FC = () => {
  const [searchParams] = useSearchParams();
  const params: StreamingOverlayPageParams = {
    reverse: searchParams.get("reverse") !== null,
  };

  const showMainHud = useSelector<RootState, boolean>((state) => state.streamingInterface.showMainHud);
  const showScoreBoard = useSelector<RootState, boolean>((state) => state.streamingInterface.showScoreBoard);
  const showSubHud = false; // サブHUD未実装？

  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '1600px',
      height: '900px',
      backgroundColor: 'rgba(255, 255, 255, 0)',
    }}>
      <Slide in={showMainHud} direction="down" timeout={1000} appear={false}>
        <Box sx={{
          width: '100%',
          height: '320px',
          display: 'flex',
        }}>
          <SlideTransition in={showScoreBoard} direction="left" duration={800} appear={false}>
            <Box>
              <ScoreBlock
                fieldSide={ params.reverse ? "blue" : "red" }
                placement="left"
              />
            </Box>
          </SlideTransition>
          <TimerDisplay />
          <SlideTransition in={showScoreBoard} direction="right" duration={800} appear={false}>
            <Box>
              <ScoreBlock
                fieldSide={ params.reverse ? "red" : "blue" }
                placement="right"
              />
            </Box>
          </SlideTransition>
        </Box>
      </Slide>
      <Box sx={{
        width: '100%',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <Slide in={showSubHud} direction="left" timeout={800} appear={false}>
          <Box sx={{ width: '160px' }}>
            <SubHudDisplay />
          </Box>
        </Slide>
      </Box>
    </Box>
  );
}

const HonneyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" {...props}>
    <g>
      <path d="M135.277,110.802h44.08c0,0-3.42-31.918-35.338-75.233c-9.283-12.594-42.167-46.725-66.108-31.91
        c-12.536,7.762-10.881,31.494,3.418,41.027C108.691,62.929,132.623,89.141,135.277,110.802"></path>
      <path d="M395.769,191.077c0.516-7.802,4.409-12.611,9.183-15.564c8.469-5.24,12.728-3.003,12.728-3.003
        c4.076-0.965,6.954-4.608,6.954-8.801v-22.394c0-10-8.102-18.101-18.101-18.101h-56.895v124.712
        c0,12.976-10.523,23.508-23.508,23.508c-12.994,0-23.516-10.532-23.516-23.508v-55.61c0-11.189-9.075-20.264-20.264-20.264
        c-11.189,0-20.272,9.075-20.272,20.264v12.976c0,11.189-9.075,20.264-20.273,20.264c-11.188,0-20.264-9.076-20.264-20.264v-82.079
        H119.33c-9.991,0-18.093,8.102-18.093,18.101v22.31c0,4.234,2.936,7.895,7.062,8.826c0,0,3.652-2.154,12.045,2.712
        c5.032,2.92,9.225,7.794,9.775,15.914c1.439,21.612-50.893,77.654-46.501,155.275C88.178,426.893,139.844,512,262.943,512
        c123.093,0,174.752-85.107,179.327-165.648C446.662,268.731,394.322,212.689,395.769,191.077z M325.889,341.627
        c-11.763,0-21.296-9.533-21.296-21.296c0-11.763,9.533-21.296,21.296-21.296c11.763,0,21.296,9.533,21.296,21.296
        C347.184,332.094,337.652,341.627,325.889,341.627z"></path>
    </g>
</svg>
)

const BeehiveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" {...props}>
    <g>
      <polygon points="224.6,123.921 224.6,75.142 182.356,50.748 140.112,75.142 140.112,123.921 182.356,148.315"></polygon>
      <polygon points="371.892,75.142 329.644,50.748 287.4,75.142 287.4,123.921 329.644,148.315 371.892,123.921"></polygon>
      <polygon points="150.959,202.694 108.714,178.308 66.465,202.694 66.465,251.472 108.714,275.866 150.959,251.472"></polygon>
      <polygon points="213.753,202.694 213.753,251.472 256.002,275.866 298.247,251.472 298.247,202.694 256.002,178.308 	"></polygon>
      <polygon points="361.041,202.694 361.041,251.472 403.286,275.866 445.535,251.472 445.535,202.694 403.286,178.308"></polygon>
      <path d="M371.892,379.032v-48.779l-42.248-24.394L287.4,330.253v48.779l39.166,22.607
        c-9.626,11.092-37.658,50.316-37.658,69.55c0,22.542,18.271,40.811,40.807,40.811c22.541,0,40.811-18.27,40.811-40.811
        c0-19.267-28.124-58.583-37.708-69.6L371.892,379.032z"></path>
      <polygon points="140.112,330.253 140.112,379.032 182.356,403.417 224.6,379.032 224.6,330.253 182.356,305.859 	"></polygon>
      <path d="M415.844,134.805V49.76L329.644,0l-73.642,42.514L182.356,0L96.155,49.76v7.253v77.792l-73.642,42.514v7.254
        v92.282l73.642,42.514v85.037l86.201,49.767l73.646-42.514l30.717,17.73c2.16-3.764,4.623-7.819,7.46-12.205
        c2.16-3.34,4.126-6.273,5.999-9.015l-31.622-18.262v-70.538l61.088-35.27l61.088,35.27v70.538l-31.518,18.196
        c1.886,2.758,3.864,5.716,6.04,9.082c2.817,4.362,5.276,8.4,7.428,12.139l43.162-24.918v-85.037l73.642-42.514v-99.536
        L415.844,134.805z M121.268,64.266l61.088-35.277l61.088,35.277v70.54l-30.542,17.63l-30.546,17.631l-30.542-17.631l-30.546-17.63
        V64.266z M47.622,262.357v-70.54l61.092-35.269l61.088,35.269v70.54l-30.546,17.63l-30.542,17.639L47.622,262.357z
        M243.444,389.907l-61.088,35.269l-61.088-35.269v-70.538l61.088-35.27l61.088,35.27V389.907z M317.09,262.357l-30.546,17.63
        l-30.542,17.639l-30.546-17.639l-30.546-17.63v-70.54l61.092-35.269l61.088,35.269V262.357z M299.098,152.435l-30.542-17.63v-70.54
        l61.088-35.277l61.088,35.277v70.54l-30.547,17.63l-30.541,17.631L299.098,152.435z M464.378,262.357l-61.092,35.269
        l-30.542-17.639l-30.546-17.63v-70.54l61.088-35.269l61.092,35.269V262.357z"></path>
    </g>
  </svg>
);
