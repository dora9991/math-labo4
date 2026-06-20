#!/usr/bin/env python3
"""
問題DBに detail_skill_ids と detail_prerequisite_ids を付与するスクリプト
"""
import json
import os
from collections import defaultdict

DATA_DIR = os.path.dirname(os.path.abspath(__file__))

PROBLEM_BANK_FILES = [
    "problem_bank_grade1.json",
    "problem_bank_grade2.json",
    "problem_bank_grade3.json",
    "problem_bank_grade4.json",
    "problem_bank_grade5.json",
    "problem_bank_grade6.json",
    "problem_bank_excel.json",       # 中1
    "problem_bank_grade_m2.json",
    "problem_bank_grade_m3.json",
    "problem_bank_high1.json",
    "problem_bank_high2.json",
    "problem_bank_high3.json",
]

KEYWORD_MAP = {
    '文章題': ['文章題', '文章'],
    '意味': ['意味'],
    '筆算': ['筆算'],
    '計算': ['計算'],
    '比較': ['比較', '大小'],
    '基礎': ['基礎'],
    '応用': ['応用', '発展'],
}


def load_all_detail_skills():
    """詳細スキルを両ファイルから読み込む"""
    all_skills = []
    for fname in ["skill_detail_elementary.json", "skill_detail_secondary.json"]:
        fpath = os.path.join(DATA_DIR, fname)
        if os.path.exists(fpath):
            with open(fpath, encoding='utf-8') as f:
                skills = json.load(f)
            all_skills.extend(skills)
    return all_skills


def build_maps(all_skills):
    """
    parent_to_details: parent_id -> [detail_skill, ...]
    detail_map: skill_id -> detail_skill
    """
    parent_to_details = defaultdict(list)
    detail_map = {}
    for s in all_skills:
        detail_map[s['id']] = s
        parent_to_details[s['parent']].append(s)
    return parent_to_details, detail_map


def collect_all_prereqs(skill_id, detail_map, visited=None):
    """detail_skill_id から全前提を再帰収集する"""
    if visited is None:
        visited = set()
    if skill_id in visited:
        return visited
    visited.add(skill_id)
    s = detail_map.get(skill_id)
    if not s:
        return visited
    for pid in s.get('prerequisite_skill_ids', []):
        collect_all_prereqs(pid, detail_map, visited)
    return visited


def get_detail_skill_ids(problem, parent_to_details):
    """問題の skill_ids から detail_skill_ids を決定する"""
    problem_subunit = problem.get('subunit', '')

    # Step A: 全候補収集
    candidates = []
    for parent_id in problem.get('skill_ids', []):
        candidates.extend(parent_to_details.get(parent_id, []))

    if not candidates:
        return []

    # Step B: subunit 完全一致 or 部分一致
    matched = [s for s in candidates if s.get('subunit', '') == problem_subunit]
    if not matched:
        matched = [s for s in candidates
                   if problem_subunit and s.get('subunit', '') and
                   (problem_subunit in s.get('subunit', '') or
                    s.get('subunit', '') in problem_subunit)]

    # Step C: キーワードマッチング（追加絞り込み）
    if matched:
        keyword_matched = []
        for kw, patterns in KEYWORD_MAP.items():
            if kw in problem_subunit:
                for s in matched:
                    for p in patterns:
                        if p in s.get('name', '') or p in s.get('subunit', ''):
                            if s not in keyword_matched:
                                keyword_matched.append(s)
        if keyword_matched:
            return [s['id'] for s in keyword_matched]
        return [s['id'] for s in matched]

    # マッチなし → 全候補
    return [s['id'] for s in candidates]


def enrich_file(fpath, parent_to_details, detail_map):
    """1ファイルを読み込み、フィールドを付与して上書き保存"""
    with open(fpath, encoding='utf-8') as f:
        problems = json.load(f)

    if not isinstance(problems, list):
        print(f"  SKIP (not a list): {os.path.basename(fpath)}")
        return 0

    count = 0
    for problem in problems:
        # detail_skill_ids 決定
        detail_ids = get_detail_skill_ids(problem, parent_to_details)
        problem['detail_skill_ids'] = detail_ids

        # detail_prerequisite_ids 収集
        all_prereqs = set()
        for sid in detail_ids:
            prereqs = collect_all_prereqs(sid, detail_map)
            all_prereqs.update(prereqs)
        # 自分自身は除く
        all_prereqs -= set(detail_ids)
        problem['detail_prerequisite_ids'] = sorted(all_prereqs)
        count += 1

    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(problems, f, ensure_ascii=False, indent=2)

    return count


def main():
    print("詳細スキルマスター読み込み中...")
    all_skills = load_all_detail_skills()
    print(f"  合計 {len(all_skills)} 件の詳細スキルを読み込みました")

    parent_to_details, detail_map = build_maps(all_skills)
    print(f"  親スキル数: {len(parent_to_details)}, 詳細スキル数: {len(detail_map)}")

    total = 0
    for fname in PROBLEM_BANK_FILES:
        fpath = os.path.join(DATA_DIR, fname)
        if not os.path.exists(fpath):
            print(f"  [SKIP] {fname} (ファイルなし)")
            continue
        n = enrich_file(fpath, parent_to_details, detail_map)
        print(f"  [OK] {fname}: {n} 問処理")
        total += n

    print(f"\n完了: 合計 {total} 問を処理しました")


if __name__ == '__main__':
    main()
