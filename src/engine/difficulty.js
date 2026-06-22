// ============================================================
// difficulty.js — 5段階の難易度ラダー
//  問題DBは内部的に easy/standard/advanced の3段階だが、これを配点(points)で
//  さらに割り、プレイ体験としては「難易度 Lv1〜5」の5段階で扱う。
//  タイムアタックでは「5連続正解で難易度が1段上がる」のに使う。
// ============================================================

export const MAX_STAGE = 5;        // 難易度の最大段（Lv5）
export const STREAK_TO_LEVELUP = 5; // 連続正解が何問たまると1段上がるか

// 5段階(Lv) → 出題に使う3段階のコンテンツ難易度
//  Lv1,2 → easy ／ Lv3 → standard ／ Lv4,5 → advanced
export function stageToLevel(stage) {
  if (stage >= 4) return "advanced";
  if (stage === 3) return "standard";
  return "easy";
}

// 選んだ基準難易度(easy/standard/advanced) → 開始ステージ(Lv)
export function levelToStage(level) {
  if (level === "advanced") return 4;
  if (level === "standard") return 3;
  return 1;
}

// DB問題を5段階(1〜5)に分類する：DBの level(1〜3) と 想定解答時間 timeSec から派生。
//  （配点は階級とほぼ連動して割れないため、階級内でばらつく timeSec で細分する）
//  level1: 時間がかかるものを Lv2、ふつうは Lv1（基礎）
//  level2: 時間がかかるものを Lv4、ふつうは Lv3（標準）
//  level3: Lv5（応用）
export function diff5Of(level, timeSec = 0) {
  const lv = Number(level) || 1;
  const t = Number(timeSec) || 0;
  if (lv <= 1) return t > 20 ? 2 : 1;
  if (lv === 2) return t > 30 ? 4 : 3;
  return 5;
}

// 表示用ラベル（Lvの添え名）
export const STAGE_LABEL = [
  "", "ウォームアップ", "やさしい", "ふつう", "むずかしい", "チャレンジ",
];
