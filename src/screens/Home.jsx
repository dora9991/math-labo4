// ============================================================
// Home.jsx — ホーム画面。モードを選ぶ入口。
// ============================================================
import { useState } from "react";
import Header from "../components/Header.jsx";
import CharBubble, { voice } from "../components/CharBubble.jsx";
import { MathBackdrop } from "../components/Decorations.jsx";
import Dashboard from "../components/Dashboard.jsx";
import { findItem } from "../engine/items.js";

const itemName = (id) => findItem(id)?.name ?? "";

export default function Home({ player, records, mistakeCount, onTimeAttack, onChallenge, onBattle, onStepUp, onNotebook, onShop, onSkill, onDetail, onHowTo, onCharacter }) {
  const [msg] = useState(() => voice("open"));
  // 夜（21時〜翌5時）はモンスターも寝る時間。無理に進めさせず、おやすみをそっと促す。
  const hour = new Date().getHours();
  const night = hour >= 21 || hour < 5;
  const greeting = night
    ? (player.name ? `${player.name}、おそくまでおつかれさま。` : "おそくまでおつかれさま。")
    : (player.name ? `${player.name}、${msg}` : msg);
  return (
    <div className="app">
      <MathBackdrop />
      <Header player={player} />
      <div className="content" style={{ position: "relative", zIndex: 1 }}>
        <CharBubble text={greeting} avatar={player.avatar} onAvatar={onCharacter} />

        {/* おやすみ：夜はモンスターも寝はじめる。やめても責めない、休む許可を出す */}
        {night && (
          <div className="glass" style={{
            padding: "12px 14px", marginBottom: 11, display: "flex", gap: 10,
            alignItems: "center", border: "1px solid rgba(129,140,248,.3)",
          }}>
            <span style={{ fontSize: 28 }}>😴</span>
            <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "rgba(255,255,255,.82)" }}>
              もう{hour}時。モンスターたちも寝はじめてるよ。<br />
              今日はよくがんばったね。むりせず、おやすみしよ。
            </div>
          </div>
        )}

        {/* 遊び方・キャラへの導線 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 11 }}>
          <button className="title-link" style={{ flex: 1 }} onClick={onHowTo}>📖 遊び方</button>
          <button className="title-link" style={{ flex: 1 }} onClick={onCharacter}>🎨 キャラ設定</button>
        </div>

        {/* 3段グリッド：①ステップアップ/タイムアタック ②バトル/チャレンジ ③ショップ/スキル */}
        <div className="mode-grid">
          {/* 1段目 */}
          <button className="mode-card mut" onClick={onStepUp}>
            <span style={{ fontSize: 36 }}>🌱</span>
            <span style={{ fontSize: 15, fontWeight: 900 }}>ステップアップ</span>
            <span style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>あなたに合わせて適応<br />力をつける毎日の練習</span>
          </button>
          <button className="mode-card mta" onClick={onTimeAttack}>
            <span style={{ fontSize: 36 }}>⏱️</span>
            <span style={{ fontSize: 15, fontWeight: 900 }}>タイムアタック</span>
            <span style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>40秒で何問解ける？<br />スピード勝負！</span>
          </button>

          {/* 2段目 */}
          <button className="mode-card mba" onClick={onBattle}>
            <span style={{ fontSize: 36 }}>⚔️</span>
            <span style={{ fontSize: 15, fontWeight: 900 }}>バトルモード</span>
            <span style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>モンスターと対戦！</span>
          </button>
          <button className="mode-card mch" onClick={onChallenge}>
            <span style={{ fontSize: 36 }}>🗻</span>
            <span style={{ fontSize: 15, fontWeight: 900 }}>チャレンジ</span>
            <span style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>難問に挑む・手書き<br />段位を上げよう！</span>
          </button>

          {/* 3段目 */}
          <button className="mode-card msh" onClick={onShop}>
            <span style={{ fontSize: 36 }}>🛒</span>
            <span style={{ fontSize: 15, fontWeight: 900 }}>ショップ</span>
            <span style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>
              アイテム・スキルを買おう<br />💰{player.coins ?? 0}
              {player.item && <> ／ 🎒{itemName(player.item)}</>}
            </span>
          </button>
          <button className="mode-card msk" onClick={onSkill}>
            <span style={{ fontSize: 36 }}>✨</span>
            <span style={{ fontSize: 15, fontWeight: 900 }}>スキル</span>
            <span style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>バトルで使うスキルを<br />セットしよう</span>
          </button>
        </div>

        <button className="nb-btn" onClick={onNotebook}>
          📓 間違いノート
          {mistakeCount > 0 && <span className="nb-badge">{mistakeCount}</span>}
        </button>

        {/* 学習ダッシュボード */}
        <Dashboard player={player} records={records || []} onDetail={onDetail} />
      </div>
    </div>
  );
}
