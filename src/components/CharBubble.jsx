// CharBubble.jsx — マスコットキャラの吹き出し（自分のキャラを表示）
import Avatar from "./Avatar.jsx";

export default function CharBubble({ text, avatar = null, onAvatar = null }) {
  return (
    <div className="bubble-row">
      <Avatar avatar={avatar} size={42} onClick={onAvatar} ring={onAvatar ? "rgba(255,255,255,.5)" : null} />
      <div className="bubble-txt"><span>{text}</span></div>
    </div>
  );
}

// セリフ集（場面ごとにランダムで選ぶ）
const VOICES = {
  open: ["今日も来たね！えらい！", "また来てくれた！うれしい！", "毎日続けるのが一番！"],
  correct: ["やったね！", "正解！すごい！", "その調子！", "完璧！"],
  wrong: ["惜しい！もう一度！", "大丈夫、次は解けるよ！", "ヒントを使ってみよう！"],
  streak: ["連続正解！ノッてきた！", "止まらないね！", "天才かも！？"],
  clear: ["クリア！やったね！", "全部解けた！さすが！"],
  // 苦しい時にそっとかける言葉（共感のみ・説教やプレッシャーは入れない）
  comfort: [
    "ここでつまずく人、すごく多いよ。",
    "あせらなくて大丈夫。きみのペースでいい。",
    "わからないのは、まだ習ってないだけ。",
    "ちょっと深呼吸しよ。", "ここまで来ただけで、じゅうぶんえらい。",
    "むずかしいと感じるのは、ちゃんと考えてる証拠だよ。",
  ],
  // 同じところで続けて間違えた時（「あなただけじゃない」を伝える）
  common: [
    "ここ、みんな引っかかるところ！",
    "あなただけじゃないよ。",
    "つまずきやすいところだよね。少しやさしくするね。",
  ],
};

export function voice(kind) {
  const arr = VOICES[kind] || VOICES.correct;
  return arr[Math.floor(Math.random() * arr.length)];
}
