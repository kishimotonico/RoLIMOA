import React, { FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './features';
import { teamsStateSlice } from './features/teams';
import { phaseStateSlice } from './features/phase';
import { LyricalSocket } from './lyricalSocket';
import { MatchMasterComponent } from './MatchMasterComponent';
import * as Phase from "./util/PhaseStateUtil";
import config from './config.json';

export const MatchMasterContainer: FC = () => {
  const teamList = config.teams_info.map(info => info.short);
  const currentPhaseId = useSelector<RootState, string>((state) => state.phase.id);
  const [blueTeamName, setBlueTeamName] = useState("");
  const [redTeamName, setRedTeamName] = useState("");
  const onChangeBlueTeamName = useCallback((_, name) => {
    setBlueTeamName(name);
  }, []);
  const onChangeRedTeamName = useCallback((_, name) => {
    setRedTeamName(name);
  }, []);

  const onSubmitButton = useCallback((event) => {
    const socket = LyricalSocket.instance.socket;
    // チーム情報の更新
    socket.emit("dispatch", teamsStateSlice.actions.setCurrent({
      blue: blueTeamName,
      red: redTeamName,
    }));
    // フェーズ遷移
    socket.emit("dispatch", phaseStateSlice.actions.setCurrent({
      id: Phase.getFirstPhase(),
      startTime: Date.now(),
    }));
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
