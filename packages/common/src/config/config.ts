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
  teams_info: [
    { id: '1', name: 'Maquinista', school: '東京科学大学', short: 'Maquinista（東京科学大）' },
    { id: '2', name: 'パッパカ響動隊', school: '千葉工業大学', short: 'パッパカ響動隊（千葉工大）' },
    { id: '3', name: 'オムオムΩ', school: '早稲田大学', short: 'オムオムΩ（早稲田大）' },
    { id: '5', name: '威風堂々', school: '早稲田大学', short: '威風堂々（早稲田大）' },
    { id: '6', name: '独STEP', school: '早稲田大学', short: '独STEP（早稲田大）' },
    { id: '7', name: '過デンリュウ', school: '工学院大学', short: '過デンリュウ（工学院大）' },
    { id: '8', name: '横浜狂詩曲', school: '横浜国立大学', short: '横浜狂詩曲（横浜国大）' },
    { id: '9', name: 'Ti-Robot', school: '豊田工業大学', short: 'Ti-Robot（豊田工大）' },
    { id: '10', name: 'The Canon', school: '東京大学', short: 'The Canon（東京大）' },
    { id: '11', name: 'spArc', school: '東京大学', short: 'spArc（東京大）' },
    { id: '12', name: 'プロジェクトキカイ', school: '電気通信大学', short: 'プロジェクトキカイ（電通大）' },
    { id: '13', name: 'ラリルレ☆ロボコンズ', school: '豊橋技術科学大学', short: 'ラリルレ☆ロボコンズ（豊橋技科大）' },
    { id: '14', name: '科学技術研究部', school: '新潟大学', short: '科学技術研究部（新潟大）' },
    { id: '15', name: '牛乳プリン', school: '東京工科大学', short: '牛乳プリン（工科大）' },
    { id: '16', name: 'conductor', school: '千葉大学', short: 'conductor（千葉大）' },
    { id: '17', name: 'とよたし♡ロボコンブ', school: '豊田工業高等専門学校', short: 'とよたし♡ロボコンブ（豊田高専）' },
    { id: '18', name: '情メカ', school: '群馬大学', short: '情メカ（群馬大）' },
    { id: '19', name: 'marc.h', school: '明治大学', short: 'marc.h（明治大）' },
    { id: '20', name: '藤原こうふ店', school: '慶應義塾大学', short: '藤原こうふ店（慶應大）' },
    { id: '21', name: '三飾団子', school: '千葉工業大学', short: '三飾団子（千葉工大）' },
  ],
  client: {
    standalone_mode: false,
  },
  option: {
    truncate_millisec_on_pause: true,
  },
} as ConfigType;
