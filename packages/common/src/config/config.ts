import type { ConfigType } from './types.js';

export default {
  contest_info: {
    name: '関東春ロボコン2026',
  },
  rule: {
    global_objects: [],
    task_objects: [
      {
        id: 'entered_notes_area',
        description: 'ノーツエリア進入',
        initialValue: 0,
        min: 0,
        max: 1,
      },
      {
        id: 'red_notes',
        description: '赤ノーツ',
        initialValue: 0,
        min: 0,
        max: 2,
      },
      {
        id: 'blue_notes',
        description: '青ノーツ',
        initialValue: 0,
        min: 0,
        max: 2,
      },
      {
        id: 'yellow_notes',
        description: '黄ノーツ',
        initialValue: 0,
        min: 0,
        max: 2,
      },
    ],
    score: {
      format: 'implement',
    },
    vgoal: {
      name: 'ファンファーレ',
      condition: {
        type: 'implement',
      },
    },
    control_panel: {
      type: 'custom',
      panels: [
        {
          id: 'entered_notes_area',
          type: 'toggle_switch',
          option: {
            off_value: 0,
            on_value: 1,
            off_label: '未進入',
            on_label: '進入(自動)',
          },
        },
        {
          id: 'red_notes',
          type: 'multi_button',
          option: {
            buttons: [
              {
                command: '=0',
                label: '0',
                style: {
                  variant: 'outlined',
                },
              },
              {
                command: '+1',
                label: '+1',
                shortcutKey: 'Q',
              },
              {
                command: '=2',
                label: '=2',
              },
            ],
          },
        },
        {
          id: 'blue_notes',
          type: 'multi_button',
          option: {
            buttons: [
              {
                command: '=0',
                label: '0',
                style: {
                  variant: 'outlined',
                },
              },
              {
                command: '+1',
                label: '+1',
                shortcutKey: 'W',
              },
              {
                command: '=2',
                label: '=2',
              },
            ],
          },
        },
        {
          id: 'yellow_notes',
          type: 'multi_button',
          option: {
            buttons: [
              {
                command: '=0',
                label: '0',
                style: {
                  variant: 'outlined',
                },
              },
              {
                command: '+1',
                label: '+1',
                shortcutKey: 'E',
              },
              {
                command: '=2',
                label: '=2',
              },
            ],
          },
        },
      ],
    },
  },
  time_progress: [
    {
      id: 'preparing',
      type: 'ready',
      description: '試合開始準備中',
      custom: [
        {
          elapsedTime: 0,
          displayText: '!!   !!',
        },
      ],
    },
    {
      id: 'setting_ready',
      type: 'ready',
      description: 'セッティングタイム',
    },
    {
      id: 'setting',
      type: 'count',
      duration: 60,
      description: 'セッティングタイム',
      style: {
        timerFormat: 'm:ss',
        timerType: 'countup',
      },
      custom: [
        {
          elapsedTime: 0,
          sound: 'tone_880hz_1000ms.mp3',
        },
        {
          elapsedTime: 60,
          sound: 'tone_880hz_1000ms.mp3',
        },
      ],
    },
    {
      id: 'match_ready',
      type: 'ready',
      description: '競技開始',
    },
    {
      id: 'match_countdown',
      type: 'count',
      duration: 5,
      description: '',
      isAutoTransition: true,
      style: {
        timerFormat: 's',
        timerType: 'countdown',
      },
      custom: [
        {
          elapsedTime: 1,
          sound: {
            name: 'tone_440hz_500ms.mp3',
            volume: 0.01,
          },
        },
        {
          elapsedTime: 2,
          sound: 'tone_440hz_500ms.mp3',
        },
        {
          elapsedTime: 3,
          sound: 'tone_440hz_500ms.mp3',
        },
        {
          elapsedTime: 4,
          sound: 'tone_440hz_500ms.mp3',
        },
      ],
    },
    {
      id: 'match',
      type: 'count',
      duration: 180,
      description: '競技中',
      style: {
        timerFormat: 'm:ss',
        timerType: 'countup',
      },
      custom: [
        {
          elapsedTime: 0,
          displayText: 'GO',
          sound: 'tone_880hz_1000ms.mp3',
        },
        {
          elapsedTime: 'L-4',
          sound: {
            name: 'tone_440hz_500ms.mp3',
            volume: 0.01,
          },
        },
        {
          elapsedTime: 'L-3',
          sound: 'tone_440hz_500ms.mp3',
        },
        {
          elapsedTime: 'L-2',
          sound: 'tone_440hz_500ms.mp3',
        },
        {
          elapsedTime: 'L-1',
          sound: 'tone_440hz_500ms.mp3',
        },
        {
          elapsedTime: 'L-0',
          sound: 'tone_880hz_1000ms.mp3',
        },
      ],
    },
    {
      id: 'match_finish',
      type: 'ready',
      description: '試合終了',
      custom: [
        {
          elapsedTime: 0,
          displayText: '--   --',
        },
      ],
    },
  ],
  teams_info: [],
  client: {
    standalone_mode: false,
  },
  option: {
    truncate_millisec_on_pause: true,
  },
} as ConfigType;
