// ============================================================
// generator.js — 問題生成エンジン
// 「単元(unit) と 難易度(level)」を渡すと、1問ぶんの問題オブジェクトを返す。
//
// データ側の各問題は { id, build(rng), skill? } の形をしている（data/ を参照）。
//  - id    : 問題テンプレートの識別子
//  - build : 乱数関数を受け取り {q, ans, h1, h2, skip?} を返す関数
//  - skill : このテンプレが主に練習するスキルID（data/skills.js を指す）
//
// この層がデータの形に依存する唯一の場所。データの並べ方を変えても
// 画面側は「genProblem / buildTemplate を呼ぶだけ」で済むようにしている。
// ============================================================
import { rng, pick } from "./rng.js";
import { dbTemplatesFor } from "../data/dbProblems.js";

// DB実問題を出す割合（手続き生成より優先。手続きは変化球として残す）
const DB_PREFER = 0.65;

/**
 * skip フラグを考慮して1つのテンプレを最大10回まで作り直して生成する。
 * @returns {object|null} { q, ans, h1, h2, id, unitId, skill, level }
 */
function makeFromTemplate(template, unit, level) {
  if (!template) return null;
  for (let i = 0; i < 10; i++) {
    const made = template.build(rng);
    if (made && !made.skip) {
      return { ...made, id: template.id, unitId: unit.id, skill: template.skill || null, level };
    }
  }
  return null;
}

/**
 * 1問を生成する（ランダムなテンプレを選ぶ。タイムアタック・じっくり用）。
 * @param {object} unit  - 単元オブジェクト（problems[level] を持つ）
 * @param {string} level - "easy" | "standard" | "advanced"
 * @param {string|null} lastId - 直前に出した問題ID（連続で同じを避ける）
 * @returns {object|null} { id, unitId, q, ans, h1, h2, skill, level }
 */
export function genProblem(unit, level, lastId = null) {
  const proc = unit?.problems?.[level] || [];
  const db = dbTemplatesFor(unit?.id, level); // DB由来の実問題（c1〜c4のみ）
  if (proc.length === 0 && db.length === 0) return null;

  // DBプールが小さいと同じ問題ばかりになるので、プール数に応じて出題率を下げる
  //  （例：DBが1問しかない単元は約18%だけDB、残りは手続き生成で変化を出す）
  const prefer = Math.min(DB_PREFER, db.length * 0.18);
  const useDb = db.length > 0 && (proc.length === 0 || Math.random() < prefer);
  const pool = useDb ? db : proc;

  // 直前と同じ id は除外（同じ問題の連続を避ける）
  const usable = pool.filter((t) => t.id !== lastId);
  const chosen = pick(usable.length ? usable : pool);
  return makeFromTemplate(chosen, unit, level);
}

/**
 * テンプレIDを指定して1問を生成する（アダプティブ出題＝selector の結果から作る用）。
 * @param {object} unit       - 単元オブジェクト
 * @param {string} level      - 難易度
 * @param {string} templateId - data 側のテンプレID（例 "u2e3"）
 * @returns {object|null}
 */
export function buildTemplate(unit, level, templateId) {
  const templates = unit?.problems?.[level] || [];
  const t = templates.find((x) => x.id === templateId);
  return makeFromTemplate(t, unit, level);
}

/**
 * 4択の選択肢を作る（タイムアタック用）。正解＋それらしいダミー3つ。
 * @param {number} ans 正解の値
 * @returns {number[]} シャッフル済みの4択
 */
export function makeChoices(ans) {
  const a = Number(ans);
  const isInt = Number.isInteger(a);
  const round = (x) => (isInt ? Math.round(x) : Math.round(x * 10) / 10);
  const choices = new Set([a]);

  // よくある誤答を優先してダミーに入れる：符号ミス(-a)・絶対値(|a|)
  for (const t of [-a, Math.abs(a)]) {
    if (choices.size >= 3) break; // 1つは ±delta の枠を残す
    if (Number.isFinite(t) && t !== a) choices.add(round(t));
  }

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
