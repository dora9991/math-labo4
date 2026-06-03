// ============================================================
// Dashboard.jsx — ホームの学習ダッシュボード
//  ・ステータス（レベル・XP・連続日数・累計★・正答率）
//  ・章ごとのクリア進捗バー
//  ・得意／苦手な単元（記録の正答率から）
//  ・直近3日分の学習履歴（日ごとの解答数・正解数）
// ============================================================
import { CHAPTERS, LEVEL_KEYS } from "../data/index.js";
import { levelFromXp, levelProgress, levelTitle, levelColor } from "../engine/scoring.js";

// 記録(records)を createdAt で日ごとにまとめ、解答数・正解数を集計する。
// 解答のある日だけを新しい順に並べ、先頭 maxDays 日ぶんを返す。
// （バトルのみで解答数0の日は履歴に出さない）
function dailyHistory(records, maxDays = 3) {
  const byDay = {};
  for (const r of records) {
    if (!r || !r.createdAt) continue;
    const d = new Date(r.createdAt);
    if (isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const e = byDay[key] || (byDay[key] = { key, date: d, solved: 0, correct: 0 });
    e.solved += (r.correct || 0) + (r.wrong || 0);
    e.correct += r.correct || 0;
  }
  return Object.values(byDay)
    .filter((e) => e.solved > 0)
    .sort((a, b) => (a.key < b.key ? 1 : -1))
    .slice(0, maxDays);
}

// 日付を「今日 / 昨日 / おととい / M/D」に整形する
function dayLabel(date) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  const diff = Math.round((today - d) / 86400000);
  if (diff === 0) return "今日";
  if (diff === 1) return "昨日";
  if (diff === 2) return "おととい";
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function Dashboard({ player, records = [] }) {
  const lv = levelFromXp(player.xp);
  const xpPct = levelProgress(player.xp);
  const lvCol = levelColor(lv);
  const stars = player.stars || {};

  // 記録から単元ごとの正誤を集計
  const acc = {};
  for (const r of records) {
    if (!r.unitId) continue;
    acc[r.unitId] = acc[r.unitId] || { c: 0, w: 0 };
    acc[r.unitId].c += r.correct || 0;
    acc[r.unitId].w += r.wrong || 0;
  }

  // 単元ごとの集計（★は3難易度合計 0〜9）
  const units = [];
  for (const ch of CHAPTERS) {
    for (const u of ch.units) {
      const s = LEVEL_KEYS.reduce((sum, l) => sum + (stars[`${u.id}-${l}`] || 0), 0);
      const a = acc[u.id];
      const attempts = a ? a.c + a.w : 0;
      const accuracy = attempts > 0 ? a.c / attempts : null;
      units.push({ ch, u, stars: s, accuracy, attempts });
    }
  }

  // 全体の数値
  const totalStars = units.reduce((s, x) => s + x.stars, 0);
  const totalMax = units.length * 9;
  const solved = records.reduce((s, r) => s + (r.correct || 0) + (r.wrong || 0), 0);
  const totalCorrect = records.reduce((s, r) => s + (r.correct || 0), 0);
  const overallAcc = solved > 0 ? Math.round((totalCorrect / solved) * 100) : null;

  // 得意・苦手（ある程度解いた単元のみ）
  const attempted = units.filter((x) => x.attempts >= 3 && x.accuracy != null);
  const strong = [...attempted].sort((a, b) => b.accuracy - a.accuracy).slice(0, 3);
  const weak = [...attempted].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);

  const pct = (n) => Math.round(n * 100);

  // 直近3日分の学習履歴
  const history = dailyHistory(records, 3);

  return (
    <div>
      {/* ステータス */}
      <div className="glass" style={{ padding: "13px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 54, height: 54, borderRadius: "50%", flexShrink: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: `conic-gradient(${lvCol} ${xpPct}%, rgba(255,255,255,.1) 0)`,
          }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,.5)", lineHeight: 1 }}>Lv</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: lvCol, lineHeight: 1 }}>{lv}</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: lvCol }}>{levelTitle(lv)}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)" }}>次のレベルまで {Math.round(xpPct)}%</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fbbf24" }}>🔥{player.streaks}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)" }}>連続日数</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
          <Stat label="累計⭐" value={`${totalStars}/${totalMax}`} color="#fbbf24" />
          <Stat label="解いた問題" value={solved} color="#60a5fa" />
          <Stat label="正答率" value={overallAcc == null ? "—" : overallAcc + "%"} color="#4ade80" />
        </div>
      </div>

      {/* 章ごとのクリア進捗 */}
      <div className="glass" style={{ padding: "13px 14px" }}>
        <div className="slbl">📚 章ごとのクリア状況</div>
        {CHAPTERS.map((ch) => {
          const us = units.filter((x) => x.ch.id === ch.id);
          const s = us.reduce((a, x) => a + x.stars, 0);
          const max = us.length * 9;
          const p = max ? (s / max) * 100 : 0;
          return (
            <div key={ch.id} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
              <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{ch.emoji}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.7)", width: 92, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{ch.name}</span>
              <div style={{ flex: 1, height: 9, background: "rgba(255,255,255,.1)", borderRadius: 5, overflow: "hidden" }}>
                <div style={{ width: p + "%", height: "100%", background: `linear-gradient(90deg, ${ch.color}, ${ch.color}aa)`, borderRadius: 5, transition: "width .5s" }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: p >= 100 ? "#4ade80" : "rgba(255,255,255,.5)", minWidth: 30, textAlign: "right" }}>{Math.round(p)}%</span>
            </div>
          );
        })}
      </div>

      {/* 得意・苦手 */}
      <div className="glass" style={{ padding: "13px 14px" }}>
        <div className="slbl">📊 得意・苦手な単元</div>
        {attempted.length === 0 ? (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", textAlign: "center", padding: "8px 0" }}>
            もう少し問題を解くと、得意・苦手が見えてきます！
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#4ade80", marginBottom: 5 }}>💪 得意</div>
              {strong.map((x) => (
                <UnitAcc key={x.u.id} unit={x.u} acc={pct(x.accuracy)} color="#4ade80" />
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#f87171", marginBottom: 5 }}>🔥 苦手</div>
              {weak.map((x) => (
                <UnitAcc key={x.u.id} unit={x.u} acc={pct(x.accuracy)} color="#f87171" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 直近3日分の学習履歴 */}
      <div className="glass" style={{ padding: "13px 14px" }}>
        <div className="slbl">🗓️ 学習の記録（直近3日）</div>
        {history.length === 0 ? (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", textAlign: "center", padding: "8px 0" }}>
            問題を解くと、その日の記録がここに残ります！
          </div>
        ) : (
          history.map((h) => {
            const a = h.solved > 0 ? Math.round((h.correct / h.solved) * 100) : 0;
            return (
              <div key={h.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.7)", width: 54, flexShrink: 0 }}>
                  {dayLabel(h.date)}
                </span>
                <div style={{ display: "flex", gap: 14, flex: 1 }}>
                  <span style={{ fontSize: 12 }}>
                    <span style={{ fontWeight: 900, color: "#60a5fa" }}>{h.solved}</span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,.45)" }}> 問</span>
                  </span>
                  <span style={{ fontSize: 12 }}>
                    <span style={{ fontWeight: 900, color: "#4ade80" }}>{h.correct}</span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,.45)" }}> 正解</span>
                  </span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fbbf24", minWidth: 36, textAlign: "right" }}>{a}%</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ flex: 1, background: "rgba(255,255,255,.05)", borderRadius: 10, padding: "7px 4px", textAlign: "center" }}>
      <div style={{ fontSize: 16, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", marginTop: 1 }}>{label}</div>
    </div>
  );
}

function UnitAcc({ unit, acc, color }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
        <span style={{ color: "rgba(255,255,255,.7)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: 90 }}>{unit.emoji} {unit.name}</span>
        <span style={{ color, fontWeight: 800 }}>{acc}%</span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,.1)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: acc + "%", height: "100%", background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}
