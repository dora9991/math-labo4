# 問題DB — Dispatchタスク ガイド

スマホ（外出先）からClaudeに問題生成を依頼するための標準フォーマット。

---

## 構成ファイル

| ファイル | 役割 |
|---|---|
| `data/skill_master.json` | スキルマスタ（32スキル、小3〜中3） |
| `data/enrich_problem_bank.py` | problem_bank.json に skill_ids を付与するスクリプト |
| `src/data/problem_bank.json` | 本番問題DB（中1・701問） |

---

## Dispatchタスクの書き方

### パターン①：スキル指定で問題を追加

```
【DB生成タスク】
スキルID: sk_M1_003
スキル名: 正負の数の加法・減法（中1）
問題数: 15問
難易度: ★1（基礎計算10問）・★2（標準5問）
形式: 一行計算8問 + 文章題4問 + 穴埋め3問
prerequisite_skills: ["sk_E4_001", "sk_M1_001"]
error_types: ["符号ミス", "ひく数の符号変換忘れ"]
出力先: data/problem_bank/M1_add_sub.json
完了条件: 15問生成 → JSON形式確認 → git commit
```

### パターン②：単元まとめて追加

```
【単元一括生成タスク】
対象: 中1・方程式（unit: "方程式"）
スキルID: sk_M1_009, sk_M1_010
問題数: 各スキル20問（合計40問）
難易度分布: ★1×10, ★2×7, ★3×3
prerequisite_skills: data/skill_master.json を参照
出力先: data/problem_bank/M1_equation.json
完了条件: 40問 → バリデーション → commit
```

### パターン③：小学校の補完問題を追加

```
【補完問題タスク】
スキルID: sk_E4_002（かけ算の意味）
問題数: 15問
難易度: ★1〜★2
形式: 等分除・包含除の文章題
error_types: ["等分除と包含除の混同", "単位つけ忘れ"]
出力先: data/problem_bank/E4_multiplication.json
完了条件: 15問 → commit
```

---

## 問題JSONの形式

```json
{
  "id": "M1-ADD-001",
  "display_grade": "中1",
  "unit": "正の数・負の数",
  "subunit": "加法・減法",
  "skill_ids": ["sk_M1_003"],
  "prerequisite_skills": ["sk_E4_001", "sk_M1_001"],
  "difficulty": 1,
  "level": 1,
  "exam_level": "基礎",
  "format": "一行問題",
  "cognitive": "知識・技能",
  "q": "(-3) + (-5) を計算しなさい。",
  "answer": "-8",
  "answerNumeric": -8,
  "solution_steps": ["負の数＋負の数は絶対値をたして負にする", "|-3|+|-5|=8 → -8"],
  "error_types": [
    {"code": "ERR_SIGN", "description": "符号ミス（-8を+8と答える）"}
  ],
  "misconception": "負+負を正にしてしまう",
  "points": 2,
  "timeSec": 30,
  "autoGradable": true,
  "source": "オリジナル",
  "created_at": "2026-06-20"
}
```

---

## スキルDAGの例（診断フロー）

```
中1「(-3)+(-5)」に不正解
  → sk_M1_003 の習熟度が低い
       → 前提: sk_E4_001（小4・整数の四則計算）を確認
            → 前提: sk_E3_001（小3・九九）を確認
```

最初につまずいたスキルの問題を出題して補完する。
