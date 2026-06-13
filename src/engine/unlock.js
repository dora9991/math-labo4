// ============================================================
// unlock.js — バトルモンスターの解放判定（純関数）
//
//  小単元モンスター : その小単元の3難易度(かんたん/ふつう/発展)を
//                     タイムアタックで★1以上にすると解放。
//  章ボス           : その章の小単元モンスターを全員たおすと解放。
//  最終ボス(魔王)   : すべての章ボスをたおすと解放。
// ============================================================
import { MONSTERS } from "../data/monsters.js";
import { LEVEL_KEYS } from "../data/index.js";

/** 小単元モンスターが解放済みか（pools の全ユニットで3難易度★1以上） */
export function isUnitMonsterUnlocked(player, monster) {
  const stars = player?.stars || {};
  return monster.pools.every((p) =>
    LEVEL_KEYS.every((l) => (stars[`${p.u}-${l}`] || 0) >= 1)
  );
}

/** ある章の小単元モンスター一覧 */
export function unitMonstersOfChapter(chapterId) {
  return MONSTERS.filter((m) => m.kind === "unit" && m.chapterId === chapterId);
}

/** 章ボスが解放済みか（その章の小単元モンスターを全撃破） */
export function isChapterBossUnlocked(clearedIds, chapterId) {
  const deps = unitMonstersOfChapter(chapterId);
  return deps.length > 0 && deps.every((m) => clearedIds.has(m.id));
}

/** 最終ボスが解放済みか（全章ボスを撃破） */
export function isFinalBossUnlocked(clearedIds) {
  const bosses = MONSTERS.filter((m) => m.kind === "chapterBoss");
  return bosses.length > 0 && bosses.every((m) => clearedIds.has(m.id));
}

/** モンスター種別を問わず解放済みか */
export function isUnlocked(player, clearedIds, monster) {
  if (monster.kind === "unit") return isUnitMonsterUnlocked(player, monster);
  if (monster.kind === "chapterBoss") return isChapterBossUnlocked(clearedIds, monster.chapterId);
  if (monster.kind === "finalBoss") return isFinalBossUnlocked(clearedIds);
  return true;
}

/** 解放済みだが「まだ見ていない（seenMonsters 未登録）」モンスターのidリスト */
export function newlyUnlockedIds(player, clearedIds) {
  const seen = player?.seenMonsters || {};
  return MONSTERS.filter((m) => !seen[m.id] && isUnlocked(player, clearedIds, m)).map((m) => m.id);
}

/** 未解放モンスターの解放条件を説明する文 */
export function unlockHint(monster) {
  if (monster.kind === "unit") {
    return `「${monster.unit}」のタイムアタックで、かんたん・ふつう・発展 をすべて★1以上クリアすると出現！`;
  }
  if (monster.kind === "chapterBoss") {
    return "この章の小単元モンスターを全員たおすと出現！";
  }
  if (monster.kind === "finalBoss") {
    return "すべての章ボスをたおすと出現！";
  }
  return "";
}
