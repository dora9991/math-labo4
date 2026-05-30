// ============================================================
// App.jsx — アプリ全体のまとめ役（薄く保つ）
//  - 保存データ(player/records/mistakes)を読み込んで持つ
//  - 画面の切り替え（ルーティング）
//  - XP加算・星保存・結果保存などの「データ更新」を一手に引き受ける
// ゲームのルールは engine/ に、問題は data/ に、保存は store/ にあるので、
// このファイルは「つなぐだけ」。
// ============================================================
import { useState, useEffect } from "react";
import * as store from "./store/localStore.js"; // ★将来ここを supabase.js に差し替える
import { makeRecord, makeMistake } from "./store/recordSchema.js";
import { levelFromXp } from "./engine/scoring.js";
import * as bgm from "./audio/bgm.js";
import * as sfx from "./audio/sfx.js";

import StartScreen from "./screens/StartScreen.jsx";
import TitleScreen from "./screens/TitleScreen.jsx";
import AudioToggle from "./components/AudioToggle.jsx";
import LevelUpOverlay from "./components/LevelUpOverlay.jsx";
import Home from "./screens/Home.jsx";
import ChapterSelect from "./screens/ChapterSelect.jsx";
import TimeAttack from "./screens/TimeAttack.jsx";
import SlowMode from "./screens/SlowMode.jsx";
import Notebook from "./screens/Notebook.jsx";
import BattleSelect from "./screens/BattleSelect.jsx";
import Battle from "./screens/Battle.jsx";
import UnitTestSelect from "./screens/UnitTestSelect.jsx";
import UnitTest from "./screens/UnitTest.jsx";

const todayStr = () => new Date().toLocaleDateString("ja-JP");

export default function App() {
  const [data, setData] = useState(() => store.load());
  const [screen, setScreen] = useState("start");
  const [mode, setMode] = useState("timeAttack"); // どのモードで章選択に来たか
  const [sel, setSel] = useState({ chapter: null, unit: null, level: null });
  const [battleMonster, setBattleMonster] = useState(null); // 選択中のモンスター
  const [battleKey, setBattleKey] = useState(0); // 「もう一度」で戦闘をやり直す用
  const [utChapter, setUtChapter] = useState(null); // 単元テストの対象章
  const [levelUpTo, setLevelUpTo] = useState(null); // レベルアップ演出（上がった先のレベル）

  // player を更新して保存する共通関数
  function updatePlayer(updater) {
    setData((d) => {
      const player = store.savePlayerState(updater(d.player));
      return { ...d, player };
    });
  }

  // XPを加算（同時に連続学習日数も更新）。レベルが上がったら演出を出す。
  function addXp(gain) {
    updatePlayer((p) => {
      const isNewDay = p.lastDate !== todayStr();
      const before = levelFromXp(p.xp);
      const after = levelFromXp(p.xp + gain);
      if (after > before) {
        sfx.levelUp();
        // 結果画面のXP表示が見えてから出す（少し遅延）
        setTimeout(() => setLevelUpTo(after), 900);
      }
      return {
        ...p,
        xp: p.xp + gain,
        streaks: isNewDay ? p.streaks + 1 : p.streaks,
        lastDate: todayStr(),
      };
    });
  }

  // タイムアタック1回の結果を保存
  function saveTimeAttackResult({ chapter, unit, level, correct, wrong, stars, maxStreak, xp, results }) {
    const sid = data.player.studentId;
    // 1) 記録を追加
    store.addRecord(makeRecord({
      studentId: sid, mode: "timeAttack",
      chapterId: chapter.id, unitId: unit.id, level,
      correct, wrong, stars, xp, maxStreak,
    }));
    // 2) 星と「くり返しXP用の履歴(playLog)」を更新
    updatePlayer((p) => {
      const key = `${unit.id}-${level}`;
      const prevLog = (p.playLog && p.playLog[key]) || {};
      return {
        ...p,
        stars: { ...p.stars, [key]: Math.max(p.stars[key] || 0, stars) },
        playLog: { ...(p.playLog || {}), [key]: { cleared: prevLog.cleared || stars >= 1, lastDate: todayStr() } },
      };
    });
    // 3) 間違いを間違いノートへ
    const mistakes = results.filter((r) => !r.ok).slice(0, 3).map((r) =>
      makeMistake({ studentId: sid, chapterId: chapter.id, unitId: unit.id, level, q: r.q, ans: r.ans })
    );
    const newMistakes = store.addMistakes(mistakes);
    setData((d) => ({ ...d, records: store.load().records, mistakes: newMistakes }));
    // 4) XP加算
    addXp(xp);
  }

  // じっくりモードのクリア結果を保存
  function saveSlowResult({ chapter, unit, level, streak, total, correct, xp }) {
    store.addRecord(makeRecord({
      studentId: data.player.studentId, mode: "slow",
      chapterId: chapter.id, unitId: unit.id, level,
      correct, wrong: total - correct, xp, maxStreak: streak,
    }));
    // くり返しXP用の履歴を更新（じっくりは到達＝クリア）
    updatePlayer((p) => {
      const key = `${unit.id}-${level}`;
      return { ...p, playLog: { ...(p.playLog || {}), [key]: { cleared: true, lastDate: todayStr() } } };
    });
    setData((d) => ({ ...d, records: store.load().records }));
    addXp(xp);
  }

  // 単元テストの結果を保存
  function saveUnitTestResult({ chapter, answers, correct, total, xp }) {
    const sid = data.player.studentId;
    store.addRecord(makeRecord({
      studentId: sid, mode: "unitTest", chapterId: chapter.id,
      correct, wrong: total - correct, xp,
    }));
    const mistakes = answers.filter((a) => !a.ok).slice(0, 6).map((a) =>
      makeMistake({ studentId: sid, chapterId: chapter.id, unitId: a.unitId, level: a.level, q: a.q, ans: a.ans })
    );
    const newMistakes = store.addMistakes(mistakes);
    setData((d) => ({ ...d, records: store.load().records, mistakes: newMistakes }));
    addXp(xp);
  }

  function removeNote(id) {
    const mistakes = store.removeMistake(id);
    setData((d) => ({ ...d, mistakes }));
  }

  // バトルの結果。true=勝利, false=敗北, "retry"=やり直し
  function handleBattleResult(outcome) {
    if (outcome === "retry") { setBattleKey((k) => k + 1); return; }
    if (!battleMonster) return;
    const win = outcome === true;
    store.addRecord(makeRecord({
      studentId: data.player.studentId, mode: "battle",
      xp: win ? battleMonster.reward : 0,
      extra: { monsterId: battleMonster.id, result: win ? "win" : "lose" },
    }));
    setData((d) => ({ ...d, records: store.load().records }));
    if (win) addXp(battleMonster.reward);
  }

  // 効果音：ボタンのクリック（決定/戻る）を全体で拾う（ホバーの移動音は無し）
  //  ・回答ボタン等は data-sfx="none" を付け、各画面で正解/不正解音を鳴らす
  //  ・戻る系（.back-btn / data-sfx="back"）は戻る音
  useEffect(() => {
    const click = (e) => {
      const b = e.target.closest("button");
      if (!b || b.dataset.sfx === "none") return;
      if (b.classList.contains("back-btn") || b.dataset.sfx === "back") sfx.back();
      else sfx.confirm();
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);

  // 画面に合わせてBGMを切り替える（勝利/敗北/タイムアタック終了は各画面で再生）
  useEffect(() => {
    if (screen === "start") { bgm.stop(); return; }
    if (screen === "title") { bgm.play("op"); return; }
    if (screen === "timeAttack") { bgm.play("timeattack"); return; }
    if (screen === "slow") { bgm.play("slow"); return; }
    if (screen === "unitTest") { bgm.play(utChapter ? "unittest" : "menu"); return; }
    if (screen === "battle") {
      if (battleMonster) bgm.play(battleMonster.minLv >= 7 ? "boss" : "battle");
      else bgm.play("menu");
      return;
    }
    bgm.play("menu"); // home / chapter / notebook など
  }, [screen, battleMonster, utChapter, battleKey]);

  // 画面の振り分け
  const goChapter = (m) => { setMode(m); setScreen("chapter"); };

  const renderScreen = () => {
  if (screen === "start") {
    return <StartScreen onStart={() => setScreen("title")} />;
  }

  if (screen === "title") {
    return <TitleScreen onEnter={() => setScreen("home")} />;
  }

  if (screen === "chapter") {
    return (
      <ChapterSelect
        player={data.player}
        mode={mode}
        onStart={(chapter, unit, level) => {
          setSel({ chapter, unit, level });
          setScreen(mode); // "timeAttack" など
        }}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "timeAttack" && sel.unit) {
    return (
      <TimeAttack
        player={data.player}
        chapter={sel.chapter}
        unit={sel.unit}
        level={sel.level}
        onComplete={saveTimeAttackResult}
        onBackToMap={() => setScreen("chapter")}
        onHome={() => setScreen("home")}
      />
    );
  }

  if (screen === "slow" && sel.unit) {
    return (
      <SlowMode
        player={data.player}
        chapter={sel.chapter}
        unit={sel.unit}
        level={sel.level}
        onComplete={saveSlowResult}
        onBackToMap={() => setScreen("chapter")}
        onHome={() => setScreen("home")}
      />
    );
  }

  if (screen === "notebook") {
    return <Notebook mistakes={data.mistakes} onRemove={removeNote} onBack={() => setScreen("home")} />;
  }

  // バトルモード：相手選択 → 戦闘
  if (screen === "battle") {
    if (!battleMonster) {
      return (
        <BattleSelect
          player={data.player}
          onSelect={(m) => { setBattleMonster(m); setBattleKey((k) => k + 1); }}
          onBack={() => setScreen("home")}
        />
      );
    }
    return (
      <Battle
        key={battleKey}
        player={data.player}
        monster={battleMonster}
        onResult={handleBattleResult}
        onExit={() => setBattleMonster(null)}
      />
    );
  }

  // 単元テスト：章選択 → テスト
  if (screen === "unitTest") {
    if (!utChapter) {
      return <UnitTestSelect player={data.player} onStart={(c) => setUtChapter(c)} onBack={() => setScreen("home")} />;
    }
    return (
      <UnitTest
        key={utChapter.id}
        player={data.player}
        chapter={utChapter}
        onComplete={saveUnitTestResult}
        onBack={() => setUtChapter(null)}
      />
    );
  }

  // ホーム
  return (
    <Home
      player={data.player}
      records={data.records}
      mistakeCount={data.mistakes.length}
      onTimeAttack={() => goChapter("timeAttack")}
      onSlow={() => goChapter("slow")}
      onBattle={() => setScreen("battle")}
      onUnitTest={() => setScreen("unitTest")}
      onNotebook={() => setScreen("notebook")}
    />
  );
  };

  return (
    <>
      <div key={screen} className={"screen-anim" + (screen === "battle" ? " is-battle" : "")}>
        {renderScreen()}
      </div>
      {screen !== "start" && <AudioToggle />}
      {levelUpTo && <LevelUpOverlay level={levelUpTo} onDone={() => setLevelUpTo(null)} />}
    </>
  );
}
