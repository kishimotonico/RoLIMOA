import fs from 'node:fs';
import path from 'node:path';
import config from '@rolimoa/common/config';
import type { RootState } from '@rolimoa/common/redux';
import { format } from 'date-fns';
import type { createStore } from 'redux';

type StoreType = ReturnType<typeof createStore>;

export function loadFromFile(directoryPath: string): RootState | undefined {
  createDirectoryIfNotExists(directoryPath);

  const fileName = fs
    .readdirSync(directoryPath)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .reverse()[0];

  if (!fileName) {
    return undefined;
  }
  console.log(`${fileName}が見つかったため、ストアを復元します`);

  const filePath = path.join(directoryPath, fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const state = JSON.parse(raw);
  if (!storedObjectValidator(state)) {
    console.error('ストアのバリデーションに失敗しました。config.jsonが変更されています');
    return undefined;
  }
  return state;
}

export async function saveToFile(directoryPath: string, store: StoreType): Promise<void> {
  try {
    const storeStaet = store.getState();

    const filePath = path.join(directoryPath, saveFileName());
    const content = JSON.stringify(storeStaet);
    fs.writeFileSync(filePath, content, { encoding: 'utf-8' });

    console.log(`${filePath}にストアを保存しました`);
  } catch (err) {
    console.error('ストアの保存に失敗しました', err);
  }
}

function createDirectoryIfNotExists(dirPath: string): void {
  fs.existsSync(dirPath) || fs.mkdirSync(dirPath, { recursive: true });
}

function storedObjectValidator(state: RootState): boolean {
  function isSameList(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  const stateFieldTaskKeys = Object.keys(state.score.fields.blue.tasks ?? {});
  const globalTaskKeys = Object.keys(state.score.global.tasks ?? {});

  const fieldTaskIds = config.rule.task_objects.map((task) => task.id);
  const globalTaskIds = config.rule.global_objects.map((task) => task.id);

  return isSameList(stateFieldTaskKeys, fieldTaskIds) && isSameList(globalTaskKeys, globalTaskIds);
}

function saveFileName(): string {
  const now = format(new Date(), 'yyyyMMddHHmmss');
  return `store_${now}.json`;
}
