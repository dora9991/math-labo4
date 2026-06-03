// ============================================================
// StepUp.jsx — ステップアップ（弱点克服）モード
//
// 数学ラボの世界観の中の「淡々と弱点を潰す」静かなモード。
//  - 時間制限なし・勝ち負けなし・自由入力（本人の実際の誤りを拾う）
//  - 裏で selector が「いちばん弱い／伸びしろのあるスキル」を選び、
//    期待正答率≈0.75 の難易度で1問ずつ出し続ける（アダプティブ）。
//  - 1問ごとに習熟度(skillStats)を Elo 更新。進捗は穏やかに可視化。
//
// コア（mastery/selector/generator/skills）はUIから分離。この画面は
// 「次の一問をもらって出す → 結果を返す」だけのつなぎ役。
// ============================================================
import { useState, useRef, useEffect } from "react";
import Header from "../components/Header.jsx";
import CharBubble, { voice } from "../components/CharBubble.jsx";
import * as sfx from "../audio/sfx.js";
import { buildTemplate } from "../engine/generator.js";
import { pickNext } from "../engine/selector.js";
import { isCorrect } from "../engine/scoring.js";
import { updateMastery, levelDifficulty, INITIAL_MASTERY, THETA } from "../engine/mastery.js";
import { skillName } from "../data/skills.js";

const todayStr = () => new Date().toLocaleDateString("ja-JP");
const LEVEL_LABEL = { easy: "かんたん", standard: "ふつう", advanced: "発展" };

export default function StepUp({ player, chapter, onAttempt, onHome, targetSkill = null }) {
  // 習熟度はローカルにも持ち、出題選定はこれを見る（保存はApp側にも反映）
  const statsRef = useRef({ ...(player?.skillStats || {}) });
  const lastIdRef = useRef(null);

  const [cur, setCur] = useState(null);      // { entry, problem }
  const [input, setInput] = useState("");
  const [locked, setLocked] = useState(false);
  const [fb, setFb] = useState(null);        // { ok, ans, h1, skill, mOld, mNew }
  const [seen, setSeen] = useState(0);
  const [got, setGot] = useState(0);
  const [improved, setImproved] = useState({}); // { skillId: delta>0 } このセッションで伸びたスキル
  const [msg, setMsg] = useState(() => voice("open"));
  const inputRef = useRef(null);

  // 次の一問を用意する
  function next() {
    const entry = pickNext(chapter, statsRef.current, {
      lastTemplateId: lastIdRef.current,
      targetSkill,
    });
    if (!entry) { setCur(null); return; }
    const unit = chapter.units.find((u) => u.id === entry.unitId);
    const problem = buildTemplate(unit, entry.level, entry.templateId);
    if (!problem) { setCur(null); return; }
    lastIdRef.current = entry.templateId;
    setCur({ entry, problem });
    setInput("");
    setLocked(false);
    setFb(null);
  }

  // 初回出題
  useEffect(() => { next(); /* eslint-disable-next-line */ }, []);
  // 出題のたびに入力欄へフォーカス
  useEffect(() => { if (cur && !fb) inputRef.current?.focus(); }, [cur, fb]);

  function submit() {
    if (!cur || locked || input === "") return;
    setLocked(true);
    const { entry, problem } = cur;
    const ok = isCorrect(input, problem.ans);
    const skill = entry.skill;
    const d = levelDifficulty(entry.level);
    const mOld = statsRef.current[skill]?.m ?? INITIAL_MASTERY;
    const mNew = updateMastery(mOld, d, ok ? 1 : 0);
    const nPrev = statsRef.current[skill]?.n ?? 0;

    // ローカル習熟度を更新（次の出題選定にすぐ反映）
    statsRef.current = {
      ...statsRef.current,
      [skill]: { m: mNew, n: nPrev + 1, last: todayStr() },
    };

    ok ? sfx.correct() : sfx.wrong();
    setSeen((s) => s + 1);
    if (ok) setGot((g) => g + 1);
    if (mNew > mOld + 0.001) setImproved((p) => ({ ...p, [skill]: true }));
    setMsg(ok ? voice("correct") : voice("wrong"));
    setFb({ ok, ans: problem.ans, h1: problem.h1, skill, mOld, mNew });

    // 結果をApp（保存層）へ
    onAttempt?.({
      skill,
      level: entry.level,
      templateId: entry.templateId,
      ok,
      q: problem.q,
      ans: problem.ans,
      userAns: input,
      mNew,
    });
  }

  function onKey(e) {
    if (e.key !== "Enter") return;
    if (fb) next();
    else submit();
  }

  // ── 問題が無い（スキル未タグ等）──
  if (!cur) {
    return (
      <div className="app">
        <Header player={player} back="ホーム" onBack={onHome} />
        <div className="content">
          <div className="glass">いま出せる問題が見つかりませんでした。</div>
        </div>
      </div>
    );
  }

  const { entry, problem } = cur;
  const curM = statsRef.current[entry.skill]?.m ?? INITIAL_MASTERY;
  const masteredPct = Math.round(curM * 100);
  const improvedList = Object.keys(improved);

  return (
    <div className="app">
      <Header player={player} back="ホーム" onBack={onHome} />
      <div className="content">
        <div className="pg-ttl">🌱 ステップアップ</div>
        <div className="pg-sub">あなたに合わせて、弱いところを少しずつ出します</div>

        <CharBubble text={msg} />

        {/* いま練習中のスキルと習熟度バー（穏やかな可視化） */}
        <div style={{ margin: "10px 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.55)", minWidth: 0 }}>
            いま：{skillName(entry.skill)}・{LEVEL_LABEL[entry.level]}
          </span>
        </div>
        <div style={{ height: 8, background: "rgba(255,255,255,.08)", borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
          <div style={{
            width: masteredPct + "%", height: "100%",
            background: curM >= THETA ? "#4ade80" : "#818cf8",
            transition: "width .5s ease",
          }} />
        </div>

        {/* 問題カード */}
        <div className="glass" style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 0.5, marginBottom: 16 }}>
            {problem.q}
          </div>

          {!fb ? (
            <>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                inputMode="text"
                placeholder="答えを入力（例：-5, 1/2）"
                data-sfx="none"
                style={{
                  width: "100%", boxSizing: "border-box", textAlign: "center",
                  fontSize: 20, fontWeight: 800, padding: "12px 10px",
                  borderRadius: 12, border: "2px solid rgba(255,255,255,.15)",
                  background: "rgba(255,255,255,.06)", color: "#fff", outline: "none",
                }}
              />
              <button
                onClick={submit}
                disabled={input === ""}
                data-sfx="none"
                style={{
                  width: "100%", marginTop: 12, padding: "13px", borderRadius: 12,
                  border: "none", cursor: input === "" ? "not-allowed" : "pointer",
                  fontSize: 16, fontWeight: 900, color: "#fff",
                  background: input === "" ? "rgba(129,140,248,.4)" : "#6366f1",
                }}
              >
                答える
              </button>
            </>
          ) : (
            <>
              <div style={{
                fontSize: 16, fontWeight: 900, marginBottom: 6,
                color: fb.ok ? "#4ade80" : "#f87171",
              }}>
                {fb.ok ? "◯ 正解！" : "△ おしい"}
              </div>
              {!fb.ok && (
                <div style={{ fontSize: 14, marginBottom: 6 }}>
                  正解：<strong style={{ color: "#4ade80" }}>{fb.ans}</strong>
                </div>
              )}
              {!fb.ok && fb.h1 && (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginBottom: 10 }}>💡 {fb.h1}</div>
              )}
              <button
                onClick={next}
                data-sfx="none"
                style={{
                  width: "100%", marginTop: 8, padding: "13px", borderRadius: 12,
                  border: "none", cursor: "pointer", fontSize: 16, fontWeight: 900,
                  color: "#fff", background: "#6366f1",
                }}
              >
                次へ →
              </button>
            </>
          )}
        </div>

        {/* セッションの穏やかな進捗 */}
        <div style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,.5)", textAlign: "center" }}>
          このセッション：{seen}問（◯{got}）
        </div>
        {improvedList.length > 0 && (
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {improvedList.map((s) => (
              <span key={s} style={{
                fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 10,
                background: "rgba(74,222,128,.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,.3)",
              }}>
                ↑ {skillName(s)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
