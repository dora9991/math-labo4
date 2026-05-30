// ============================================================
// data/index.js — 全章を束ねる窓口
// 画面側は「import { CHAPTERS } from '../data'」だけ書けばよい。
// 新しい章を足すときは import を1行追加して CHAPTERS に並べるだけ。
// ============================================================
import { chapter as c1 } from "./grade1/c1_seisu.js";
import { chapter as c2 } from "./grade1/c2_moji.js";
import { chapter as c3 } from "./grade1/c3_houteishiki.js";
import { chapter as c4 } from "./grade1/c4_hirei.js";
import { chapter as c5 } from "./grade1/c5_heimen.js";
import { chapter as c6 } from "./grade1/c6_kukan.js";
import { chapter as c7 } from "./grade1/c7_data.js";
// ↓ 中2・中3を足すときは grade2/ grade3/ を作って同様に追加

export const CHAPTERS = [c1, c2, c3, c4, c5, c6, c7];

// 難易度の共通定義（画面でラベル・色に使う）
export const LEVEL_KEYS = ["easy", "standard", "advanced"];
export const LEVEL_LABEL = { easy: "かんたん", standard: "ふつう", advanced: "発展" };
export const LEVEL_COLOR = { easy: "#4ade80", standard: "#fb923c", advanced: "#f87171" };

/** 章ID・単元IDから単元を探す */
export function findUnit(chapterId, unitId) {
  return CHAPTERS.find((c) => c.id === chapterId)?.units.find((u) => u.id === unitId);
}

/** 全単元を平らな配列で返す（記録表示などに便利） */
export function allUnits() {
  return CHAPTERS.flatMap((c) => c.units);
}
