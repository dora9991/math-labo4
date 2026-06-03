// ============================================================
// Home.jsx — ホーム画面。モードを選ぶ入口。
// ============================================================
import { useState } from "react";
import Header from "../components/Header.jsx";
import CharBubble, { voice } from "../components/CharBubble.jsx";
import { MathBackdrop } from "../components/Decorations.jsx";
import Dashboard from "../components/Dashboard.jsx";

export default function Home({ player, records, mistakeCount, onTimeAttack, onSlow, onBattle, onStepUp, onNotebook }) {
  const [msg] = useState(() => voice("open"));
  return (
    <div className="app">
      <MathBackdrop />
      <Header player={player} />
      <div className="content" style={{ position: "relative", zIndex: 1 }}>
        <CharBubble text={msg} />

        <div className="mode-grid">
          <button className="mode-card mta" onClick={onTimeAttack}>
            <span style={{ fontSize: 36 }}>⏱️</span>
            <span style={{ fontSize: 15, fontWeight: 900 }}>タイムアタック</span>
            <span style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>40秒で何問解ける？<br />スピード勝負！</span>
          </button>
          <button className="mode-card msl" onClick={onSlow}>
            <span style={{ fontSize: 36 }}>🌱</span>
            <span style={{ fontSize: 15, fontWeight: 900 }}>じっくりモード</span>
            <span style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>時間なし・ヒントあり<br />丁寧に学ぼう！</span>
          </button>
          <button className="mode-card mba" onClick={onBattle}>
            <span style={{ fontSize: 36 }}>⚔️</span>
            <span style={{ fontSize: 15, fontWeight: 900 }}>バトルモード</span>
            <span style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>モンスターと対戦！</span>
          </button>
          <button className="mode-card mut" onClick={onStepUp}>
            <span style={{ fontSize: 36 }}>🌱</span>
            <span style={{ fontSize: 15, fontWeight: 900 }}>ステップアップ</span>
            <span style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>弱点をあなたに合わせて<br />少しずつ克服！</span>
          </button>
        </div>

        <button className="nb-btn" onClick={onNotebook}>
          📓 間違いノート
          {mistakeCount > 0 && <span className="nb-badge">{mistakeCount}</span>}
        </button>

        {/* 学習ダッシュボード */}
        <Dashboard player={player} records={records || []} />
      </div>
    </div>
  );
}
