// ============================================================
// Battle.jsx — モンスターと4択クイズで戦う画面
//  正解 → モンスターにダメージ＋中央に光る◯＋コンボ
//  不正解・時間切れ → 解答欄が左右に高速で揺れる＋被ダメ（赤フラッシュ・画面揺れ）
//  問題は単元テスト級（標準・発展）。HP0で勝敗が決まる。
// ============================================================
import { useState, useEffect, useRef } from "react";
import MonsterSprite from "../components/MonsterSprite.jsx";
import { BigWord, StarField } from "../components/Decorations.jsx";
import * as bgm from "../audio/bgm.js";
import * as sfx from "../audio/sfx.js";
import { getPlayerBattleStats, calcDamage, genBattleProblem } from "../engine/battle.js";
import { isCorrect, levelFromXp } from "../engine/scoring.js";

export default function Battle({ player, monster, onResult, onExit }) {
  const lv = levelFromXp(player.xp);
  const stats = useRef(getPlayerBattleStats(lv)).current;

  const [playerHp, setPlayerHp] = useState(stats.maxHp);
  const [monsterHp, setMonsterHp] = useState(monster.hp);
  const [q, setQ] = useState(() => genBattleProblem(monster));
  const [timer, setTimer] = useState(stats.timer);
  const [combo, setCombo] = useState(0);
  const [phase, setPhase] = useState("intro"); // intro | fight | win | lose
  const [input, setInput] = useState("");      // 文字入力の答え
  const [locked, setLocked] = useState(false);
  const [monState, setMonState] = useState("idle");
  const [animKey, setAnimKey] = useState(0);
  const [log, setLog] = useState(`${monster.name} があらわれた！`);

  // 視覚効果
  const [showRing, setShowRing] = useState(false);   // 正解の◯
  const [shakeAns, setShakeAns] = useState(false);   // 不正解の解答欄ゆれ
  const [hurt, setHurt] = useState(false);           // 被ダメ（赤＋画面ゆれ）
  const [monDmg, setMonDmg] = useState(null);        // モンスターのダメージ数字
  const [dmgKey, setDmgKey] = useState(0);
  const [deadParticles, setDeadParticles] = useState([]);

  // 安定参照（タイマーから最新処理を呼ぶ）
  const lockedRef = useRef(false);
  const phaseRef = useRef("intro");
  const timerRef = useRef(stats.timer);
  const actionsRef = useRef({});
  const inputRef = useRef(null);
  // 新しい問題になったら（ロック解除中は）入力欄にフォーカス
  useEffect(() => { if (!locked && phaseRef.current === "fight") inputRef.current?.focus(); }, [q, locked]);

  const setTimerBoth = (v) => { timerRef.current = v; setTimer(v); };

  // 毎秒のカウントダウン（ロック中・戦闘終了中は止める）
  useEffect(() => {
    const id = setInterval(() => {
      if (phaseRef.current !== "fight" || lockedRef.current) return;
      const next = timerRef.current - 1;
      if (next <= 0) { setTimerBoth(stats.timer); actionsRef.current.miss?.(); }
      else setTimerBoth(next);
    }, 1000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line

  function nextQuestion() {
    setQ((cur) => genBattleProblem(monster, cur?.id));
    setInput("");
    setLocked(false); lockedRef.current = false;
    setTimerBoth(stats.timer);
  }

  function triggerWin() {
    setPhase("win"); phaseRef.current = "win";
    bgm.play("victory", { loop: false });
    setMonState("dead"); setAnimKey((k) => k + 1);
    const parts = Array.from({ length: 16 }, (_, i) => {
      const ang = (i * (360 / 16)) * Math.PI / 180;
      const r = 50 + Math.random() * 60;
      return {
        i, size: 6 + Math.random() * 9,
        color: monster.deathColors[i % monster.deathColors.length],
        tx: Math.cos(ang) * r, ty: Math.sin(ang) * r, rot: Math.random() * 360,
        round: Math.random() > 0.5,
      };
    });
    setDeadParticles(parts);
    setLog(`${monster.name} をたおした！✨ +${monster.reward}XP`);
    setTimeout(() => onResult(true), 1500);
  }

  function triggerLose() {
    setPhase("lose"); phaseRef.current = "lose";
    bgm.play("defeat", { loop: false });
    setLog("あなたはたおれてしまった…💀");
    setTimeout(() => onResult(false), 1200);
  }

  // 被ダメ共通（不正解・時間切れ）
  function takeHit(reason) {
    setCombo(0);
    setShakeAns(true); setTimeout(() => setShakeAns(false), 460);
    setHurt(true); setTimeout(() => setHurt(false), 520);
    setMonState("attack"); setAnimKey((k) => k + 1);
    setLog(`${reason} ${monster.name} の攻撃！ -${monster.atk}`);
    setPlayerHp((hp) => {
      const nv = Math.max(0, hp - monster.atk);
      if (nv <= 0) setTimeout(triggerLose, 500);
      return nv;
    });
  }

  function answer(val) {
    if (locked || phaseRef.current !== "fight" || !q || val === "" || val == null) return;
    setLocked(true); lockedRef.current = true;
    const ok = isCorrect(val, q.ans);

    if (ok) {
      sfx.correct();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const dmg = calcDamage(stats.atk, newCombo);
      setShowRing(true); setTimeout(() => setShowRing(false), 700);
      setMonState("damage"); setAnimKey((k) => k + 1);
      setMonDmg(`-${dmg}`); setDmgKey((k) => k + 1);
      setLog(newCombo >= 3 ? `正解！🔥${newCombo}コンボ ${dmg}ダメージ！` : `正解！${dmg}ダメージ！`);
      setMonsterHp((hp) => {
        const nv = Math.max(0, hp - dmg);
        if (nv <= 0) setTimeout(triggerWin, 350);
        else setTimeout(() => { setMonState("idle"); nextQuestion(); }, 700);
        return nv;
      });
    } else {
      sfx.wrong();
      takeHit(`不正解…(正解 ${q.ans})`);
      setTimeout(() => { if (phaseRef.current === "fight") { setMonState("idle"); nextQuestion(); } }, 950);
    }
  }

  // 時間切れ＝ミス（タイマーから呼ばれる。最新版を毎レンダー登録）
  actionsRef.current.miss = () => {
    if (lockedRef.current || phaseRef.current !== "fight") return;
    setLocked(true); lockedRef.current = true;
    sfx.wrong();
    takeHit("⏰時間切れ！");
    setTimeout(() => { if (phaseRef.current === "fight") { setMonState("idle"); nextQuestion(); } }, 850);
  };

  const monHpPct = Math.max(0, (monsterHp / monster.hp) * 100);
  const plHpPct = Math.max(0, (playerHp / stats.maxHp) * 100);
  const timePct = (timer / stats.timer) * 100;
  const hpColor = (p) => (p > 50 ? "linear-gradient(90deg,#00cc44,#00ff88)" : p > 25 ? "linear-gradient(90deg,#cc9900,#ffcc00)" : "linear-gradient(90deg,#cc2200,#ff4400)");

  // ---- 勝敗画面 ----
  if (phase === "win" || phase === "lose") {
    const win = phase === "win";
    return (
      <div className="battle-app">
        <StarField />
        <div className="bt-moon" />
        <div className="battle-ground" />
        <div className="battle-content" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <div style={{ fontSize: 64 }}>{win ? "🎉" : "💀"}</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: win ? "#7fff7f" : "#ff6b6b", textShadow: win ? "0 0 18px #00ff88" : "none" }}>
            {win ? "勝利！" : "敗北…"}
          </div>
          <div style={{ fontSize: 13, color: "#cceebb", margin: "6px 0 14px" }}>
            {win ? `${monster.name} をたおした！ +${monster.reward}XP を獲得！` : `${monster.name} に やられてしまった…`}
          </div>
          {!win && <div style={{ fontSize: 12, color: "#88aa88", marginBottom: 14, maxWidth: 300 }}>💡 XPを貯めてレベルを上げると、HP・攻撃力・考える時間が増えて有利になります。</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="bt-choice" style={{ padding: "12px 18px" }} onClick={onExit}>👾 相手を選ぶ</button>
            <button className="bt-choice" style={{ padding: "12px 18px", borderColor: "#7fff7f" }} onClick={() => onResult("retry")}>🔁 もう一度</button>
          </div>
        </div>
      </div>
    );
  }

  // ---- 戦闘中 ----
  return (
    <div className={"battle-app" + (hurt ? " bt-screen-shake" : "")}>
      <div className="encounter-flash" />
      {phase === "intro" && <BigWord text="START!" color="#7fff7f" onDone={() => { phaseRef.current = "fight"; setPhase("fight"); }} />}
      <StarField />
      <div className="bt-moon" />
      {hurt && <div className="bt-damage-overlay show" />}
      <div className="battle-ground" />
      <div className="battle-content">
        {/* 敵ステータス */}
        <div className="bt-panel">
          <span className="bt-enemy-name" style={{ color: monster.color }}>{monster.name}</span>
          <span className="bt-enemy-theme">【{monster.unit}】</span>
          <div className="bt-hp-row">
            <span className="bt-hp-label">HP</span>
            <div className="bt-hp-track"><div className="bt-hp-fill" style={{ width: monHpPct + "%", background: hpColor(monHpPct) }} /></div>
            <span className="bt-hp-num">{Math.max(0, monsterHp)} / {monster.hp}</span>
          </div>
        </div>

        {/* モンスター舞台 */}
        <div className="bt-stage">
          {monDmg && <div key={dmgKey} className="mon-dmg-num show">{monDmg}</div>}
          {showRing && <><div className="correct-ring show" /><div className="correct-flash show" /></>}
          <MonsterSprite monster={monster} state={monState} animKey={animKey} />
          {deadParticles.length > 0 && (
            <div className="bt-particles">
              {deadParticles.map((p) => (
                <div key={p.i} className="bt-dp burst" style={{
                  width: p.size, height: p.size, background: p.color,
                  borderRadius: p.round ? "50%" : "2px",
                  "--tx": p.tx + "px", "--ty": p.ty + "px", "--r": p.rot + "deg",
                  animationDelay: p.i * 0.03 + "s",
                }} />
              ))}
            </div>
          )}
        </div>

        {/* タイマー＋コンボ */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#88aa88" }}>のこり</span>
          <div className="bt-timer-track" style={{ flex: 1 }}>
            <div className="bt-timer-fill" style={{ width: timePct + "%", background: timer > stats.timer * 0.4 ? "#4ade80" : timer > stats.timer * 0.2 ? "#fbbf24" : "#f87171" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#cceebb", minWidth: 28, textAlign: "right" }}>{timer}</span>
          {combo >= 2 && <span className="bt-combo">🔥{combo}</span>}
        </div>

        {/* 問題＋文字入力 */}
        <div className="bt-q-panel">
          {q ? (
            <>
              <span className="bt-q-theme">{q.unitName} ・ {q.level === "advanced" ? "発展" : "標準"}</span>
              <div className="bt-q-text">{q.q}</div>
              <div className={"ans-row" + (shakeAns ? " answer-shake" : "")}>
                <input
                  ref={inputRef} className="ans-in" type="number" inputMode="decimal" value={input}
                  disabled={locked}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") answer(input); }}
                  placeholder="答えを入力…"
                />
                <button className="ok-btn" data-sfx="none" disabled={locked || input === ""} onClick={() => answer(input)}>⚔️</button>
              </div>
            </>
          ) : <div style={{ color: "#cceebb" }}>問題を準備中…</div>}
        </div>

        {/* バトルログ */}
        <div className="bt-panel bt-log"><span className="new">{log}</span></div>

        {/* プレイヤー */}
        <div className="bt-panel bt-player">
          <span className="bt-player-name">あなた（Lv.{lv}）</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#7fff7f", fontSize: 12 }}>
            HP {Math.max(0, playerHp)}/{stats.maxHp}
            <div className="bt-hp-track" style={{ width: 110 }}><div className="bt-hp-fill" style={{ width: plHpPct + "%", background: hpColor(plHpPct) }} /></div>
          </div>
        </div>

        <button className="back-btn" style={{ alignSelf: "center" }} onClick={onExit}>← にげる</button>
      </div>
    </div>
  );
}
