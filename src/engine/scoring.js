// ============================================================
// scoring.js — 採点・XP・レベル・星のルール
// 「ゲームのルール」をここに集約。バランス調整はこのファイルだけ触ればよい。
// ============================================================

// レベルの定義（必要XPのしきい値）
export const LEVEL_THRESHOLDS = [0, 50, 150, 350, 700, 1200, 2000, 3000, 4500, 6500, 9999];
export const LEVEL_NAMES = ["", "ビギナー", "まなび中", "がんばり屋", "数学好き", "エキスパート", "マスター", "勇者", "英雄", "伝説", "神話"];

/** 累計XPから現在レベルを求める（1〜10） */
export function levelFromXp(xp) {
  let lv = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) lv = i + 1;
  }
  return Math.min(lv, 10);
}

/** 次のレベルまでの進捗（0〜100） */
export function levelProgress(xp) {
  const lv = levelFromXp(xp);
  if (lv >= 10) return 100;
  const lo = LEVEL_THRESHOLDS[lv - 1];
  const hi = LEVEL_THRESHOLDS[lv];
  return ((xp - lo) / (hi - lo)) * 100;
}

// タイムアタックの星の目標（正解数）
export const STAR_TARGET = {
  easy: { s1: 6, s2: 9, s3: 12 },
  standard: { s1: 4, s2: 6, s3: 8 },
  advanced: { s1: 2, s2: 3, s3: 5 },
};

/** タイムアタックの正解数から星(0〜3)を計算 */
export function calcStars(correct, level) {
  const t = STAR_TARGET[level];
  if (correct >= t.s3) return 3;
  if (correct >= t.s2) return 2;
  if (correct >= t.s1) return 1;
  return 0;
}

// 1問あたりの基礎XP
export const XP_PER_CORRECT = 8;
// 間違い1問あたりの減点（＝2問分）。連打・あてずっぽうを抑止する。
export const XP_PENALTY_PER_WRONG = XP_PER_CORRECT * 2; // = 16

/** タイムアタック1回のXPを計算（間違いは2問分マイナス、0未満にはしない） */
export function timeAttackXp({ correct, wrong = 0, stars, newStars, maxStreak }) {
  const gained = correct * XP_PER_CORRECT + newStars * 25 + (stars === 3 ? 20 : 0) + maxStreak * 2;
  const penalty = wrong * XP_PENALTY_PER_WRONG;
  return Math.max(0, gained - penalty);
}

// じっくりモードのクリア条件（連続正解数）
export const SLOW_TARGET = { easy: 5, standard: 3, advanced: 2 };

/** じっくりモードのXP（タイムアタックの約1/5。時間制限がないぶん控えめ）
 *  2回目以降の倍率（½など）は xpRepeatMultiplier 側で別途かける。 */
export function slowXp({ streak, correct }) {
  return Math.max(1, Math.round((streak * 12 + correct * 6) / 5));
}

/** 単元テストのXP（1問10XP、満点ボーナス30） */
export function unitTestXp({ correct, total }) {
  return correct * 10 + (total > 0 && correct === total ? 30 : 0);
}

/** 答え合わせ（小数誤差を許容） */
export function isCorrect(userAnswer, ans) {
  return Math.abs(parseFloat(userAnswer) - ans) < 0.05;
}

// 同じ問題（単元×難易度ごと）をくり返したときのXP倍率
//  初クリアまで : ×1（満点）
//  同じ日にくり返す : ×1/2
//  クリア済みを別の日に再挑戦 : ×1/5
// ※ key は `${unitId}-${level}` なので、かんたん/ふつう/発展は別問題として扱う
export function xpRepeatMultiplier(playLog, key, today) {
  const e = playLog && playLog[key];
  if (!e || !e.cleared) return 1;
  return e.lastDate === today ? 0.5 : 0.2;
}
