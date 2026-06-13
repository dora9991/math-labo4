// ============================================================
// HowTo.jsx — 遊び方（ゲームの思い・各モード・経験値/お金/アイテム/スキル・注意）
//  タイトルやホームから開く。読み物として読みやすく。
// ============================================================
import Header from "../components/Header.jsx";
import BackupBox from "../components/BackupBox.jsx";

function Section({ icon, title, children, color = "#818cf8" }) {
  return (
    <div className="glass" style={{ padding: "14px 16px", borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginBottom: 8 }}>{icon} {title}</div>
      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.72)", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

const Mode = ({ emoji, name, children }) => (
  <div style={{ marginBottom: 9 }}>
    <span style={{ fontWeight: 900, color: "#fff" }}>{emoji} {name}</span><br />
    <span>{children}</span>
  </div>
);

export default function HowTo({ player, onExport, onImport, onBack }) {
  return (
    <div className="app">
      <Header player={player} back="ホーム" onBack={onBack} />
      <div className="content">
        <div className="pg-ttl">📖 遊び方</div>
        <div className="pg-sub">このゲームのこと、モードのこと、育て方のこと</div>

        <Section icon="💛" title="このゲームの思い" color="#f472b6">
          数学は「こわいもの」じゃなくて、解けると気持ちいいパズル。<br />
          まちがえても大丈夫。少しずつ解いて、戦って、自分のキャラと一緒にレベルアップしていく——
          そんな「毎日ちょっとやりたくなる」場所をめざして作りました。
          苦手なところは自動で見つけて、そっと出してくれます。あせらず、自分のペースでどうぞ。
        </Section>

        <Section icon="🎮" title="モードの遊び方" color="#60a5fa">
          <Mode emoji="🌱" name="ステップアップ">あなたの苦手に合わせて1問ずつ出題。10問で1セット。終わると正答率や伸びた力が見られます。勝ち負けなし、じっくり練習。</Mode>
          <Mode emoji="⏱️" name="タイムアタック">40秒で何問解けるか挑戦。正解数で⭐がつきます。3つの難易度（かんたん／ふつう／発展）すべてで⭐をとると、その小単元のバトルモンスターが出現！</Mode>
          <Mode emoji="⚔️" name="バトルモード">4択クイズでモンスターと対戦。小単元の敵→章ボス→最後は数学の魔王。章ボスを倒すとスキルがもらえます。</Mode>
          <Mode emoji="🗻" name="チャレンジ">手書きで難問に挑戦。段位を上げていく腕だめしモード。</Mode>
        </Section>

        <Section icon="⭐" title="経験値（XP）とレベル" color="#fbbf24">
          問題を解くとXPがたまり、レベルが上がります。レベルが上がると、バトルのHP・攻撃力・考える時間がアップ！<br />
          ※ 同じところを何度もくり返すと、もらえるXPは少なくなります（ずるい稼ぎ防止）。いろいろな単元に挑戦するのがコツ。
        </Section>

        <Section icon="💰" title="お金（コイン）の稼ぎ方" color="#f59e0b">
          おもにタイムアタックでコインが手に入ります（正解数や⭐でアップ）。コインはショップでアイテム・治療・スキルに使います。
          くり返し遊んでもコインは減らないので、コツコツためられます。
        </Section>

        <Section icon="🧪" title="アイテムのもらい方" color="#4ade80">
          ショップでコインを使って買います。バトル中に1つだけ持てて、使うとなくなります。<br />
          回復・SP回復・攻撃アップ・防御の4種類があり、レベルが上がると上位（もっと強い）が解放されます。
          バトルのHPは戦闘が終わっても回復しません。ショップの「治療」で全回復できます。
        </Section>

        <Section icon="✨" title="スキルのもらい方" color="#a855f7">
          スキルはバトル中、SP（正解でたまる）を使って発動します。スロット1・2に1つずつセット。<br />
          スキルは全部で<b style={{ color: "#fff" }}>10種</b>。最初に各スロット1つずつ持っていて、
          <b style={{ color: "#fde047" }}>章ボス（7体）とラスボスを倒すたびに1つずつ</b>もらえます。<br />
          手に入れたら「スキル」画面で、どれを装備するか選べます。
        </Section>

        <Section icon="🎨" title="自分のキャラ" color="#ec4899">
          「キャラクター」画面で、テンプレから選んだり、自分で絵を描いたり、画像を読み込んだりできます。
          お気に入りのキャラと一緒に育てよう。
        </Section>

        <Section icon="⚠️" title="だいじな注意" color="#f87171">
          このゲームのデータ（レベル・コイン・進み具合・描いたキャラなど）は、
          <b style={{ color: "#fff" }}>あなたのブラウザの中だけ</b>に保存されています。<br />
          そのため、<b style={{ color: "#fca5a5" }}>ブラウザの履歴・キャッシュ（サイトデータ）を消すと、進み具合も消えてしまいます。</b><br />
          ・シークレット／プライベートモードでは保存されません<br />
          ・別の端末やブラウザでは引き継げません<br />
          大事なデータなので、キャッシュ削除のときは気をつけてね。
        </Section>

        {/* データのバックアップ（保存・復元） */}
        {onExport && onImport && <BackupBox onExport={onExport} onImport={onImport} />}
      </div>
    </div>
  );
}
