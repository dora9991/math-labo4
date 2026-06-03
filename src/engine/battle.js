// ============================================================
// battle.js — バトルモードのルール（ゲームエンジン）
//  - プレイヤーのステータス（レベルで強くなる。Lv99まで対応）
//  - ダメージ計算（連続正解コンボでボーナス）
//  - 出題：モンスターの担当単元から「標準・発展」を出す
//    ラスボスは全単元の発展のみ
// ============================================================
import { genProblem, makeChoices } from "./generator.js";
import { findUnit } from "../data/index.js";
import { pick } from "./rng.js";

/** プレイヤーのレベルに応じたバトル用ステータス（Lv1〜99） */
export function getPlayerBattleStats(lv) {
  return {
    maxHp: 36 + lv * 14,        // Lv1=50 〜 Lv99=1422
    atk: 8 + lv * 7,            // Lv1=15 〜 Lv99=701（増え方を強化）
    timer: Math.min(9 + lv, 30), // Lv1=10秒 〜 上限30秒
  };
}

/** 推奨レベルのプレイヤーHPから「6発で倒れる」敵攻撃力を逆算 */
export function enemyAtkForLevel(minLv) {
  const playerHp = 36 + minLv * 14;
  return Math.max(8, Math.round(playerHp / 6));
}

/** 正解時のダメージ（プレイヤー攻撃力＋コンボボーナス、3連続以上で1.5倍） */
export function calcDamage(atk, combo) {
  const bonus = combo >= 3 ? Math.floor(atk * 0.5) : 0;
  return atk + bonus;
}

// 通常戦の難易度（標準寄り＋ときどき発展。易しすぎる easy は除外）
const BATTLE_LEVELS = ["standard", "standard", "advanced"];

/**
 * モンスターの担当単元から1問生成する（4択つき）。
 * ラスボス（bossAdvancedOnly）は発展のみ。
 * @param {object} monster MONSTERS の1体（pools を持つ）
 * @param {string|null} lastId 直前の問題ID
 */
export function genBattleProblem(monster, lastId = null) {
  const levels = monster.bossAdvancedOnly ? ["advanced"] : BATTLE_LEVELS;
  for (let attempt = 0; attempt < 20; attempt++) {
    const pool = pick(monster.pools);
    const unit = pool && findUnit(pool.c, pool.u);
    if (!unit) continue;
    const level = pick(levels);
    const q = genProblem(unit, level, lastId);
    if (q) {
      return { ...q, unitName: unit.name, level, choices: makeChoices(q.ans) };
    }
  }
  return null;
}
