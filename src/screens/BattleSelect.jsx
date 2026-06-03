// ============================================================
// BattleSelect.jsx — バトルする相手を選ぶ画面
//  最初から全モンスターに挑める。minLv は「推奨レベル」として表示するだけ。
// ============================================================
import Header from "../components/Header.jsx";
import MonsterSprite from "../components/MonsterSprite.jsx";
import { MONSTERS } from "../data/monsters.js";
import { getPlayerBattleStats } from "../engine/battle.js";
import { levelFromXp, levelTitle } from "../engine/scoring.js";

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

export default function BattleSelect({ player, clearedIds, onSelect, onBack }) {
  const cleared = clearedIds || new Set();
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
            あなた：Lv.{lv} {levelTitle(lv)} ／ HP {stats.maxHp} ・ 攻撃 {stats.atk} ・ 制限 {stats.timer}秒
          </div>
          <div style={{ fontSize: 11, color: "#5a8a5a", marginTop: 2 }}>全21体＋ラスボス！どの敵にも挑戦できる（推奨レベルは目安）</div>
        </div>

        {MONSTERS.map((m) => {
          // 自分のレベルと推奨レベルの差で「手強さ」を表示
          const tough = lv < m.minLv;             // 推奨より下＝手強い
          const veryTough = lv < m.minLv - 6;     // かなり下＝かなり手強い
          const isCleared = cleared.has(m.id);
          return (
            <button
              key={m.id}
              className="bt-panel bt-select-card"
              onClick={() => onSelect(m)}
              style={{ borderColor: m.color + "88", position: "relative", overflow: "hidden" }}
            >
              {/* 撃破済み：右側に大きな斜めスタンプ */}
              {isCleared && (
                <div style={{
                  position: "absolute", right: 8, top: "50%",
                  transform: "translateY(-50%) rotate(-15deg)",
                  fontFamily: "'M PLUS Rounded 1c','DotGothic16',sans-serif",
                  fontSize: 30, fontWeight: 900, letterSpacing: 1,
                  color: "#fde047",
                  border: "4px solid #fde047", borderRadius: 10, padding: "2px 12px",
                  textShadow: "0 0 10px rgba(250,204,21,.8)",
                  boxShadow: "0 0 14px rgba(250,204,21,.5), inset 0 0 12px rgba(250,204,21,.3)",
                  opacity: 0.92, pointerEvents: "none", zIndex: 3,
                }}>CLEAR!</div>
              )}
              <div className="bt-select-mini" style={{ borderColor: m.color }}>
                <svg viewBox="0 0 140 140" style={{ width: 64, height: 64, overflow: "visible" }} dangerouslySetInnerHTML={{ __html: m.svgDefs + m.svg }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: m.color }}>
                  {m.name}
                  {veryTough && <span style={{ fontSize: 10, color: "#ff6b6b", marginLeft: 6 }}>☠ かなり手強い</span>}
                  {tough && !veryTough && <span style={{ fontSize: 10, color: "#fbbf24", marginLeft: 6 }}>⚠ 手強い</span>}
                </div>
                <div style={{ fontSize: 11, color: "#88aa88" }}>テーマ：{m.unit} ・ 推奨Lv.{m.minLv}</div>
                <div className="bt-select-stats">
                  <span className="bt-select-stat">HP {m.hp}</span>
                  <span className="bt-select-stat">攻撃 {m.atk}</span>
                  <span className="bt-select-stat" style={{ background: "rgba(251,191,36,.2)", color: "#fbbf24" }}>撃破 +{m.reward}XP</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
