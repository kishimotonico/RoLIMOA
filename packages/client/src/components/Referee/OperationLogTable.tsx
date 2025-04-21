import { unixToTimeWithMillis } from '@/util/formatTime';
import { Box } from '@mui/material';
import type { RootState } from '@rolimoa/common/redux';
import type { OperationLog } from '@rolimoa/common/redux';
import {
  type MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

type LogRow = {
  id: string;
  time: string;
  user: string;
  type: string;
  comment: string;
};

const logToComment = (log: OperationLog) => {
  if (log.op.type === 'ScoreUpdate') {
    const fieldName = {
      blue: '青の',
      red: '赤の',
      global: '',
    }[log.op.field];

    const command = log.op.cmd ? `（${log.op.cmd}）` : '';

    return `${fieldName}${log.op.obj}を${log.op.value}に更新${command}`;
  }
  if (log.op.type === 'PhaseChange') {
    const auto = log.op.isAuto ? '（自動）' : '';

    return `フェーズを${log.op.phase}に変更${auto}`;
  }
  return '';
};

export const OperationLogTable = () => {
  const operationLogs = useSelector<RootState, OperationLog[]>((state) => state.operationLogs);

  const data = useMemo(
    () =>
      operationLogs.map((log) => ({
        id: log.id,
        time: log.at ? unixToTimeWithMillis(log.at) : '',
        user: log.by ?? '',
        type: log.op.type,
        comment: logToComment(log),
      })),
    [operationLogs],
  );

  const columns = useMemo<MRT_ColumnDef<LogRow>[]>(
    () => [
      { header: '時刻', accessorKey: 'time', grow: false },
      { header: '種別', accessorKey: 'type', grow: false },
      { header: '内容', accessorKey: 'comment', grow: true },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    layoutMode: 'grid',
    initialState: {
      density: 'compact',
      pagination: {
        pageSize: 20,
        pageIndex: 0,
      },
      sorting: [{ id: 'time', desc: true }],
    },
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};
