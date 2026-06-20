"""
problem_bank.json に skill_ids / prerequisite_skills を付加するスクリプト。
既存の appSkill (S-NEG-*) を新しい sk_M1_* 体系にマッピングし、
前提スキル（小学校含む）を各問題に追加する。

使い方:
  python3 data/enrich_problem_bank.py \
    --input  src/data/problem_bank.json \
    --skills data/skill_master.json \
    --output src/data/problem_bank_enriched.json
"""

import json
import argparse
from pathlib import Path

# appSkill (S-NEG-*) → skill_ids のマッピング
APP_SKILL_TO_SKILL_IDS = {
    "S-NEG-001": ["sk_M1_001"],
    "S-NEG-002": ["sk_M1_002"],
    "S-NEG-004": ["sk_M1_003"],
    "S-NEG-005": ["sk_M1_003"],
    "S-NEG-011": ["sk_M1_004"],
    "S-NEG-012": ["sk_M1_004"],
    "S-NEG-020": ["sk_M1_005"],
    "S-NEG-022": ["sk_M1_005"],
    "S-NEG-032": ["sk_M1_003", "sk_M1_004"],
    "S-NEG-042": ["sk_M1_004"],
    "S-NEG-044": ["sk_M1_004"],
    "S-NEG-051": ["sk_M1_005"],
    "S-NEG-062": ["sk_M1_003"],
    "S-NEG-071": ["sk_M1_005"],
    "S-NEG-072": ["sk_M1_005"],
    "S-NEG-073": ["sk_M1_005"],
}

def collect_all_prerequisites(skill_ids, skill_map, depth=0, visited=None):
    """スキルIDリストからすべての前提スキルを再帰的に収集する（スキル自身は除く）"""
    if visited is None:
        visited = set()
    result = set()
    for sid in skill_ids:
        if sid in visited:
            continue
        visited.add(sid)
        skill = skill_map.get(sid)
        if not skill:
            continue
        prereqs = skill.get("prerequisite_skill_ids", [])
        for p in prereqs:
            result.add(p)
            result |= collect_all_prerequisites([p], skill_map, depth+1, visited)
    return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="src/data/problem_bank.json")
    parser.add_argument("--skills", default="data/skill_master.json")
    parser.add_argument("--output", default="src/data/problem_bank_enriched.json")
    args = parser.parse_args()

    with open(args.input) as f:
        problems = json.load(f)

    with open(args.skills) as f:
        skill_list = json.load(f)

    skill_map = {s["id"]: s for s in skill_list}

    enriched = []
    stats = {"added": 0, "no_app_skill": 0}

    for prob in problems:
        app_skill = prob.get("appSkill")
        skill_ids = APP_SKILL_TO_SKILL_IDS.get(app_skill, [])

        if skill_ids:
            prereqs = collect_all_prerequisites(skill_ids, skill_map)
            # elementary school prerequisites only (cross-grade links)
            elem_prereqs = sorted(p for p in prereqs if p.startswith("sk_E"))
            all_prereqs = sorted(prereqs)
            prob["skill_ids"] = skill_ids
            prob["prerequisite_skills"] = all_prereqs
            prob["elem_prerequisite_skills"] = elem_prereqs  # 小学校への逆引き
            stats["added"] += 1
        else:
            prob["skill_ids"] = []
            prob["prerequisite_skills"] = []
            prob["elem_prerequisite_skills"] = []
            stats["no_app_skill"] += 1

        enriched.append(prob)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(enriched, f, ensure_ascii=False, indent=2)

    print(f"Done: {len(enriched)} problems")
    print(f"  enriched (skill_ids added): {stats['added']}")
    print(f"  no appSkill (skill_ids=[]):  {stats['no_app_skill']}")
    print(f"Output: {args.output}")

if __name__ == "__main__":
    main()
