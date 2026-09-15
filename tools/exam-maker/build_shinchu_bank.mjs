// build_shinchu_bank.mjs — math-dialogue リポジトリの src/data/shinchu_bank.json
// （市販問題集「新中学問題集」のデジタル化データ）を、exam-maker が <script> で
// 読み込める shinchu_bank.js（window.SHINCHU_BANK）に変換する。
// 新中データが更新されたら、このスクリプトを再実行して shinchu_bank.js を作り直すこと。
//   node build_shinchu_bank.mjs
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '../../../math-dialogue/src/data/shinchu_bank.json');
const OUT = join(__dirname, 'shinchu_bank.js');

const data = JSON.parse(readFileSync(SRC, 'utf-8'));
const body = 'window.SHINCHU_BANK = ' + JSON.stringify(data, null, 1) + ';\n';
const header = '// shinchu_bank.js — 市販問題集（新中学問題集 演習編 数学1年など）のデジタル化データ。\n'
  + '// 出典: math-dialogue/src/data/shinchu_bank.json（build_shinchu_bank.mjs で自動生成、直接編集しないこと）\n'
  + '// 本体の PROBLEM_BANK には合流させず、exam-maker の「市販問題集から検索して追加」でのみ使う。\n';
writeFileSync(OUT, header + body);
console.log(`wrote ${OUT} (${data.length} problems)`);
