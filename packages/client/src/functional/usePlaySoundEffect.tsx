import config from '@rolimoa/common/config';
import { Phase, createTimeConfigMatcher } from '@rolimoa/common/config/helper';
import type { MatchConfigOveridesType, RootState } from '@rolimoa/common/redux';
import type { PhaseState } from '@rolimoa/common/redux';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const parseSound = (sound: string | { name: string; volume?: number }) => {
  if (typeof sound === 'string') {
    return { name: sound, volume: undefined };
  }
  return { name: sound.name, volume: sound.volume };
};

// 全ての効果音ファイル名を取得
const soundNames = config.time_progress
  .flatMap((tp) => tp.custom?.map((cus) => cus.sound))
  .map((sound) => sound && parseSound(sound).name)
  .filter((s): s is string => s !== undefined)
  .filter((s, i, arr) => arr.indexOf(s) === i);

type SoundCache = {
  [url: string]: AudioBuffer | null;
};

// 手動で効果音を再生するためのHook
export const usePlaySoundEffect = () => {
  const [volume, setVolume] = useState<number>(0.5); // デフォルト音量は0.5（50%）
  const [isPreloaded, setIsPreloaded] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const soundCacheRef = useRef<SoundCache>({});

  // AudioContextの初期化を確実に行う関数
  const ensureAudioContext = useCallback(async () => {
    // AudioContextが存在しない場合は作成
    if (!audioContextRef.current) {
      console.log('Creating new AudioContext');
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // GainNodeを作成し、出力に接続
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      gainNode.connect(audioContext.destination);
      gainNodeRef.current = gainNode;
    }

    // AudioContextが suspended 状態なら再開
    if (audioContextRef.current.state === 'suspended') {
      console.log('Resuming suspended AudioContext');
      await audioContextRef.current.resume();
    }

    // 閉じられていたら新しく作り直す
    if (audioContextRef.current.state === 'closed') {
      console.log('AudioContext was closed, creating a new one');
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // GainNodeを作成し、出力に接続
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      gainNode.connect(audioContext.destination);
      gainNodeRef.current = gainNode;
    }

    return audioContextRef.current;
  }, [volume]);

  // AudioContextを再開する関数（ユーザーインタラクション時に呼び出す）
  const resumeAudioContext = useCallback(async () => {
    try {
      await ensureAudioContext();
      console.log('AudioContext state:', audioContextRef.current?.state);
    } catch (error) {
      console.error('Failed to resume AudioContext:', error);
    }
  }, [ensureAudioContext]);

  // 音量が変更された際にGainNodeの値を更新
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // サウンドファイルをロードする関数
  const loadSound = useCallback(
    async (soundUrl: string): Promise<AudioBuffer | null> => {
      try {
        // キャッシュにあればそれを返す
        if (soundCacheRef.current[soundUrl]) {
          return soundCacheRef.current[soundUrl];
        }

        // AudioContextを確保
        const audioContext = await ensureAudioContext();

        // ファイルを取得
        const response = await fetch(soundUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${soundUrl}: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        // デコード
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // キャッシュに保存
        soundCacheRef.current[soundUrl] = audioBuffer;

        return audioBuffer;
      } catch (error) {
        console.error(`Failed to load sound: ${soundUrl}`, error);
        return null;
      }
    },
    [ensureAudioContext],
  );

  // 効果音を再生する関数
  const playSound = useCallback(
    async (soundUrl: string, soundVolume?: number) => {
      try {
        // AudioContextを確保
        const audioContext = await ensureAudioContext();
        if (!gainNodeRef.current) {
          console.error('GainNode is not initialized');
          return;
        }

        // キャッシュから取得するか、新たにロード
        let audioBuffer = soundCacheRef.current[soundUrl];
        if (!audioBuffer) {
          audioBuffer = await loadSound(soundUrl);
          if (!audioBuffer) return; // ロード失敗
        }

        // 再生用のソースノードを作成
        const sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;

        if (soundVolume !== undefined) {
          // soundVolumeが指定されている場合：個別の音量調整ノードを作成
          const volumeGainNode = audioContext.createGain();
          volumeGainNode.gain.value = soundVolume;

          // ソースノード → 音量調整ノード → メインGainNode の順で接続
          sourceNode.connect(volumeGainNode);
          volumeGainNode.connect(gainNodeRef.current);

          console.debug(`Playing sound: ${soundUrl} at config volume: ${soundVolume}`);
        } else {
          // soundVolumeが未指定の場合：直接メインGainNodeに接続（スライダー音量を使用）
          sourceNode.connect(gainNodeRef.current);

          console.debug(`Playing sound: ${soundUrl} at slider volume: ${volume}`);
        }

        sourceNode.onended = () => console.debug(`Sound ended: ${soundUrl}`);

        // 再生開始
        sourceNode.start();
      } catch (error) {
        console.error('Sound playback failed:', error);
      }
    },
    [ensureAudioContext, loadSound, volume],
  );

  // 全てのサウンドファイルを事前にロードする関数
  const preloadSounds = useCallback(async () => {
    // 既にロード済みの場合は何もしない
    if (isPreloaded) {
      return;
    }

    try {
      // AudioContextを確保（ユーザーインタラクションが必要）
      await resumeAudioContext();

      console.log(`Preloading ${soundNames.length} sounds...`);

      // 全てのサウンドを並行してロード
      const loadPromises = soundNames.map((soundUrl) => loadSound(soundUrl));
      await Promise.all(loadPromises);

      console.log('All sounds preloaded successfully');
      setIsPreloaded(true);
    } catch (error) {
      console.error('Failed to preload sounds:', error);
    }
  }, [loadSound, isPreloaded, resumeAudioContext]);

  // コンポーネントのアンマウント時に片付け
  useEffect(() => {
    return () => {
      // 片付け時にはAudioContextをクローズしない（効果音が途切れる可能性があるため）
      // 代わりにsuspendを使用
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.suspend().catch(console.error);
      }
    };
  }, []);

  // 音量調整、事前読み込み、効果音再生関数を公開
  return {
    volume,
    setVolume,
    preloadSounds,
    isPreloaded,
    resumeAudioContext,
    playSound,
  };
};

// 自動で効果音を鳴らすためのHook
export const useAutoPlaySoundEffect = () => {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const matchOverrides = useSelector<RootState, MatchConfigOveridesType>(
    (state) => state.match.configOverrides,
  );
  
  const { playSound, resumeAudioContext } = usePlaySoundEffect();

  // フェーズの経過時間に基づいて効果音を自動再生
  useEffect(() => {
    const phaseConfig = Phase.getConfig(phaseState.current.id, matchOverrides);
    const elapsedSec = phaseState.elapsedSecond;

    const matched = phaseConfig.custom?.find(
      createTimeConfigMatcher(elapsedSec, phaseConfig.duration),
    );

    if (!matched?.sound) {
      return;
    }
    const { name: soundName, volume: soundVolume } = parseSound(matched.sound);

    // AudioContextが作成されていない可能性があるので、ここで再生するときに処理
    // この関数はuseEffect内なのでasyncは使えないためPromiseで処理
    resumeAudioContext()
      .then(() => {
        playSound(soundName, soundVolume);
      })
      .catch((error) => console.error('Failed to play sound:', error));
  }, [phaseState, matchOverrides, playSound, resumeAudioContext]);
};
