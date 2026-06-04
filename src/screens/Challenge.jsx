// ============================================================
// Challenge.jsx — チャレンジモード（挑む：難問・手書き・単元別の階級）
//  ・中1の各単元（章）ごとに思考力難問。答えは自由入力（記述）で採点。
//  ・手書きの計算スペース（DrawPad）を常設＝紙が要る“本物の数学”体験。
//  ・評価は単元ごとの「階級」＝その単元でどれだけ難問を攻略したか。
//    問題を解くほど 未挑戦→ブロンズ→…→マスター と階級が上がる。
// ============================================================
import { useState } from "react";
import Header from "../components/Header.jsx";
import DrawPad from "../components/DrawPad.jsx";
import * as sfx from "../audio/sfx.js";
import { isCorrect } from "../engine/scoring.js";
import {
  CHALLENGE_UNITS, LEVEL_LABEL, clearedCount, unitRank,
  toNextRank, masteredUnits, totalCleared, challengeXp,
} from "../data/challenge.js";

export default function Challenge({ player, onClear, onHome }) {
  const [cleared, setCleared] = useState(() => ({ ...(player.challengeCleared || {}) }));
  const [view, setView] = useState("units"); // units | solve
  const [curUnit, setCurUnit] = useState(null); // 選んでいる単元
  const [cur, setCur] = useState(null);          // 解いている問題
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);    // null | "correct" | "revealed"
  const [wrong, setWrong] = useState(0);
  const [hintLv, setHintLv] = useState(0);       // 0:なし 1:h1 2:h2
  const [showPad, setShowPad] = useState(true);
  const [padKey, setPadKey] = useState(0);
  const [rankUp, setRankUp] = useState(null);    // 階級アップ演出 { unit, rank }
  const [msg, setMsg] = useState("");

  function openProblem(unit, p) {
    setCurUnit(unit); setCur(p); setInput(""); setResult(null); setWrong(0);
    setHintLv(0); setMsg(""); setPadKey((k) => k + 1); setShowPad(true); setView("solve");
  }

  function backToUnits() { setView("units"); setCur(null); }

  function submit() {
    if (!cur || result === "correct" || input.trim() === "") return;
    if (isCorrect(input, cur.ans)) {
      sfx.correct();
      const first = !cleared[cur.id];
      const beforeRank = unitRank(curUnit, cleared);
      const next = { ...cleared, [cur.id]: true };
      setCleared(next);
      if (first) onClear?.(cur.id, cur.level); // 初クリアのみ永続化＆XP
      const afterRank = unitRank(curUnit, next);
      if (afterRank !== beforeRank) { sfx.levelUp(); setRankUp({ unit: curUnit, rank: afterRank }); }
      setResult("correct");
      setMsg("お見事！");
    } else {
      sfx.wrong();
      setWrong((w) => w + 1);
      setMsg("ちがうみたい。計算を見直してみよう。");
    }
  }

  function reveal() {
    setResult("revealed");
    setHintLv(2);
  }

  // ============ 解答ビュー ============
  if (view === "solve" && cur && curUnit) {
    const already = !!player.challengeCleared?.[cur.id];
    return (
      <div className="app">
        <Header player={player} back="単元へ" onBack={backToUnits} />
        <div className="content">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span className="ch-tier-pill">{curUnit.emoji} {curUnit.name}</span>
            <span style={{ fontSize: 12, color: "#fde047", fontWeight: 800 }}>{LEVEL_LABEL[cur.level]}</span>
            {already && <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 700 }}>クリア済み</span>}
          </div>

          {/* 問題 */}
          <div className="glass" style={{ padding: 18 }}>
            <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.6, color: "#fff" }}>{cur.q}</div>

            {hintLv > 0 && (
              <div style={{ background: "rgba(253,224,71,.1)", border: "1px solid rgba(253,224,71,.3)", borderRadius: 11, padding: "9px 12px", marginTop: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fde047", lineHeight: 1.6 }}>
                  💡 {cur.h1}
                  {hintLv >= 2 && cur.h2 ? <><br />💡 {cur.h2}</> : null}
                </div>
              </div>
            )}

            {result !== "correct" ? (
              <>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                  inputMode="text"
                  placeholder="答えを入力（例：25, -3, 1/2）"
                  data-sfx="none"
                  style={{
                    width: "100%", boxSizing: "border-box", textAlign: "center",
                    fontSize: 20, fontWeight: 800, padding: "12px 10px", marginTop: 14,
                    borderRadius: 12, border: "2px solid rgba(255,255,255,.15)",
                    background: "rgba(255,255,255,.06)", color: "#fff", outline: "none",
                  }}
                />
                {msg && (
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8, textAlign: "center", color: result === "revealed" ? "#fde047" : "#f87171" }}>
                    {result === "revealed" ? null : msg}
                  </div>
                )}
                {result === "revealed" && (
                  <div style={{ fontSize: 14, marginTop: 10, textAlign: "center" }}>
                    正解：<strong style={{ color: "#4ade80" }}>{cur.ans}</strong>
                  </div>
                )}
                <button
                  onClick={submit}
                  disabled={input.trim() === ""}
                  data-sfx="none"
                  style={{
                    width: "100%", marginTop: 12, padding: "13px", borderRadius: 12, border: "none",
                    cursor: input.trim() === "" ? "not-allowed" : "pointer", fontSize: 16, fontWeight: 900,
                    color: "#fff", background: input.trim() === "" ? "rgba(99,102,241,.4)" : "#6366f1",
                  }}
                >
                  答え合わせ
                </button>
                <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center" }}>
                  {hintLv < 2 && (
                    <button onClick={() => setHintLv((h) => h + 1)} data-sfx="none" style={ghostBtn}>
                      💡 ヒント{hintLv === 0 ? "①" : "②"}
                    </button>
                  )}
                  {result !== "revealed" && (
                    <button onClick={reveal} data-sfx="none" style={ghostBtn}>答えを見る</button>
                  )}
                  {result === "revealed" && (
                    <button onClick={backToUnits} data-sfx="none" style={ghostBtn}>単元へもどる</button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <div style={{ fontSize: 44 }}>🎉</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#4ade80" }}>正解！</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 4 }}>
                  {already ? "さすが、もう一度解けたね。" : `${curUnit.name}の難問を攻略！ +${challengeXp(cur.level)}XP`}
                </div>
                <button onClick={backToUnits} data-sfx="none" style={{
                  marginTop: 16, padding: "12px 26px", borderRadius: 12, border: "none",
                  cursor: "pointer", fontSize: 15, fontWeight: 900, color: "#fff", background: "#6366f1",
                }}>
                  単元へもどる →
                </button>
              </div>
            )}
          </div>

          {/* 手書き計算スペース（チャレンジの主役） */}
          <button
            onClick={() => setShowPad((v) => !v)}
            data-sfx="none"
            style={{
              width: "100%", marginTop: 12, padding: "10px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,.18)", cursor: "pointer",
              fontSize: 13, fontWeight: 800, color: "#fff",
              background: showPad ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.06)",
            }}
          >
            ✏️ 計算スペース{showPad ? "を閉じる" : "を開く"}
          </button>
          {showPad && <DrawPad key={padKey} height={440} />}
        </div>

        {/* 階級アップ演出 */}
        {rankUp != null && (
          <div onClick={() => setRankUp(null)} className="ch-rankup-bg">
            <div className="ch-rankup-card" onClick={(e) => e.stopPropagation()}>
              <div className="ch-rankup-icon">{rankUp.rank.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,.6)" }}>
                {rankUp.unit.name}　階級アップ！
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: rankUp.rank.color, margin: "2px 0 10px" }}>
                {rankUp.rank.name}
              </div>
              <button onClick={() => setRankUp(null)} data-sfx="none" style={{
                padding: "10px 24px", borderRadius: 11, border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 900, color: "#fff", background: rankUp.rank.color,
              }}>やった！</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============ 単元一覧（選択）ビュー ============
  const done = totalCleared(cleared);
  const mastered = masteredUnits(cleared);

  return (
    <div className="app">
      <Header player={player} back="ホーム" onBack={onHome} />
      <div className="content">
        <div className="pg-ttl">🗻 チャレンジ</div>
        <div className="pg-sub">単元ごとの難問に挑み、階級を上げよう。紙とペンで“本物の数学”を。</div>

        {/* 全体サマリー */}
        <div className="glass" style={{ padding: "14px 16px", display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{done}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>攻略した難問</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,.1)" }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: mastered > 0 ? "#f472b6" : "#fff" }}>
              {mastered}<span style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}> / {CHALLENGE_UNITS.length}</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>制覇した単元</div>
          </div>
        </div>

        {/* 単元別カード（それぞれに階級） */}
        {CHALLENGE_UNITS.map((unit) => {
          const c = clearedCount(unit, cleared);
          const total = unit.problems.length;
          const rank = unitRank(unit, cleared);
          const nxt = toNextRank(unit, cleared);
          const allDone = c >= total;
          return (
            <div key={unit.id} className="glass" style={{ padding: "12px 14px", borderLeft: `4px solid ${unit.color}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{unit.emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{unit.name}</span>
                </div>
                {/* 階級バッジ */}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 12, fontWeight: 900, color: rank.color,
                  background: `${rank.color}22`, border: `1px solid ${rank.color}66`,
                  borderRadius: 999, padding: "3px 10px",
                }}>
                  {rank.icon} {rank.name}
                </span>
              </div>

              {/* 進捗バー */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <div style={{ flex: 1, height: 7, borderRadius: 999, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
                  <div style={{ width: `${(c / total) * 100}%`, height: "100%", background: rank.color, borderRadius: 999, transition: "width .3s" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.55)" }}>{c}/{total}</span>
              </div>

              {/* 問題ボタン（難易度★つき） */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {unit.problems.map((p, i) => {
                  const ok = cleared[p.id];
                  return (
                    <button
                      key={p.id}
                      onClick={() => openProblem(unit, p)}
                      data-sfx="none"
                      style={{
                        flex: "1 1 30%", minWidth: 86, padding: "9px 6px", borderRadius: 11, cursor: "pointer",
                        fontSize: 12, fontWeight: 800, lineHeight: 1.35,
                        border: `2px solid ${ok ? "#4ade80" : "rgba(255,255,255,.15)"}`,
                        background: ok ? "rgba(74,222,128,.12)" : "rgba(255,255,255,.05)",
                        color: ok ? "#4ade80" : "#fff",
                      }}
                    >
                      {ok ? "✓ " : ""}問{i + 1}
                      <br />
                      <span style={{ fontSize: 10, color: ok ? "#4ade80" : "#fde047" }}>{LEVEL_LABEL[p.level]}</span>
                    </button>
                  );
                })}
              </div>

              {/* 次の階級への案内 */}
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 8 }}>
                {allDone
                  ? <span style={{ color: "#f472b6", fontWeight: 800 }}>👑 この単元を制覇！</span>
                  : nxt
                    ? <>あと <strong style={{ color: nxt.rank.color }}>{nxt.remain}問</strong> で <strong style={{ color: nxt.rank.color }}>{nxt.rank.name}</strong></>
                    : null}
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,.4)", textAlign: "center", lineHeight: 1.6 }}>
          ※ 各単元は、解いた難問の数で <strong>階級</strong> が上がります（全問クリアで👑マスター）。<br />
          頭の中だけでは解けない問題ばかり。計算スペースを使って挑もう。
        </div>
      </div>
    </div>
  );
}

const ghostBtn = {
  fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,.8)", cursor: "pointer",
  padding: "7px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,.18)",
  background: "rgba(255,255,255,.06)",
};
