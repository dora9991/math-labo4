// ============================================================
// monsters.js — バトルモードのモンスター図鑑（21体＋ラスボス）
//
// 構成：第1章から順番に各章3体ずつ＝合計21体。さらに最後にラスボス1体。
//   ・minLv は 3 レベルごとに1体ずつ解放（1,4,7,…,61）
//   ・ラスボスは Lv99 でのみ挑戦でき、全単元の発展問題を出す
//   ・見た目は10種類のSVGアートを章テーマに合わせて割り当て、
//     強さ（HP/攻撃/色枠/名前）で差別化する
//
//   hp/atk/reward/minLv … 戦闘の強さと解放条件
//   pools … 出題する単元 [{c:章ID, u:単元ID}, ...]
//   art   … 見た目（下の ART ライブラリのキー）
// ============================================================

// 推奨レベルのプレイヤーHP(36+lv*14)から「6発でやられる」敵攻撃力を逆算
// （battle.js の enemyAtkForLevel と同じ式。循環importを避けてここに定義）
function enemyAtkForLevel(minLv) {
  const playerHp = 36 + minLv * 14;
  return Math.max(8, Math.round(playerHp / 6));
}

// ── SVGアート・ライブラリ（既存10種類） ─────────────
const ART = {
  calc: {
    color: "#4488ff", deathColors: ["#4488ff", "#88bbff", "#00ffff", "#ffffff", "#ffff00"],
    svgDefs: `<defs><radialGradient id="rg1" cx="40%" cy="30%" r="65%"><stop offset="0%" stop-color="#88bbff"/><stop offset="100%" stop-color="#1144aa"/></radialGradient><linearGradient id="rg1b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#4488ff"/><stop offset="100%" stop-color="#1133aa"/></linearGradient></defs>`,
    svg: `<rect x="35" y="55" width="70" height="60" rx="8" fill="url(#rg1b)" stroke="#88bbff" stroke-width="2"/><rect x="42" y="22" width="56" height="40" rx="6" fill="url(#rg1)" stroke="#88bbff" stroke-width="2"/><line x1="70" y1="22" x2="70" y2="10" stroke="#88bbff" stroke-width="2"/><circle cx="70" cy="8" r="4" fill="#ffff00"/><rect x="50" y="32" width="14" height="10" rx="2" fill="#001133"/><rect x="76" y="32" width="14" height="10" rx="2" fill="#001133"/><rect x="52" y="34" width="10" height="6" rx="1" fill="#00ffff"/><rect x="78" y="34" width="10" height="6" rx="1" fill="#00ffff"/><rect x="52" y="50" width="36" height="8" rx="3" fill="#001133"/><text x="70" y="57" text-anchor="middle" fill="#00ff88" font-size="7" font-family="monospace">1+1=?</text><rect x="12" y="58" width="22" height="10" rx="5" fill="#2255bb" stroke="#88bbff" stroke-width="1.5"/><rect x="106" y="58" width="22" height="10" rx="5" fill="#2255bb" stroke="#88bbff" stroke-width="1.5"/><rect x="42" y="112" width="18" height="20" rx="4" fill="#2255bb" stroke="#88bbff" stroke-width="1.5"/><rect x="80" y="112" width="18" height="20" rx="4" fill="#2255bb" stroke="#88bbff" stroke-width="1.5"/><text x="70" y="90" text-anchor="middle" fill="#88bbff" font-size="14" font-family="monospace" font-weight="bold">+−×÷</text>`,
    idleExtra: "",
  },
  balance: {
    color: "#cc88ff", deathColors: ["#cc88ff", "#eeccff", "#aa44ff", "#ffffff", "#ff88ff"],
    svgDefs: `<defs><radialGradient id="rg2" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#eeccff"/><stop offset="100%" stop-color="#6622aa"/></radialGradient></defs>`,
    svg: `<path d="M70 30 C45 28,28 45,28 68 C28 88,32 102,40 110 C46 118,55 122,70 122 C85 122,94 118,100 110 C108 102,112 88,112 68 C112 45,95 28,70 30Z" fill="url(#rg2)" stroke="#cc88ff" stroke-width="2"/><ellipse cx="58" cy="65" rx="9" ry="11" fill="#1a0033"/><ellipse cx="82" cy="65" rx="9" ry="11" fill="#1a0033"/><ellipse cx="60" cy="63" rx="5" ry="6" fill="#cc88ff"/><ellipse cx="84" cy="63" rx="5" ry="6" fill="#cc88ff"/><line x1="70" y1="18" x2="70" y2="30" stroke="#cc88ff" stroke-width="2"/><line x1="46" y1="18" x2="94" y2="18" stroke="#cc88ff" stroke-width="2.5"/><line x1="46" y1="18" x2="46" y2="28" stroke="#cc88ff" stroke-width="1.5"/><line x1="94" y1="18" x2="94" y2="28" stroke="#cc88ff" stroke-width="1.5"/><ellipse cx="46" cy="29" rx="10" ry="3" fill="none" stroke="#cc88ff" stroke-width="1.5"/><ellipse cx="94" cy="29" rx="10" ry="3" fill="none" stroke="#cc88ff" stroke-width="1.5"/><text x="46" y="28" text-anchor="middle" fill="#ffddff" font-size="7">x</text><text x="94" y="28" text-anchor="middle" fill="#ffddff" font-size="7">3</text><path d="M58 88 Q70 96 82 88" stroke="#cc88ff" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    idleExtra: "",
  },
  geo: {
    color: "#ff8844", deathColors: ["#ff8844", "#ffcc88", "#aa3300", "#ffff00", "#ff4400"],
    svgDefs: `<defs><radialGradient id="rg3" cx="35%" cy="30%" r="65%"><stop offset="0%" stop-color="#ffcc88"/><stop offset="100%" stop-color="#aa3300"/></radialGradient><linearGradient id="rg3b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff8844"/><stop offset="100%" stop-color="#882200"/></linearGradient></defs>`,
    svg: `<polygon points="70,20 100,38 100,74 70,92 40,74 40,38" fill="url(#rg3b)" stroke="#ffaa66" stroke-width="2"/><polygon points="70,32 90,43 90,65 70,76 50,65 50,43" fill="none" stroke="#ff8844" stroke-width="1" opacity="0.6"/><polygon points="58,50 64,46 64,54" fill="#ffff00"/><polygon points="82,50 76,46 76,54" fill="#ffff00"/><circle cx="70" cy="62" r="3" fill="#ff8844" stroke="#ffaa66" stroke-width="1"/><path d="M40 50 C25 40,15 55,20 65 C25 72,35 68,40 62Z" fill="url(#rg3b)" stroke="#ffaa66" stroke-width="1.5"/><path d="M100 50 C115 40,125 55,120 65 C115 72,105 68,100 62Z" fill="url(#rg3b)" stroke="#ffaa66" stroke-width="1.5"/><path d="M70 92 C65 105,60 112,55 118 C52 122,60 125,65 120 C70 115,75 105,70 92Z" fill="url(#rg3b)" stroke="#ffaa66" stroke-width="1.5"/><polygon points="70,40 76,50 64,50" fill="none" stroke="#ffdd88" stroke-width="1" opacity="0.8"/><rect x="62" y="68" width="16" height="12" rx="2" fill="none" stroke="#ffdd88" stroke-width="1" opacity="0.7"/>`,
    idleExtra: "",
  },
  wave: {
    color: "#00ddff", deathColors: ["#00ddff", "#aaffff", "#00aacc", "#ffffff", "#0088aa"],
    svgDefs: `<defs><radialGradient id="rg4" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#aaffff"/><stop offset="45%" stop-color="#00aacc"/><stop offset="100%" stop-color="#005577"/></radialGradient></defs>`,
    svg: `<ellipse cx="70" cy="82" rx="48" ry="52" fill="url(#rg4)" stroke="#00ddff" stroke-width="2"/><path d="M28 72 Q38 60,48 72 Q58 84,68 72 Q78 60,88 72 Q98 84,108 72 Q112 68,112 72" fill="none" stroke="#aaffff" stroke-width="2" opacity="0.7"/><path d="M28 82 Q38 70,48 82 Q58 94,68 82 Q78 70,88 82 Q98 94,108 82" fill="none" stroke="#aaffff" stroke-width="1.5" opacity="0.5"/><ellipse cx="57" cy="68" rx="8" ry="9" fill="white"/><ellipse cx="83" cy="68" rx="8" ry="9" fill="white"/><ellipse cx="58" cy="67" rx="5" ry="6" fill="#003344"/><ellipse cx="84" cy="67" rx="5" ry="6" fill="#003344"/><path d="M55 84 Q62 90,70 84 Q78 78,85 84" stroke="#005577" stroke-width="2" fill="none" stroke-linecap="round"/><text x="70" y="108" text-anchor="middle" fill="#aaffff" font-size="11" font-family="monospace" opacity="0.8">y=f(x)</text>`,
    idleExtra: "",
  },
  dice: {
    color: "#ffdd44", deathColors: ["#ffdd44", "#ffee88", "#aa8800", "#ffffff", "#ff8800"],
    svgDefs: `<defs><linearGradient id="rg5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffee88"/><stop offset="100%" stop-color="#aa8800"/></linearGradient><linearGradient id="rg5b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffcc44"/><stop offset="100%" stop-color="#886600"/></linearGradient></defs>`,
    svg: `<rect x="35" y="50" width="70" height="70" rx="12" fill="url(#rg5b)" stroke="#ffdd44" stroke-width="2.5"/><rect x="44" y="16" width="52" height="42" rx="8" fill="url(#rg5)" stroke="#ffdd44" stroke-width="2"/><circle cx="58" cy="32" r="5" fill="#1a1400"/><circle cx="82" cy="32" r="5" fill="#1a1400"/><circle cx="58" cy="34" r="3" fill="#ffff00"/><circle cx="82" cy="34" r="3" fill="#ffff00"/><path d="M57 48 Q70 56 83 48" stroke="#aa8800" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="55" cy="72" r="4" fill="#1a1400"/><circle cx="70" cy="72" r="4" fill="#1a1400"/><circle cx="85" cy="72" r="4" fill="#1a1400"/><circle cx="55" cy="90" r="4" fill="#1a1400"/><circle cx="70" cy="90" r="4" fill="#1a1400"/><circle cx="85" cy="90" r="4" fill="#1a1400"/><rect x="8" y="55" width="25" height="25" rx="5" fill="url(#rg5b)" stroke="#ffdd44" stroke-width="1.5"/><rect x="107" y="55" width="25" height="25" rx="5" fill="url(#rg5b)" stroke="#ffdd44" stroke-width="1.5"/><rect x="44" y="118" width="20" height="16" rx="4" fill="url(#rg5b)" stroke="#ffdd44" stroke-width="1.5"/><rect x="76" y="118" width="20" height="16" rx="4" fill="url(#rg5b)" stroke="#ffdd44" stroke-width="1.5"/>`,
    idleExtra: "",
  },
  prime: {
    color: "#44ff88", deathColors: ["#44ff88", "#aaffcc", "#005522", "#ffffff", "#00ff44"],
    svgDefs: `<defs><radialGradient id="rg6" cx="35%" cy="30%" r="65%"><stop offset="0%" stop-color="#aaffcc"/><stop offset="100%" stop-color="#005522"/></radialGradient></defs>`,
    svg: `<path d="M70 15 C85 15,95 28,90 42 C85 56,60 58,58 72 C56 86,70 95,80 100 C90 105,95 115,90 125 C85 132,75 133,68 130" fill="none" stroke="url(#rg6)" stroke-width="22" stroke-linecap="round"/><ellipse cx="70" cy="14" rx="18" ry="16" fill="url(#rg6)" stroke="#44ff88" stroke-width="2"/><ellipse cx="63" cy="10" rx="5" ry="6" fill="white"/><ellipse cx="77" cy="10" rx="5" ry="6" fill="white"/><ellipse cx="64" cy="9" rx="3" ry="3.5" fill="#001a00"/><ellipse cx="78" cy="9" rx="3" ry="3.5" fill="#001a00"/><path d="M70 22 L70 30 M68 30 L70 28 L72 30" stroke="#ff4466" stroke-width="1.5" fill="none" stroke-linecap="round" style="animation:tongueDart 1.5s ease-in-out infinite;"/><text x="86" y="38" fill="#aaffcc" font-size="9" font-family="monospace" transform="rotate(-30,86,38)">2</text><text x="66" y="60" fill="#aaffcc" font-size="9" font-family="monospace">3</text><text x="74" y="82" fill="#aaffcc" font-size="9" font-family="monospace" transform="rotate(20,74,82)">5</text><text x="84" y="104" fill="#aaffcc" font-size="9" font-family="monospace" transform="rotate(10,84,104)">7</text>`,
    idleExtra: `@keyframes tongueDart{0%,60%,100%{transform:scaleY(1);opacity:1;}75%{transform:scaleY(0);opacity:0;}}`,
  },
  fraction: {
    color: "#ff88cc", deathColors: ["#ff88cc", "#ffccee", "#882255", "#ffffff", "#ff44aa"],
    svgDefs: `<defs><radialGradient id="rg7" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#ffccee"/><stop offset="100%" stop-color="#882255"/></radialGradient></defs>`,
    svg: `<path d="M70 28 C48 26,30 42,28 62 C26 80,30 96,40 108 C50 120,60 126,70 126 C80 126,90 120,100 108 C110 96,114 80,112 62 C110 42,92 26,70 28Z" fill="url(#rg7)" stroke="#ff88cc" stroke-width="2" opacity="0.92"/><path d="M28 108 Q35 120,42 108 Q49 120,56 108 Q63 120,70 108 Q77 120,84 108 Q91 120,98 108 Q105 120,112 108" fill="url(#rg7)" stroke="#ff88cc" stroke-width="1.5"/><ellipse cx="57" cy="62" rx="9" ry="10" fill="white"/><ellipse cx="83" cy="62" rx="9" ry="10" fill="white"/><ellipse cx="58" cy="61" rx="6" ry="7" fill="#330011"/><ellipse cx="84" cy="61" rx="6" ry="7" fill="#330011"/><line x1="54" y1="90" x2="86" y2="90" stroke="#ff88cc" stroke-width="2.5" stroke-linecap="round"/><text x="70" y="86" text-anchor="middle" fill="#ffccee" font-size="9" font-family="monospace">1</text><text x="70" y="100" text-anchor="middle" fill="#ffccee" font-size="9" font-family="monospace">2</text>`,
    idleExtra: "",
  },
  angle: {
    color: "#ffaa00", deathColors: ["#ffaa00", "#ffdd88", "#884400", "#ffffff", "#ff6600"],
    svgDefs: `<defs><radialGradient id="rg8" cx="35%" cy="30%" r="65%"><stop offset="0%" stop-color="#ffdd88"/><stop offset="100%" stop-color="#884400"/></radialGradient><linearGradient id="rg8b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffaa00"/><stop offset="100%" stop-color="#663300"/></linearGradient></defs>`,
    svg: `<path d="M70 68 C55 55,30 50,10 60 C18 68,30 72,45 70 C35 78,22 80,18 90 C35 88,55 80,70 72Z" fill="url(#rg8b)" stroke="#ffaa00" stroke-width="1.5" style="animation:wingFlap 0.8s ease-in-out infinite alternate;transform-origin:70px 68px;"/><path d="M70 68 C85 55,110 50,130 60 C122 68,110 72,95 70 C105 78,118 80,122 90 C105 88,85 80,70 72Z" fill="url(#rg8b)" stroke="#ffaa00" stroke-width="1.5" style="animation:wingFlap 0.8s ease-in-out infinite alternate;transform-origin:70px 68px;transform:scaleX(-1);"/><ellipse cx="70" cy="72" rx="22" ry="28" fill="url(#rg8)" stroke="#ffaa00" stroke-width="2"/><ellipse cx="70" cy="44" rx="18" ry="18" fill="url(#rg8)" stroke="#ffaa00" stroke-width="2"/><polygon points="70,54 62,62 78,62" fill="#ffdd00" stroke="#ffaa00" stroke-width="1.5"/><circle cx="62" cy="40" r="6" fill="white"/><circle cx="78" cy="40" r="6" fill="white"/><circle cx="63" cy="40" r="4" fill="#1a0800"/><circle cx="79" cy="40" r="4" fill="#1a0800"/><path d="M58 88 L58 100 L70 100" stroke="#ffdd88" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M58 100 A12 12 0 0 1 70 88" stroke="#ffdd88" stroke-width="1.5" fill="none"/><text x="63" y="100" fill="#ffdd88" font-size="7">90°</text><path d="M58 96 C50 108,44 118,42 126 M70 100 C68 114,68 124,68 130 M82 96 C90 108,96 118,98 126" stroke="#ffaa00" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    idleExtra: `@keyframes wingFlap{from{transform:scaleY(1);}to{transform:scaleY(0.7)translateY(4px);}}`,
  },
  volume: {
    color: "#88ffaa", deathColors: ["#88ffaa", "#ccffdd", "#44aa66", "#ffffff", "#00ff66"],
    svgDefs: `<defs><linearGradient id="rg9t" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ccffdd"/><stop offset="100%" stop-color="#44aa66"/></linearGradient><linearGradient id="rg9r" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#44aa66"/><stop offset="100%" stop-color="#226644"/></linearGradient><linearGradient id="rg9f" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#88ffaa"/><stop offset="100%" stop-color="#336644"/></linearGradient></defs>`,
    svg: `<polygon points="30,60 30,110 70,130 70,80" fill="url(#rg9f)" stroke="#88ffaa" stroke-width="2"/><polygon points="70,80 70,130 110,110 110,60" fill="url(#rg9r)" stroke="#88ffaa" stroke-width="2"/><polygon points="30,60 70,40 110,60 70,80" fill="url(#rg9t)" stroke="#88ffaa" stroke-width="2"/><ellipse cx="46" cy="88" rx="7" ry="8" fill="white"/><ellipse cx="60" cy="88" rx="7" ry="8" fill="white"/><ellipse cx="47" cy="87" rx="4" ry="5" fill="#002211"/><ellipse cx="61" cy="87" rx="4" ry="5" fill="#002211"/><path d="M42 102 Q53 108 64 102" stroke="#226644" stroke-width="2" fill="none" stroke-linecap="round"/><text x="40" y="46" fill="#ccffdd" font-size="8" font-family="monospace" opacity="0.8">a</text><rect x="10" y="72" width="16" height="16" rx="2" fill="url(#rg9f)" stroke="#88ffaa" stroke-width="1.5"/><rect x="114" y="72" width="16" height="16" rx="2" fill="url(#rg9r)" stroke="#88ffaa" stroke-width="1.5"/>`,
    idleExtra: "",
  },
  speed: {
    color: "#ff4444", deathColors: ["#ff4444", "#ff8888", "#660000", "#ffffff", "#ffaa00"],
    svgDefs: `<defs><radialGradient id="rg10" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#ff8888"/><stop offset="45%" stop-color="#cc2222"/><stop offset="100%" stop-color="#660000"/></radialGradient></defs>`,
    svg: `<line x1="5" y1="50" x2="35" y2="50" stroke="#ff4444" stroke-width="2" opacity="0.6" stroke-linecap="round" style="animation:speedLine 0.6s ease-in-out infinite;"/><line x1="8" y1="62" x2="32" y2="62" stroke="#ff4444" stroke-width="1.5" opacity="0.5" stroke-linecap="round" style="animation:speedLine 0.6s ease-in-out infinite;animation-delay:0.1s;"/><line x1="5" y1="74" x2="28" y2="74" stroke="#ff4444" stroke-width="1" opacity="0.4" stroke-linecap="round" style="animation:speedLine 0.6s ease-in-out infinite;animation-delay:0.2s;"/><path d="M40 42 C55 30,90 28,105 48 C118 65,115 88,100 100 C85 112,55 115,40 102 C25 88,25 55,40 42Z" fill="url(#rg10)" stroke="#ff6666" stroke-width="2"/><path d="M52 56 L64 52 L64 62 L52 60Z" fill="white"/><path d="M80 52 L92 56 L92 60 L80 62Z" fill="white"/><ellipse cx="60" cy="57" rx="4" ry="5" fill="#1a0000"/><ellipse cx="84" cy="57" rx="4" ry="5" fill="#1a0000"/><path d="M58 78 L70 74 L82 78" stroke="#660000" stroke-width="2" fill="none" stroke-linecap="round"/><text x="72" y="96" text-anchor="middle" fill="#ff8888" font-size="9" font-family="monospace">v=d/t</text><path d="M40 60 C25 55,15 62,20 72 C24 80,35 78,40 72Z" fill="#ff4444" opacity="0.6" style="animation:flameTail 0.7s ease-in-out infinite alternate;transform-origin:40px 66px;"/>`,
    idleExtra: `@keyframes speedLine{0%,100%{opacity:0.6;transform:translateX(0);}50%{opacity:0.2;transform:translateX(8px);}} @keyframes flameTail{from{transform:scaleY(1)scaleX(1);}to{transform:scaleY(1.2)scaleX(0.8);}}`,
  },
  // ラスボス（王冠つきの闇のドラゴン）
  boss: {
    color: "#e879f9", deathColors: ["#e879f9", "#f0abfc", "#a21caf", "#ffffff", "#fde047"],
    svgDefs: `<defs><radialGradient id="rgB" cx="40%" cy="30%" r="70%"><stop offset="0%" stop-color="#f5d0fe"/><stop offset="55%" stop-color="#a21caf"/><stop offset="100%" stop-color="#3b0764"/></radialGradient></defs>`,
    svg: `<path d="M70 26 C44 24,26 44,26 70 C26 92,34 110,48 120 C58 127,64 130,70 130 C76 130,82 127,92 120 C106 110,114 92,114 70 C114 44,96 24,70 26Z" fill="url(#rgB)" stroke="#f0abfc" stroke-width="2.5"/><path d="M38 30 L30 8 L46 22 L58 4 L66 24 L78 4 L86 22 L102 8 L94 30Z" fill="#fde047" stroke="#fbbf24" stroke-width="1.5"/><circle cx="42" cy="14" r="3" fill="#ff4444"/><circle cx="70" cy="8" r="3.5" fill="#ff4444"/><circle cx="98" cy="14" r="3" fill="#ff4444"/><path d="M48 64 L66 60 L62 74 L46 72Z" fill="#fde047"/><path d="M92 64 L74 60 L78 74 L94 72Z" fill="#fde047"/><ellipse cx="56" cy="67" rx="4" ry="6" fill="#1a0022"/><ellipse cx="84" cy="67" rx="4" ry="6" fill="#1a0022"/><path d="M52 96 Q70 88 88 96 Q80 104 70 104 Q60 104 52 96Z" fill="#1a0022" stroke="#f0abfc" stroke-width="1"/><path d="M58 96 L60 102 M66 98 L66 104 M74 98 L74 104 M82 96 L80 102" stroke="#ffffff" stroke-width="1.5"/><path d="M26 70 C8 60,2 78,12 90 C18 96,28 92,32 84Z" fill="url(#rgB)" stroke="#f0abfc" stroke-width="1.5"/><path d="M114 70 C132 60,138 78,128 90 C122 96,112 92,108 84Z" fill="url(#rgB)" stroke="#f0abfc" stroke-width="1.5"/>`,
    idleExtra: "",
  },
};

// ── 章テーマ（3体分の名前・アート・出題単元） ─────────
//  各章のモンスター3体。pools がその体の出題範囲。
const CHAPTER_MONSTERS = [
  { c: "c1", entries: [
    { name: "スウチビット",   art: "calc",  pools: ["u1", "u2"] },
    { name: "フゴウイーター",  art: "prime", pools: ["u3", "u4"] },
    { name: "ネガネーガ",      art: "speed", pools: ["u5", "u6"] },
  ]},
  { c: "c2", entries: [
    { name: "モジカゲ",        art: "fraction", pools: ["v1", "v2"] },
    { name: "ダイニュウマル",  art: "balance",  pools: ["v3"] },
    { name: "シキガミ",        art: "calc",     pools: ["v4", "v5"] },
  ]},
  { c: "c3", entries: [
    { name: "テンビンガエル",  art: "balance",  pools: ["e1", "e2"] },
    { name: "イコールゴースト",art: "fraction", pools: ["e3"] },
    { name: "カイホウドラゴ",  art: "prime",    pools: ["e4", "e5"] },
  ]},
  { c: "c4", entries: [
    { name: "ヒレイクラゲ",    art: "wave",  pools: ["h1", "h2"] },
    { name: "グラフリン",      art: "speed", pools: ["h3"] },
    { name: "ハンピレオン",    art: "geo",   pools: ["h4", "h5"] },
  ]},
  { c: "c5", entries: [
    { name: "カクドリ",        art: "angle",    pools: ["z1"] },
    { name: "ミラーシフト",    art: "geo",      pools: ["z2"] },
    { name: "オウギマドウ",    art: "fraction", pools: ["z3", "z4"] },
  ]},
  { c: "c6", entries: [
    { name: "リッタイガー",    art: "volume", pools: ["k1"] },
    { name: "タイセキング",    art: "geo",    pools: ["k2"] },
    { name: "キュウメンオー",  art: "dice",   pools: ["k3", "k4"] },
  ]},
  { c: "c7", entries: [
    { name: "サイコロイド",    art: "dice",  pools: ["d1"] },
    { name: "ヒストグール",    art: "prime", pools: ["d2"] },
    { name: "カクリツーム",    art: "wave",  pools: ["d3"] },
  ]},
];

// ── 21体を自動生成（章順・強さは段階的に上昇・Lv3刻みが推奨レベル） ──
// HP  : 推奨レベルのプレイヤー攻撃力 × 必要回数（5〜10回で撃破）
// atk : 推奨レベルなら「6発でやられる」攻撃力（enemyAtkForLevelで逆算）
export const MONSTERS = [];
let idx = 0;
for (const chap of CHAPTER_MONSTERS) {
  for (const e of chap.entries) {
    const art = ART[e.art];
    const minLv = 1 + idx * 3;                   // 1,4,7,…,61（推奨レベル）
    const playerAtk = 8 + minLv * 7;             // 推奨レベルでのプレイヤー攻撃力
    const hits = 5 + Math.floor(idx / 4);        // 倒すのに必要な回数：序盤5回〜終盤10回
    MONSTERS.push({
      id: `m${idx + 1}_${chap.c}_${e.pools[0]}`,
      name: e.name,
      unit: e.name,
      hp: playerAtk * hits,              // 「攻撃力×必要回数」で算出（5〜10回で撃破）
      atk: enemyAtkForLevel(minLv),      // 推奨レベルなら6発でやられる
      reward: 25 + idx * 13,             // 25 〜 285
      minLv,
      color: art.color,
      pools: e.pools.map((u) => ({ c: chap.c, u })),
      art: e.art,
      svgDefs: art.svgDefs,
      svg: art.svg,
      idleExtra: art.idleExtra,
      deathColors: art.deathColors,
    });
    idx++;
  }
}

// ── ラスボス（Lv99・全単元の発展問題） ─────────────
const ALL_UNITS = CHAPTER_MONSTERS.flatMap((chap) => {
  // 章のすべての単元を集める（重複は気にしない）
  const set = new Set(chap.entries.flatMap((e) => e.pools));
  return [...set].map((u) => ({ c: chap.c, u }));
});

MONSTERS.push({
  id: "boss_maou",
  name: "数学の魔王",
  unit: "全単元の発展",
  hp: 701 * 12, // Lv99の攻撃力701 × 約12回。ラスボスらしい歯ごたえ
  atk: Math.round((36 + 99 * 14) / 5), // Lv99でも5発でやられる強さ（ラスボスは厳しめ）
  reward: 3000,
  minLv: 99,
  color: ART.boss.color,
  pools: ALL_UNITS,
  bossAdvancedOnly: true, // 発展のみ出題
  art: "boss",
  svgDefs: ART.boss.svgDefs,
  svg: ART.boss.svg,
  idleExtra: ART.boss.idleExtra,
  deathColors: ART.boss.deathColors,
});
