// ============================================================
// TitleScreen.jsx — タイトル画面。OP曲が流れる（再生はStartで開始済み）。
//  「はじめる」でメニュー（ホーム）へ。
// ============================================================
import { useEffect } from "react";
import { MathBackdrop } from "../components/Decorations.jsx";
import * as bgm from "../audio/bgm.js";

export default function TitleScreen({ onEnter }) {
  useEffect(() => { bgm.play("op"); }, []); // 念のためOPを継続

  return (
    <div className="app" style={{ alignItems: "center", justifyContent: "center" }}>
      <MathBackdrop />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 72, marginBottom: 4, animation: "startPulse 2s ease-in-out infinite" }}>📐</div>
        <div style={{ fontFamily: "'M PLUS Rounded 1c',sans-serif", fontSize: 48, fontWeight: 900, background: "linear-gradient(90deg,#818cf8,#c084fc,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 3, textShadow: "0 0 40px rgba(129,140,248,.4)" }}>
          数学ラボ
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,.55)", marginTop: 8, letterSpacing: 4 }}>～ MATH LAB ～</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 20, marginBottom: 26 }}>
          解いて、戦って、レベルアップ！
        </div>
        <button
          onClick={onEnter}
          style={{
            border: "none", borderRadius: 16, padding: "15px 44px", cursor: "pointer",
            fontFamily: "'M PLUS Rounded 1c',sans-serif", fontSize: 19, fontWeight: 900, color: "#fff",
            background: "linear-gradient(135deg,#059669,#047857)", boxShadow: "0 10px 30px rgba(5,150,105,.45)",
          }}
        >
          ▶ はじめる
        </button>
      </div>
    </div>
  );
}
