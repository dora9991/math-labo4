// ============================================================
// Notebook.jsx — 間違いノート。間違えた問題が自動で貯まる。
// ============================================================
import Header from "../components/Header.jsx";
import { findUnit } from "../data/index.js";

export default function Notebook({ mistakes, onRemove, onBack }) {
  return (
    <div className="app">
      <Header player={{ xp: 0, streaks: 0 }} back="ホーム" onBack={onBack} />
      <div className="content">
        <div className="pg-ttl">📓 間違いノート</div>
        <div className="pg-sub">間違えた問題が自動で保存されます</div>
        {mistakes.length === 0 ? (
          <div className="glass"><div className="empty"><div className="empty-icon">🎉</div><p>間違いはありません！</p></div></div>
        ) : (
          [...mistakes].reverse().map((m) => {
            const unit = findUnit(m.chapterId, m.unitId);
            return (
              <div className="nb-item" key={m.id}>
                <div className="nb-q">{m.q}</div>
                <div className="nb-ans">正解: <strong style={{ color: "#4ade80" }}>{m.ans}</strong>{unit ? ` ・ ${unit.name}` : ""}</div>
                <button className="nb-del" onClick={() => onRemove(m.id)}>削除</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
