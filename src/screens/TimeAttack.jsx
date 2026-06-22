// ============================================================
// TimeAttack.jsx — タイムアタックモード（40秒・4択）
// 遊びの進行はこの画面が持ち、終了時に onComplete で結果を渡す（保存はApp）。
// ============================================================
import { useState, useEffect, useRef } from "react";
import Header from "../components/Header.jsx";
import Stars from "../components/Stars.jsx";
import DrawPad from "../components/DrawPad.jsx";
import { BigWord } from "../components/Decorations.jsx";
import * as bgm from "../audio/bgm.js";
import * as sfx from "../audio/sfx.js";
import { genProblemByStage, makeChoices } from "../engine/generator.js";
import { levelToStage, MAX_STAGE, STREAK_TO_LEVELUP, STAGE_LABEL } from "../engine/difficulty.js";
import { calcStars, timeAttackXp, timeAttackCoins, timeAttackStreakBonus, isCorrect, STAR_TARGET, XP_PENALTY_PER_WRONG, xpRepeatMultiplier } from "../engine/scoring.js";
import { getStars } from "../engine/progress.js";

const QUIZ_TIME = 40;
const todayStr = () => new Date().toLocaleDateString("ja-JP");

export default function TimeAttack({ player, chapter, unit, level, onComplete, onBackToMap, onHome }) {
  const startStage = levelToStage(level);
  const stageRef = useRef(startStage); // 出題中の難易度Lv（setTimeout内からも読むのでref）
  const [phase, setPhase] = useState("intro"); // intro | playing | finish | end
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [stage, setStage] = useState(startStage); // 表示用の難易度Lv（1〜5）
  const [levelUp, setLevelUp] = useState(false);   // 難易度アップの一瞬の表示
  const [showPad, setShowPad] = useState(false);   // 手書き計算スペースの開閉
  const [padKey, setPadKey] = useState(0);         // 問題が変わるたびに消す用
  const [q, setQ] = useState(() => genProblemByStage(unit, startStage));
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
    const streakBonus = timeAttackStreakBonus(results.map((r) => r.ok));
    const baseXp = timeAttackXp({ correct, wrong, stars, newStars, streakBonus });
    const mult = xpRepeatMultiplier(player.playLog, `${unit.id}-${level}`, todayStr());
    const xp = Math.round(baseXp * mult);
    const coins = timeAttackCoins({ correct, stars });
    setSummary({ xp, baseXp, mult, penalty: wrong * XP_PENALTY_PER_WRONG, coins });
    onComplete({ chapter, unit, level, correct, wrong, stars, maxStreak, xp, coins, results });
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
      // 5連続正解ごとに難易度を1段アップ（Lv5まで）
      if (ns > 0 && ns % STREAK_TO_LEVELUP === 0 && stageRef.current < MAX_STAGE) {
        stageRef.current += 1;
        setStage(stageRef.current);
        setLevelUp(true); setTimeout(() => setLevelUp(false), 1100);
      }
    } else {
      setWrong((w) => w + 1);
      sfx.wrong();
      setShakeAns(true); setTimeout(() => setShakeAns(false), 460); // 横揺れ
    }
    setResults((p) => [...p, { q: q.q, ans: q.ans, userAns: parseFloat(val), ok }]);
    setTimeout(() => {
      setLocked(false); setSelected(null);
      const nq = genProblemByStage(unit, stageRef.current, q.id);
      if (nq) { setQ(nq); setChoices(makeChoices(nq.ans)); setPadKey((k) => k + 1); }
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
                  {summary.coins > 0 && (
                    <span className="xp-pill" style={{ marginLeft: 6, background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#3a2a00" }}>
                      💰 +{summary.coins} コイン
                    </span>
                  )}
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
      {/* 難易度アップの一瞬の表示 */}
      {levelUp && (
        <div style={{ position: "fixed", top: "38%", left: 0, right: 0, textAlign: "center", zIndex: 60, pointerEvents: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#fbbf24", textShadow: "0 2px 14px rgba(251,191,36,.7)" }}>
            ⬆ 難易度アップ！Lv{stage}
          </span>
        </div>
      )}
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
        {/* 難易度Lv（5段階）と連続正解 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#a5b4fc" }}>
            難易度 Lv{stage}/{MAX_STAGE}・{STAGE_LABEL[stage]}
          </span>
          {streak >= 3 && <span style={{ color: "#fbbf24", fontWeight: 700, fontSize: 13 }}>🔥 {streak}連続！</span>}
        </div>
        {/* 次のLvまでのゲージ（5問で1段アップ） */}
        <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 10 }}>
          {Array.from({ length: STREAK_TO_LEVELUP }).map((_, i) => (
            <span key={i} style={{
              width: 22, height: 5, borderRadius: 3,
              background: i < streak % STREAK_TO_LEVELUP || (streak > 0 && streak % STREAK_TO_LEVELUP === 0)
                ? "linear-gradient(90deg,#818cf8,#6366f1)" : "rgba(255,255,255,.12)",
            }} />
          ))}
        </div>
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

        {/* 手書きの計算スペース（開閉式・問題が変わると消える） */}
        <button
          onClick={() => setShowPad((v) => !v)}
          data-sfx="none"
          style={{
            width: "100%", marginTop: 12, padding: "10px", borderRadius: 12,
            border: "1px solid rgba(255,255,255,.18)", cursor: "pointer",
            fontSize: 14, fontWeight: 800, color: "#fff",
            background: showPad ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.06)",
          }}
        >
          ✏️ 計算スペース{showPad ? "を閉じる" : "を開く"}
        </button>
        {showPad && <DrawPad key={padKey} height={260} />}
      </div>
    </div>
  );
}
