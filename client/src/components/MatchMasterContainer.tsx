import React, { FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { TeamType, matchStateSlice } from 'slices/match';
import { phaseStateSlice } from 'slices/phase';
import { initialState as scoreInitialState, scoreStateSlice } from 'slices/score';
import { LyricalSocket } from 'lyricalSocket';
import { MatchMasterComponent } from './MatchMasterComponent';
import * as Phase from 'util/PhaseStateUtil';
import config from 'config.json';

// 省略名からチームリストの情報を取得、なければスタブを作成
function getTeamInfo(short: string): TeamType {
  const team = config.teams_info.find(team => team.short === short);
  return {
    shortName: short,
    ...team,
  };
}

export const MatchMasterContainer: FC = () => {
  const teamList = config.teams_info.map(info => info.short);
  const currentPhaseId = useSelector<RootState, string>((state) => state.phase.current.id);
  const [blueTeamName, setBlueTeamName] = useState("");
  const [redTeamName, setRedTeamName] = useState("");

  const onChangeBlueTeamName = useCallback((_, name) => {
    setBlueTeamName(name);
  }, []);
  const onChangeRedTeamName = useCallback((_, name) => {
    setRedTeamName(name);
  }, []);

  const onSubmitButton = useCallback((event) => {
    LyricalSocket.dispatchAll([
      // スコアの初期化
      scoreStateSlice.actions.setState(scoreInitialState),
      // チーム情報の更新
      matchStateSlice.actions.setState({
        name: "name", // TODO: to be implemented
        teams: {
          blue: getTeamInfo(blueTeamName),
          red: getTeamInfo(redTeamName),
        },
      }),
      // フェーズ遷移
      phaseStateSlice.actions.setState({
        id: Phase.getFirstPhase(),
        startTime: Date.now(),
      }),
    ]);
  }, [blueTeamName, redTeamName]);

  return (
    <MatchMasterComponent
      teamOptions={teamList}
      onChangeBlueTeamName={onChangeBlueTeamName}
      onChangeRedTeamName={onChangeRedTeamName}
      onStartButton={onSubmitButton}
      isEnabledStartButton={Phase.isLast(currentPhaseId)}
    />
  );
}
