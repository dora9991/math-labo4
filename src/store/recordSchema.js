// ============================================================
// recordSchema.js — 「記録するデータの形」の定義（最重要・将来も生き残る資産）
//
// ★なぜ大事か★
//   今はブラウザ内(localStorage)に保存するが、将来 Supabase の
//   データベースに移すとき、ここで決めた形をそのままテーブルに流し込める。
//   どの記録にも studentId（誰が）と createdAt（いつ）を最初から持たせる。
//   → サーバー化のとき「保存先を差し替えるだけ」で済む。
//
// Supabase に作る予定のテーブルと1対1で対応：
//   records      … 1回の挑戦の結果（下の makeRecord）
//   mistakes     … 間違えた問題（下の makeMistake）
//   player_state … XP・レベル・単元ごとの星（PlayerState）
// ============================================================

/** 端末ローカルの仮の生徒ID（サーバー化したら本物のIDに置き換える） */
export function getOrCreateLocalStudentId() {
  const KEY = "mathApp_studentId";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = "local-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(KEY, id);
  }
  return id;
}

/** ISO形式の現在時刻（サーバーの timestamp 列にそのまま入る） */
function now() {
  return new Date().toISOString();
}

/**
 * 1回の挑戦の記録を作る。
 * mode: "timeAttack" | "slow" | "battle" | "unitTest"
 */
export function makeRecord({
  studentId, mode, chapterId, unitId, level,
  correct = 0, wrong = 0, stars = 0, xp = 0, maxStreak = 0, extra = {},
}) {
  return {
    studentId,
    mode,
    chapterId: chapterId ?? null,
    unitId: unitId ?? null,
    level: level ?? null,
    correct,
    wrong,
    stars,
    xp,
    maxStreak,
    extra,            // モード固有の追加情報（自由欄）
    createdAt: now(),
  };
}

/** 間違えた問題の記録を作る（間違いノート＆教員分析の元データ） */
export function makeMistake({ studentId, chapterId, unitId, level, q, ans }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    studentId,
    chapterId: chapterId ?? null,
    unitId: unitId ?? null,
    level: level ?? null,
    q,
    ans,
    createdAt: now(),
  };
}

/** プレイヤー状態の初期値（XP・連続日数・星など） */
export function initialPlayerState(studentId) {
  return {
    studentId,
    xp: 0,
    streaks: 0,        // 連続学習日数
    lastDate: null,    // 最後に学習した日
    stars: {},         // { "u1-easy": 3, ... }
    playLog: {},       // { "u1-easy": { cleared: true, lastDate: "2026/5/30" }, ... } くり返しXP用
    updatedAt: now(),
  };
}
