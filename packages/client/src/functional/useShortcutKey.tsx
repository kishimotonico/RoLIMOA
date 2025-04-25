import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

// ショートカットキーのコンテキストの型
interface ShortcutContextType {
  registerShortcut: (key: string, callback: () => void) => () => void;
  unregisterShortcut: (key: string) => void;
}

// デフォルト値を持つコンテキスト
const ShortcutContext = createContext<ShortcutContextType>({
  registerShortcut: () => () => {},
  unregisterShortcut: () => {},
});

// ショートカットキーのプロバイダーの型
interface ShortcutKeyProviderProps {
  children: ReactNode;
}

// ショートカットキーのプロバイダー
export const ShortcutKeyProvider = (props: ShortcutKeyProviderProps) => {
  // 登録されたショートカットを管理するstate
  const [shortcuts, setShortcuts] = useState<Map<string, () => void>>(new Map());

  // ショートカットの登録
  const registerShortcut = useCallback((key: string, callback: () => void) => {
    setShortcuts((prev) => {
      const newMap = new Map(prev);
      newMap.set(key.toLowerCase(), callback);
      return newMap;
    });

    // 登録解除のための関数を返す
    return () => {
      setShortcuts((prev) => {
        const newMap = new Map(prev);
        newMap.delete(key.toLowerCase());
        return newMap;
      });
    };
  }, []);

  // ショートカットの登録解除
  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key.toLowerCase());
      return newMap;
    });
  }, []);

  // キーイベントのハンドラー
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ctrlやメタキーと併用されているときは無視（ブラウザショートカットを優先）
      if (e.ctrlKey || e.metaKey) return;

      // 入力欄でのキー入力は無視
      if (
        e.target instanceof HTMLElement &&
        (e.target.tagName === 'INPUT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.isContentEditable)
      ) {
        return;
      }

      // 押されたキーを小文字に変換して一致するショートカットを検索
      const key = e.key.toLowerCase();
      if (shortcuts.has(key)) {
        e.preventDefault();
        shortcuts.get(key)?.();
      }
    },
    [shortcuts],
  );

  // イベントリスナーの登録と解除
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <ShortcutContext.Provider value={{ registerShortcut, unregisterShortcut }}>
      {props.children}
    </ShortcutContext.Provider>
  );
};

// カスタムフック: useShortcutKey
export function useShortcutKey(
  key: string | undefined,
  callback: () => void,
  dependencies: unknown[] = [],
) {
  const { registerShortcut } = useContext(ShortcutContext);

  useEffect(() => {
    if (!key || !callback) return;

    // ショートカットを登録し、解除関数を取得
    const unregister = registerShortcut(key, callback);

    // クリーンアップ時にショートカットを解除
    return unregister;
  }, [key, callback, registerShortcut, ...dependencies]);
}
