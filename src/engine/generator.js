// ============================================================
// generator.js — 問題生成エンジン
// 「単元(unit) と 難易度(level)」を渡すと、1問ぶんの問題オブジェクトを返す。
//
// データ側の各問題は { id, build(rng) } の形をしている（data/ を参照）。
//  - id    : 問題テンプレートの識別子
//  - build : 乱数関数を受け取り {q, ans, h1, h2, skip?} を返す関数
//
// この層がデータの形に依存する唯一の場所。データの並べ方を変えても
// 画面側は「genProblem を呼ぶだけ」で済むようにしている。
// ============================================================
import { rng, pick } from "./rng.js";

/**
 * 1問を生成する。
 * @param {object} unit  - 単元オブジェクト（problems[level] を持つ）
 * @param {string} level - "easy" | "standard" | "advanced"
 * @param {string|null} lastId - 直前に出した問題ID（連続で同じを避ける）
 * @returns {object|null} { id, unitId, q, ans, h1, h2 }
 */
export function genProblem(unit, level, lastId = null) {
  const templates = unit?.problems?.[level];
  if (!templates || templates.length === 0) return null;

  // skip フラグ付き・直前と同じ id は除外
  const usable = templates.filter((t) => t.id !== lastId);
  const chosen = pick(usable.length ? usable : templates);
  if (!chosen) return null;

  // build が skip:true を返すことがある（割り切れない等の不成立ケース）。
  // 最大10回まで作り直す。
  for (let i = 0; i < 10; i++) {
    const made = chosen.build(rng);
    if (made && !made.skip) {
      return { ...made, id: chosen.id, unitId: unit.id };
    }
  }
  return null;
}

/**
 * 4択の選択肢を作る（タイムアタック用）。正解＋それらしいダミー3つ。
 * @param {number} ans 正解の値
 * @returns {number[]} シャッフル済みの4択
 */
export function makeChoices(ans) {
  const a = Number(ans);
  const isInt = Number.isInteger(a);
  const choices = new Set([a]);
  const deltas = isInt
    ? [1, 2, 3, 4, 5, 6, 8, 10, 12, 20]
    : [0.1, 0.2, 0.5, 1, 1.5, 2];

  let guard = 0;
  while (choices.size < 4 && guard < 200) {
    guard++;
    const d = pick(deltas);
    const sign = Math.random() < 0.5 ? 1 : -1;
    const cand = isInt
      ? Math.round(a + sign * d)
      : Math.round((a + sign * d) * 10) / 10;
    choices.add(cand);
  }
  // それでも足りない場合の保険
  let fb = 1;
  while (choices.size < 4) choices.add(a + fb++);

  return [...choices].sort(() => Math.random() - 0.5);
}
