// Header.jsx — 画面上部の共通ヘッダー（XP・レベル・連続日数 or 戻るボタン）
import { levelFromXp, levelProgress, LEVEL_NAMES } from "../engine/scoring.js";

const LV_COLORS = ["", "#94a3b8", "#60a5fa", "#4ade80", "#fb923c", "#f87171", "#e879f9", "#fbbf24", "#f97316", "#ef4444", "#dc2626"];

export default function Header({ player, back, onBack }) {
  const lv = levelFromXp(player.xp);
  const pct = levelProgress(player.xp);
  return (
    <div className="hdr">
      <span className="logo">📐 数学ラボ</span>
      <div className="hdr-r">
        {back ? (
          <button className="back-btn" onClick={onBack}>← {back}</button>
        ) : (
          <>
            <div className="chip cs">🔥{player.streaks}日</div>
            <div className="chip cl">
              <span style={{ fontSize: 11, fontWeight: 700, color: LV_COLORS[lv] }}>Lv.{lv}</span>
              <div className="xpm"><div className="xpf" style={{ width: pct + "%", background: LV_COLORS[lv] }} /></div>
              <span className="xpt">{player.xp}XP</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export { LV_COLORS, LEVEL_NAMES };
