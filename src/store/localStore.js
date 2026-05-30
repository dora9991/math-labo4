// ============================================================
// localStore.js — 保存層（ローカル実装）
//
// 「保存・読み込みの窓口」をここに集約する。画面側はこの関数だけを呼ぶ。
// 将来サーバー保存にするときは、同じ関数名で supabase 版を作り、
// import 先を差し替えるだけでよい（ゲーム本体は一切触らない）。
//
//   load()              … プレイヤー状態＋記録をまとめて読む
//   savePlayerState(s)  … プレイヤー状態を保存
//   addRecord(r)        … 挑戦記録を1件追加
//   addMistakes(ms)     … 間違いを追加（重複は除く）
//   removeMistake(id)   … 間違いノートから1件削除
// ============================================================
import { getOrCreateLocalStudentId, initialPlayerState } from "./recordSchema.js";

const KEY = "mathApp_data_v1";

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("保存データの読み込みに失敗:", e);
  }
  // 初期データ
  const studentId = getOrCreateLocalStudentId();
  return {
    player: initialPlayerState(studentId),
    records: [],
    mistakes: [],
  };
}

function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("保存に失敗:", e);
  }
}

/** 全データを読み込む */
export function load() {
  return readAll();
}

/** プレイヤー状態を保存 */
export function savePlayerState(player) {
  const data = readAll();
  data.player = { ...player, updatedAt: new Date().toISOString() };
  writeAll(data);
  return data.player;
}

/** 挑戦記録を1件追加して、追加後の records を返す */
export function addRecord(record) {
  const data = readAll();
  data.records.push(record);
  writeAll(data);
  return data.records;
}

/** 間違いを追加（同じ問題文があれば置き換え）。最新40件まで保持 */
export function addMistakes(mistakes) {
  if (!mistakes || mistakes.length === 0) return readAll().mistakes;
  const data = readAll();
  const qSet = new Set(mistakes.map((m) => m.q));
  data.mistakes = [...data.mistakes.filter((m) => !qSet.has(m.q)), ...mistakes].slice(-40);
  writeAll(data);
  return data.mistakes;
}

/** 間違いノートから1件削除 */
export function removeMistake(id) {
  const data = readAll();
  data.mistakes = data.mistakes.filter((m) => m.id !== id);
  writeAll(data);
  return data.mistakes;
}
