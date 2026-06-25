// applied_adapter.js — 応用問題バンク(window.APPLIED_BANK)を
// 本体 PROBLEM_BANK と同じスキーマに変換し、出題プールへ合流させる。
// index.html では problem_bank(_extra).js → applied_bank.js → このファイル
// の順に読み込むこと（本体スクリプトが PROBLEM_BANK を読む前に実行される）。
(function(){
  var A = window.APPLIED_BANK;
  if(!A || !A.length) return;
  window.PROBLEM_BANK = window.PROBLEM_BANK || [];

  // 応用問題の難易度(1-5) → 本体の難易度ラベル / level(tier) / 配点 / 想定時間
  var DIFF = {1:'★1基礎',2:'★2標準',3:'★3応用',4:'★4入試',5:'★4入試'};
  var LVL  = {1:1,2:2,3:3,4:4,5:4};        // 4・5は「入試」tier扱い（tierOfが4を返す）
  var PTS  = {1:4,2:5,3:8,4:10,5:12};
  var SEC  = {1:120,2:180,3:300,4:480,5:600};

  A.forEach(function(p){
    var d = p.difficulty || 2;
    // 基礎〜標準は知識・技能、応用以上は思考・判断・表現として扱う
    var cog = (d >= 3) ? '思考・判断・表現' : '知識・技能';
    var q = p.statement || '';
    if(p.figureNote) q += '（図：' + p.figureNote + '）';

    window.PROBLEM_BANK.push({
      id: 'APP-' + p.id,
      source: { file: p.sourceUrl || '', set: p.source || '',
                number: (p.year ? p.year + '年' : '') + (p.number ? ' 第' + p.number + '問' : '') },
      grade: p.needLevel || '中1',
      chapter: 'capp',
      unit: '応用問題',
      subunit: p.field || 'その他',     // 整数 / 代数 / 幾何 / 組合せ / 確率 / データ
      skillTags: p.tags || [],
      appSkill: null,
      format: '文章題',                  // 全幅・記述スペース広めで出る
      cognitive: cog,
      difficulty: DIFF[d] || '★3応用',
      level: LVL[d] || 3,
      misconception: '',
      points: PTS[d] || 6,
      timeSec: SEC[d] || 300,
      q: q,
      answer: p.answer || '',
      answerNumeric: null,
      autoGradable: false,
      confidence: '高',
      flag: '',
      _applied: p                        // 元データ（解説・ヒント等）への参照
    });
  });
})();
