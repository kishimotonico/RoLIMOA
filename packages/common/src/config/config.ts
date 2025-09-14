import type { ConfigType } from './types.js';

export default {
  contest_info: {
    name: '関東夏ロボコン2023',
  },
  rule: {
    global_objects: [],
    task_objects: [
      {
        id: 'A_robot_moved',
        description: 'A.ロボット移動',
        initialValue: 0,
        min: 0,
        max: 1,
      },
      // カブトムシの状態（1個）
      {
        id: 'B_beetle_touched',
        description: 'B.カブトムシ接地',
        initialValue: 0,
        min: 0,
        max: 1,
      },
      {
        id: 'C_beetle_display',
        description: 'C.カブトムシ展示',
        initialValue: 0,
        min: 0,
        max: 1,
      },
      // クワガタの状態（6個まで）
      {
        id: 'D_stag_museum',
        description: 'D.クワガタ博物館',
        initialValue: 0,
        min: 0,
        max: 6,
      },
      {
        id: 'E_stag_display',
        description: 'E.クワガタ展示',
        initialValue: 0,
        min: 0,
        max: 6,
      },
      // 違反・リトライ
      {
        id: 'violation',
        description: '違反回数',
        initialValue: 0,
        min: 0,
      },
    ],
    score: {
      format: 'simple',
      expression: [
        {
          id: 'A_robot_moved',
          coefficient: 3,
        },
        {
          id: 'B_beetle_touched',
          coefficient: 40,
        },
        {
          id: 'C_beetle_display',
          coefficient: 100,
        },
        {
          id: 'D_stag_museum',
          coefficient: 50,
        },
        {
          id: 'E_stag_display',
          coefficient: 75,
        },
      ],
    },
    vgoal: {
      name: '昆虫図鑑完成',
      condition: {
        type: 'alwaysOk',
      },
    },
    control_panel: {
      type: 'custom',
      panels: [
        {
          id: 'A_robot_moved',
          type: 'toggle_switch',
          option: {
            off_value: 0,
            on_value: 1,
          },
        },
        {
          id: 'B_beetle_touched',
          type: 'toggle_switch',
          option: {
            off_value: 0,
            on_value: 1,
          },
        },
        {
          id: 'C_beetle_display',
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
                command: '=1',
                label: '1',
              },
            ],
          },
        },
        {
          id: 'D_stag_museum',
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
              {
                command: '+2',
                label: '+2',
              },
            ],
          },
        },
        {
          id: 'E_stag_display',
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
              {
                command: '+2',
                label: '+2',
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
          elapsedTime: 59,
          sound: {
            volume: 0.01,
            name: 'tone_880hz_1000ms.mp3',
          },
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
          // 1音目のラグ対策のため、小さい音を鳴らす
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
          // 1音目のラグ対策のため、小さい音を鳴らす
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
  teams_info: [
    {
      id: '1',
      name: 'Technologier',
      school: '東京都立大学',
      short: 'Technologier（都立大）',
    },
    {
      id: '2',
      name: '情メカ',
      school: '群馬大学',
      short: '情メカ（群馬大）',
    },
    {
      id: '3',
      name: 'おいでよ！常盤の森',
      school: '横浜国立大学',
      short: 'おいでよ！常盤の森（横国）',
    },
    {
      id: '4',
      name: 'とびだせ ! 常盤の森',
      school: '横浜国立大学',
      short: 'とびだせ ! 常盤の森（横国）',
    },
    {
      id: '5',
      name: 'あつまれ！常盤の森',
      school: '横浜国立大学',
      short: 'あつまれ！常盤の森（横国）',
    },
    {
      id: '6',
      name: 'Ti-Robot',
      school: '豊田工業大学',
      short: 'Ti-Robot（豊田工大）',
    },
    {
      id: '7',
      name: 'Maqui',
      school: '東京科学大学',
      short: 'Maqui（東京科大）',
    },
    {
      id: '8',
      name: 'Nista',
      school: '東京科学大学',
      short: 'Nista（東京科大）',
    },
    {
      id: '9',
      name: 'つくばろぼっとサークル',
      school: '筑波大学',
      short: 'つくばろぼっとサークル（筑波大）',
    },
    {
      id: '10',
      name: '野沢菜☆サイボーグ',
      school: '信州大学',
      short: '野沢菜☆サイボーグ（信州大）',
    },
    {
      id: '11',
      name: '群情',
      school: '群馬大学',
      short: '群情（群馬大）',
    },
    {
      id: '12',
      name: '信州の夏休み',
      school: '信州大学',
      short: '信州の夏休み（信州大）',
    },
    {
      id: '13',
      name: "HAMTAN'S",
      school: '東京工科大学',
      short: "HAMTAN'S（東京工科）",
    },
    {
      id: '14',
      name: 'Bee取る`s',
      school: '東京工科大学',
      short: 'Bee取る`s（東京工科）',
    },
    {
      id: '15',
      name: 'Ai-Robot',
      school: '豊田工業大学',
      short: 'Ai-Robot（豊田工大）',
    },
    {
      id: '16',
      name: '小金井ビートルズ',
      school: '東京農工大学',
      short: '小金井ビートルズ（東京農工）',
    },
    {
      id: '17',
      name: '昆虫ハンター ヒガコ',
      school: '東京農工大学',
      short: '昆虫ハンター ヒガコ（東京農工）',
    },
  ],
  client: {
    standalone_mode: false,
  },
  option: {
    truncate_millisec_on_pause: true,
  },
} as ConfigType;
