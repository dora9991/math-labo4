// ============================================================
// extract_grade1.mjs
// 数学ラボの自動作問データ（src/data/grade1/c1〜c7.js のテンプレート）から
// 中1の「応用(advanced)・標準(standard)・文章題/利用ユニット」を実体化し、
// exam-maker の problem_bank 形式に変換して problem_bank_extra.js を出力する。
//
//   実行: node tools/exam-maker/extract_grade1.mjs
//   方針: easy（基礎計算）は既存701バンクと重複しやすいため除外。
//         standard + advanced を採用。文章題/利用ユニットは全段階採用。
// ============================================================
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const GRADE_DIR = join(__dir, "../../src/data/grade1");

const FILES = ["c1_seisu","c2_moji","c3_houteishiki","c4_hirei","c5_heimen","c6_kukan","c7_data"];
const UNIT_MAP = {
  c1:"正の数・負の数", c2:"文字の式", c3:"方程式",
  c4:"比例と反比例", c5:"平面図形", c6:"空間図形", c7:"データの活用",
};

// 再現可能なシード付き乱数（毎回同じ出力にする）
let _seed = 20260625;
function rnd(){ _seed = (_seed*1103515245 + 12345) & 0x7fffffff; return _seed/0x7fffffff; }
const r = (min,max)=> Math.floor(rnd()*(max-min+1))+min;

const isWordUnit = (name)=> /文章題|利用|活用/.test(name||"");
const DIFF = { easy:"★1基礎", standard:"★2標準", advanced:"★3応用" };
const LEVEL = { easy:1, standard:2, advanced:3 };

function fmtAns(a){
  if(typeof a!=="number") return String(a);
  if(Number.isInteger(a)) return String(a);
  return String(Math.round(a*100)/100);
}
function ptsFor(level){ return level>=3?4:(level>=2?3:2); }
function timeFor(level, word){
  if(word) return level>=3?120:(level>=2?90:60);
  return level>=3?60:(level>=2?45:30);
}

const INSTANCES = 5;   // 1テンプレあたり最大何問つくるか（重複は除外）
const out = [];
let tmplCount=0;

for(const f of FILES){
  const mod = await import(join(GRADE_DIR, f+".js"));
  const ch = mod.chapter;
  const unit = UNIT_MAP[ch.id];
  for(const u of ch.units){
    const word = isWordUnit(u.name);
    for(const tier of ["easy","standard","advanced"]){
      // 採用ルール: 文章題/利用は全段階、それ以外は standard と advanced のみ
      if(!word && tier==="easy") continue;
      const templates = (u.problems && u.problems[tier]) || [];
      for(const t of templates){
        tmplCount++;
        const seen = new Set();
        let tries=0;
        while(seen.size < INSTANCES && tries < INSTANCES*8){
          tries++;
          let res;
          try{ res = t.build(r); }catch(e){ continue; }
          if(!res || res.skip) continue;
          if(typeof res.q!=="string") continue;
          if(seen.has(res.q)) continue;
          seen.add(res.q);
          const level = LEVEL[tier];
          out.push({
            id: `GEN-${ch.id}-${t.id}-${seen.size}`,
            source: { set:"自動作問(数学ラボ)", number:`${ch.id}/${u.id}/${t.id}` },
            grade: "中1",
            chapter: ch.id,
            unit,
            subunit: u.name,
            skillTags: t.skill ? [t.skill] : [],
            appSkill: t.skill || "",
            format: word ? "文章題" : "計算",
            cognitive: word ? "思考・判断・表現" : "知識・技能",
            difficulty: DIFF[tier],
            level,
            misconception: "",
            points: ptsFor(level),
            timeSec: timeFor(level, word),
            q: res.q,
            answer: fmtAns(res.ans),
            answerNumeric: (typeof res.ans==="number") ? res.ans : null,
            autoGradable: true,
            hint1: res.h1 || "",
            hint2: res.h2 || "",
            confidence: "中",
            flag: "auto",
          });
        }
      }
    }
  }
}

// 念のため q の全体重複も除去
const uniq = [];
const qseen = new Set();
for(const p of out){ const k=p.unit+"|"+p.q; if(qseen.has(k)) continue; qseen.add(k); uniq.push(p); }

const banner = `// 自動生成: extract_grade1.mjs による中1の応用・標準・文章題（数学ラボの自動作問データ由来）\n`+
  `// 元の701問(problem_bank.js)の後に読み込み、window.PROBLEM_BANK に追記する。\n`;
const body = `window.PROBLEM_BANK = (window.PROBLEM_BANK||[]).concat(\n${JSON.stringify(uniq, null, 0)}\n);\n`;
writeFileSync(join(__dir, "problem_bank_extra.js"), banner+body);

// 集計レポート
const by = {};
for(const p of uniq){ const key=`${p.unit} / ${p.cognitive} / ${p.difficulty}`; by[key]=(by[key]||0)+1; }
console.log(`テンプレ数: ${tmplCount}　生成(重複除去後): ${uniq.length}問`);
console.log("内訳:");
for(const k of Object.keys(by).sort()) console.log(`  ${k}: ${by[k]}`);
