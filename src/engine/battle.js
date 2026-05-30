// ============================================================
// battle.js — バトルモードのルール（ゲームエンジン）
//  - プレイヤーのステータス（レベルで強くなる）
//  - ダメージ計算（連続正解コンボでボーナス）
//  - 出題：モンスターの担当単元から「単元テスト級（標準・発展）」を出す
//    （簡単すぎる easy は使わない → 考える力がつく難度）
// ============================================================
import { genProblem, makeChoices } from "./generator.js";
import { findUnit } from "../data/index.js";
import { pick } from "./rng.js";

/** プレイヤーのレベルに応じたバトル用ステータス */
export function getPlayerBattleStats(lv) {
  return {
    maxHp: 36 + lv * 14, // Lv1=50 〜 Lv10=176
    atk: 10 + lv * 5,    // Lv1=15 〜 Lv10=60
    timer: 9 + lv,       // Lv1=10秒 〜 Lv10=19秒（しっかり考える時間）
  };
}

/** 正解時のダメージ（プレイヤー攻撃力＋コンボボーナス、3連続以上で1.5倍） */
export function calcDamage(atk, combo) {
  const bonus = combo >= 3 ? Math.floor(atk * 0.5) : 0;
  return atk + bonus;
}

// バトルで使う難易度（標準寄り＋ときどき発展。易しすぎる easy は除外）
const BATTLE_LEVELS = ["standard", "standard", "advanced"];

/**
 * モンスターの担当単元から1問生成する（4択つき）。
 * @param {object} monster MONSTERS の1体（pools を持つ）
 * @param {string|null} lastId 直前の問題ID
 * @returns {object|null} { q, ans, h1, h2, choices, unitName, level, id }
 */
export function genBattleProblem(monster, lastId = null) {
  for (let attempt = 0; attempt < 14; attempt++) {
    const pool = pick(monster.pools);
    const unit = pool && findUnit(pool.c, pool.u);
    if (!unit) continue;
    const level = pick(BATTLE_LEVELS);
    const q = genProblem(unit, level, lastId);
    if (q) {
      return { ...q, unitName: unit.name, level, choices: makeChoices(q.ans) };
    }
  }
  return null;
}
