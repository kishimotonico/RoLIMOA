import type { ConfigType } from './types.js';

export default {
  contest_info: {
    name: '関東夏ロボコン2023',
  },
  rule: {
    global_objects: [],
    task_objects: [
      {
        id: 'Utsunomiya',
        description: '宇都宮',
        initialValue: 0,
        min: 0,
        max: 1,
      },
      {
        id: 'Chiba',
        description: '千葉',
        initialValue: 0,
      },
      {
        id: 'Saitama',
        description: 'さいたま',
        initialValue: 0,
      },
      {
        id: 'Yokohama',
        description: '横浜',
        initialValue: 0,
      },
      {
        id: 'Shibuya',
        description: '渋谷',
        initialValue: 0,
      },
      {
        id: 'violation',
        description: '違反回数',
        initialValue: 0,
      },
    ],
    score: {
      format: 'simple',
      expression: [
        {
          id: 'Utsunomiya',
          coefficient: 10,
        },
        {
          id: 'Chiba',
          coefficient: 10,
        },
        {
          id: 'Saitama',
          coefficient: 11,
        },
        {
          id: 'Yokohama',
          coefficient: 14,
        },
        {
          id: 'Shibuya',
          coefficient: 15,
        },
      ],
    },
    vgoal: {
      name: 'Vゴール',
      condition: {
        type: 'disabled',
      },
    },
    control_panel: {
      type: 'custom',
      panels: [
        {
          id: 'Utsunomiya',
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
              },
            ],
          },
        },
        {
          id: 'Chiba',
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
                command: '-1',
                label: '-1',
                style: {
                  variant: 'outlined',
                },
              },
              {
                command: '+1',
                label: '+1',
              },
              {
                command: '+2',
                label: '+2',
              },
              {
                command: '+4',
                label: '+4',
              },
            ],
          },
        },
        {
          id: 'Saitama',
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
                command: '-1',
                label: '-1',
                style: {
                  variant: 'outlined',
                },
              },
              {
                command: '+1',
                label: '+1',
              },
              {
                command: '+2',
                label: '+2',
              },
              {
                command: '+4',
                label: '+4',
              },
            ],
          },
        },
        {
          id: 'Yokohama',
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
                command: '-1',
                label: '-1',
                style: {
                  variant: 'outlined',
                },
              },
              {
                command: '+1',
                label: '+1',
              },
              {
                command: '+2',
                label: '+2',
              },
              {
                command: '+4',
                label: '+4',
              },
            ],
          },
        },
        {
          id: 'Shibuya',
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
                command: '-1',
                label: '-1',
                style: {
                  variant: 'outlined',
                },
              },
              {
                command: '+1',
                label: '+1',
              },
              {
                command: '+2',
                label: '+2',
              },
              {
                command: '+4',
                label: '+4',
              },
            ],
          },
        },
        {
          id: 'violation',
          type: 'multi_button',
          option: {
            buttons: [
              {
                command: '-1',
                label: '-1',
                style: {
                  variant: 'outlined',
                },
              },
              {
                command: '+1',
                label: '+1',
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
      time: 60,
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
      time: 5,
      description: '',
      isAutoTransition: true,
      style: {
        timerFormat: 's',
        timerType: 'countdown',
      },
      custom: [
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
      time: 180,
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
          elapsedTime: 177,
          sound: 'tone_440hz_500ms.mp3',
        },
        {
          elapsedTime: 178,
          sound: 'tone_440hz_500ms.mp3',
        },
        {
          elapsedTime: 179,
          sound: 'tone_440hz_500ms.mp3',
        },
        {
          elapsedTime: 180,
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
  teams_info: [
    {
      id: '1',
      name: '触手もぐもぐ',
      school: '国際信州大',
      short: '触手もぐもぐ（国際信州大）',
    },
    {
      id: '2',
      name: '白米ぬるぬる',
      school: '国際信州大',
      short: '白米ぬるぬる（国際信州大）',
    },
    {
      id: '3',
      name: '常磐の森ねこねこカレッジ',
      school: '横浜大学',
      short: '常磐の森ねこねこカレッジ（横浜大）',
    },
  ],
  client: {
    standalone_mode: false,
  },
} as ConfigType;
