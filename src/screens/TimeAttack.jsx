// ============================================================
// TimeAttack.jsx — タイムアタックモード（40秒・4択）
// 遊びの進行はこの画面が持ち、終了時に onComplete で結果を渡す（保存はApp）。
// ============================================================
import { useState, useEffect, useRef } from "react";
import Header from "../components/Header.jsx";
import Stars from "../components/Stars.jsx";
import { BigWord } from "../components/Decorations.jsx";
import * as bgm from "../audio/bgm.js";
import * as sfx from "../audio/sfx.js";
import { genProblem, makeChoices } from "../engine/generator.js";
import { calcStars, timeAttackXp, isCorrect, STAR_TARGET, XP_PENALTY_PER_WRONG, xpRepeatMultiplier } from "../engine/scoring.js";
import { getStars } from "../engine/progress.js";

const QUIZ_TIME = 40;
const todayStr = () => new Date().toLocaleDateString("ja-JP");

export default function TimeAttack({ player, chapter, unit, level, onComplete, onBackToMap, onHome }) {
  const [phase, setPhase] = useState("intro"); // intro | playing | finish | end
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [q, setQ] = useState(() => genProblem(unit, level));
  const [choices, setChoices] = useState(() => []);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [showRing, setShowRing] = useState(false); // 正解の光る◯
  const [shakeAns, setShakeAns] = useState(false); // 不正解の横揺れ
  const [summary, setSummary] = useState(null);    // 結果のXP内訳
  const savedRef = useRef(false);

  // 最初の問題の選択肢を用意
  useEffect(() => { if (q) setChoices(makeChoices(q.ans)); }, []); // eslint-disable-line

  // カウントダウン
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); setPhase("finish"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // 終了の合図でジングルを鳴らす
  useEffect(() => { if (phase === "finish") bgm.play("timeattack_end", { loop: false }); }, [phase]);

  // 終了時に1回だけ結果を保存
  useEffect(() => {
    if (phase !== "end" || savedRef.current) return;
    savedRef.current = true;
    const stars = calcStars(correct, level);
    const prevStars = getStars(player, unit.id, level);
    const newStars = Math.max(0, stars - prevStars);
    const baseXp = timeAttackXp({ correct, wrong, stars, newStars, maxStreak });
    const mult = xpRepeatMultiplier(player.playLog, `${unit.id}-${level}`, todayStr());
    const xp = Math.round(baseXp * mult);
    setSummary({ xp, baseXp, mult, penalty: wrong * XP_PENALTY_PER_WRONG });
    onComplete({ chapter, unit, level, correct, wrong, stars, maxStreak, xp, results });
  }, [phase]); // eslint-disable-line

  function answer(val, idx) {
    if (!q || locked || phase !== "playing") return;
    const ok = isCorrect(val, q.ans);
    setSelected(idx);
    setLocked(true);
    const ns = ok ? streak + 1 : 0;
    setStreak(ns);
    setMaxStreak((m) => Math.max(m, ns));
    if (ok) {
      setCorrect((c) => c + 1);
      sfx.correct();
      setShowRing(true); setTimeout(() => setShowRing(false), 700); // 光る◯
    } else {
      setWrong((w) => w + 1);
      sfx.wrong();
      setShakeAns(true); setTimeout(() => setShakeAns(false), 460); // 横揺れ
    }
    setResults((p) => [...p, { q: q.q, ans: q.ans, userAns: parseFloat(val), ok }]);
    setTimeout(() => {
      setLocked(false); setSelected(null);
      const nq = genProblem(unit, level, q.id);
      if (nq) { setQ(nq); setChoices(makeChoices(nq.ans)); }
    }, ok ? 350 : 650);
  }

  // ---- 結果画面 ----
  if (phase === "end") {
    const stars = calcStars(correct, level);
    const t = STAR_TARGET[level];
    return (
      <div className="app">
        <Header player={player} />
        <div className="content">
          <div className="res-card">
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div className="big-n" style={{ color: "#4f46e5" }}>{correct}</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>問正解 / {correct + wrong}問（40秒）</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b", marginTop: 4 }}>
                {stars === 3 ? "🎉 パーフェクト！" : stars >= 1 ? "✅ クリア！" : "😊 もう少し！"}
              </div>
              <div style={{ marginTop: 7 }}><Stars count={stars} size={24} /></div>
              {summary && (
                <div style={{ marginTop: 9 }}>
                  <span className="xp-pill">✨ +{summary.xp} XP</span>
                  {summary.mult < 1 && (
                    <div style={{ fontSize: 11, color: "#92400e", fontWeight: 700, marginTop: 5 }}>
                      {summary.mult === 0.5 ? "今日2回目以降のためXP½" : "クリア済みの再挑戦のためXP⅕"}（通常なら{summary.baseXp}XP）
                    </div>
                  )}
                  {summary.penalty > 0 && (
                    <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 700, marginTop: 5 }}>
                      ミス{wrong}問で −{summary.penalty}XP（間違い1問につき2問分マイナス）
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="stats-grid">
              <div className="stat-box"><div className="stat-n" style={{ color: "#16a34a" }}>{correct}</div><div className="stat-l">正解</div></div>
              <div className="stat-box"><div className="stat-n" style={{ color: "#dc2626" }}>{wrong}</div><div className="stat-l">ミス</div></div>
              <div className="stat-box"><div className="stat-n" style={{ color: "#d97706" }}>{maxStreak}</div><div className="stat-l">最大連続</div></div>
            </div>
            <div style={{ textAlign: "center", marginBottom: 6, fontSize: 11, color: "#94a3b8" }}>
              目標：⭐{t.s1}問 ⭐⭐{t.s2}問 ⭐⭐⭐{t.s3}問
            </div>
            <div className="res-acts">
              <button className="rbtn s" onClick={onBackToMap}>🗺️ 単元へ</button>
              <button className="rbtn p" onClick={onHome}>🏠 ホーム</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- プレイ中 ----
  if (!q) {
    return (
      <div className="app">
        <Header player={player} back="戻る" onBack={onBackToMap} />
        <div className="content"><div className="glass">この単元の問題が見つかりませんでした。</div></div>
      </div>
    );
  }

  return (
    <div className="app">
      {phase === "intro" && <BigWord text="START!" color="#4ade80" onDone={() => setPhase("playing")} />}
      {phase === "finish" && <BigWord text="終了！" color="#fbbf24" onDone={() => setPhase("end")} />}
      {/* 正解：画面全体のやわらかい閃光（◯は選択肢の中央に出す） */}
      {showRing && <div className="correct-flash show" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 55 }} />}
      <Header player={player} back="やめる" onBack={onBackToMap} />
      <div className="content">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontFamily: "'M PLUS Rounded 1c',sans-serif", fontSize: 40, fontWeight: 900, color: timeLeft > 16 ? "#4ade80" : timeLeft > 8 ? "#fb923c" : "#f87171" }}>
            {timeLeft}<span style={{ fontSize: 14 }}>秒</span>
          </div>
          <div style={{ display: "flex", gap: 9 }}>
            <div className="stat-box" style={{ background: "rgba(255,255,255,.06)" }}>
              <div className="stat-n" style={{ color: "#4ade80" }}>{correct}</div><div className="stat-l" style={{ color: "rgba(255,255,255,.4)" }}>正解</div>
            </div>
            <div className="stat-box" style={{ background: "rgba(255,255,255,.06)" }}>
              <div className="stat-n" style={{ color: "#f87171" }}>{wrong}</div><div className="stat-l" style={{ color: "rgba(255,255,255,.4)" }}>ミス</div>
            </div>
          </div>
        </div>
        {streak >= 3 && <div style={{ textAlign: "center", color: "#fbbf24", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>🔥 {streak}連続！</div>}
        <div className="qcard">
          <span className="q-pill">{unit.name}</span>
          <div className="q-text">{q.q}</div>
          {/* 選択肢の中央に◯が出るよう relative で包む */}
          <div style={{ position: "relative" }}>
            {showRing && <div className="correct-ring show" />}
            <div className={"choices-grid" + (shakeAns ? " answer-shake" : "")}>
              {choices.map((c, i) => {
                const isAns = isCorrect(c, q.ans);
                let cls = "choice-btn";
                if (locked) {
                  if (i === selected && !isAns) cls += " wrong";
                  else if (isAns) cls += i === selected ? " correct" : " reveal";
                }
                return (
                  <button key={i} className={cls} data-sfx="none" disabled={locked} onClick={() => answer(c, i)}>{c}</button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
