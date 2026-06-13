// Header.jsx — 画面上部の共通ヘッダー（XP・レベル・連続日数 or 戻るボタン）
import { levelFromXp, levelProgress, levelColor, levelTitle } from "../engine/scoring.js";

export default function Header({ player, back, onBack }) {
  const lv = levelFromXp(player.xp);
  const pct = levelProgress(player.xp);
  const col = levelColor(lv);
  return (
    <div className="hdr">
      <span className="logo">📐 数学ラボ</span>
      <div className="hdr-r">
        {back ? (
          <button className="back-btn" onClick={onBack}>← {back}</button>
        ) : (
          <>
            <div className="chip cc">💰{player.coins ?? 0}</div>
            <div className="chip cs">🔥{player.streaks}日</div>
            <div className="chip cl">
              <span style={{ fontSize: 11, fontWeight: 700, color: col }}>Lv.{lv}</span>
              <div className="xpm"><div className="xpf" style={{ width: pct + "%", background: col }} /></div>
              <span className="xpt">{player.xp}XP</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
