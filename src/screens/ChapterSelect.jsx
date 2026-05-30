// ============================================================
// ChapterSelect.jsx — 章 → 単元 → 難易度 を選ぶ画面
// ============================================================
import { useState } from "react";
import Header from "../components/Header.jsx";
import Stars from "../components/Stars.jsx";
import { CHAPTERS, LEVEL_KEYS, LEVEL_LABEL, LEVEL_COLOR } from "../data/index.js";
import { getStars, isUnitUnlocked } from "../engine/progress.js";

export default function ChapterSelect({ player, mode, onStart, onBack }) {
  const [chapter, setChapter] = useState(null);
  const [unit, setUnit] = useState(null);

  const modeLabel = { timeAttack: "⏱ タイムアタック", slow: "🌱 じっくり" }[mode] || "";

  // 難易度を選ぶ段階
  if (chapter && unit) {
    return (
      <div className="app">
        <Header player={player} back={chapter.name} onBack={() => setUnit(null)} />
        <div className="content">
          <div className="pg-ttl">{unit.emoji} {unit.name}</div>
          <div className="pg-sub">{unit.desc} ・ 難易度をえらぼう</div>
          {LEVEL_KEYS.map((lv) => {
            const cls = lv === "easy" ? "easy-bg" : lv === "standard" ? "std-bg" : "adv-bg";
            const st = getStars(player, unit.id, lv);
            return (
              <button key={lv} className={`lv-card ${cls}`} onClick={() => onStart(chapter, unit, lv)}>
                <div className="lv-em">{lv === "easy" ? "🌱" : lv === "standard" ? "🔥" : "⚡"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 900 }}>{LEVEL_LABEL[lv]}</div>
                  <div style={{ fontSize: 11, opacity: 0.75 }}>
                    {lv === "easy" ? "基本をしっかり" : lv === "standard" ? "応用に挑戦" : "難問に全力"}
                  </div>
                  <div style={{ marginTop: 4 }}><Stars count={st} size={12} /></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 単元を選ぶ段階
  if (chapter) {
    return (
      <div className="app">
        <Header player={player} back="単元選択" onBack={() => setChapter(null)} />
        <div className="content">
          <div className="pg-ttl" style={{ color: chapter.color }}>{chapter.emoji} {chapter.name}</div>
          <div className="pg-sub">{modeLabel}</div>
          {chapter.units.map((u, idx) => {
            const unlocked = isUnitUnlocked(player, chapter, idx);
            return (
              <button
                key={u.id}
                className="chap-card"
                style={{ background: unlocked ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.03)", opacity: unlocked ? 1 : 0.4, cursor: unlocked ? "pointer" : "not-allowed" }}
                disabled={!unlocked}
                onClick={() => unlocked && setUnit(u)}
              >
                <div className="chap-em">{unlocked ? u.emoji : "🔒"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>
                    {unlocked ? u.desc : "前の単元をクリアで解放"}
                  </div>
                  {unlocked && (
                    <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                      {LEVEL_KEYS.map((lv) => (
                        <span key={lv} style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6, background: LEVEL_COLOR[lv] + "22", color: LEVEL_COLOR[lv] }}>
                          {LEVEL_LABEL[lv]} {"⭐".repeat(getStars(player, u.id, lv)) || "○"}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 章を選ぶ段階
  return (
    <div className="app">
      <Header player={player} back="ホーム" onBack={onBack} />
      <div className="content">
        <div className="pg-ttl">単元を選ぼう</div>
        <div className="pg-sub">{modeLabel}</div>
        {CHAPTERS.map((c) => (
          <button key={c.id} className="chap-card" style={{ background: `linear-gradient(135deg, ${c.color}cc, ${c.color}88)` }} onClick={() => setChapter(c)}>
            <div className="chap-em">{c.emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="chap-nm">{c.name}</div>
              <div className="chap-sub">中学{c.grade}年 ・ {c.units.length}単元</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
