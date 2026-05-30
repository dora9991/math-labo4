// ============================================================
// BattleSelect.jsx — バトルする相手を選ぶ画面（弱い順に解放）
// ============================================================
import Header from "../components/Header.jsx";
import MonsterSprite from "../components/MonsterSprite.jsx";
import { MONSTERS } from "../data/monsters.js";
import { getPlayerBattleStats } from "../engine/battle.js";
import { levelFromXp, LEVEL_NAMES } from "../engine/scoring.js";

// 背景の星
function Stars() {
  const stars = Array.from({ length: 40 }, (_, i) => {
    const sz = Math.random() * 2 + 0.5;
    return (
      <div key={i} className="bstar" style={{
        width: sz, height: sz, top: `${Math.random() * 90}%`, left: `${Math.random() * 100}%`,
        "--d": `${(Math.random() * 2 + 1).toFixed(1)}s`, animationDelay: `${(Math.random() * 3).toFixed(1)}s`,
      }} />
    );
  });
  return <div className="battle-stars">{stars}</div>;
}

export default function BattleSelect({ player, onSelect, onBack }) {
  const lv = levelFromXp(player.xp);
  const stats = getPlayerBattleStats(lv);
  return (
    <div className="battle-app">
      <Stars />
      <div className="battle-ground" />
      <Header player={player} back="ホーム" onBack={onBack} />
      <div className="battle-content">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#7fff7f", letterSpacing: 2 }}>⚔️ バトルモード</div>
          <div style={{ fontSize: 12, color: "#88aa88", marginTop: 2 }}>
            あなた：Lv.{lv} {LEVEL_NAMES[lv]} ／ HP {stats.maxHp} ・ 攻撃 {stats.atk} ・ 制限 {stats.timer}秒
          </div>
        </div>

        {MONSTERS.map((m) => {
          const unlocked = lv >= m.minLv;
          return (
            <button
              key={m.id}
              className="bt-panel bt-select-card"
              disabled={!unlocked}
              onClick={() => unlocked && onSelect(m)}
              style={{ borderColor: unlocked ? m.color + "88" : "#2d6e2d" }}
            >
              <div className="bt-select-mini" style={{ borderColor: unlocked ? m.color : "#2d6e2d" }}>
                {unlocked
                  ? <svg viewBox="0 0 140 140" style={{ width: 64, height: 64, overflow: "visible" }} dangerouslySetInnerHTML={{ __html: m.svgDefs + m.svg }} />
                  : <span style={{ fontSize: 30 }}>🔒</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: unlocked ? m.color : "#88aa88" }}>{m.name}</div>
                <div style={{ fontSize: 11, color: "#88aa88" }}>テーマ：{m.unit}</div>
                {unlocked ? (
                  <div className="bt-select-stats">
                    <span className="bt-select-stat">HP {m.hp}</span>
                    <span className="bt-select-stat">攻撃 {m.atk}</span>
                    <span className="bt-select-stat" style={{ background: "rgba(251,191,36,.2)", color: "#fbbf24" }}>撃破 +{m.reward}XP</span>
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: "#aa8866", marginTop: 4 }}>🔒 Lv.{m.minLv} で解放</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
