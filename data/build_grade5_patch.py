#!/usr/bin/env python3
"""小5問題DB 補強パッチ（590問→700問以上）"""
import json, math
from fractions import Fraction

TODAY = "2026-06-20"
SKILL_FILE = "/Users/kazuhisaijima/Documents/Claude/Projects/数学教材/math-labo4/data/skill_master.json"
OUT_FILE   = "/Users/kazuhisaijima/Documents/Claude/Projects/数学教材/math-labo4/data/problem_bank_grade5.json"

with open(SKILL_FILE, encoding="utf-8") as f:
    skill_list = json.load(f)
skill_map = {s["id"]: s for s in skill_list}

def collect_prereqs(skill_id, visited=None):
    if visited is None:
        visited = set()
    if skill_id in visited:
        return []
    visited.add(skill_id)
    result = []
    sk = skill_map.get(skill_id)
    if sk:
        for p in sk.get("prerequisite_skill_ids", []):
            result += collect_prereqs(p, visited)
            result.append(p)
    return list(dict.fromkeys(result))

def make_prob(unit, subunit, fmt, diff, skill_ids, q, answer, note="", error_types=None, tags_extra=None):
    prereqs = []
    for sid in skill_ids:
        prereqs += collect_prereqs(sid)
    prereqs = list(dict.fromkeys(prereqs))
    el = {1: "基礎", 2: "標準", 3: "応用"}[diff]
    tags = [unit, subunit, f"★{diff}", el, fmt]
    if tags_extra:
        tags += tags_extra
    return {
        "display_grade": "小5",
        "grade": "小5",
        "unit": unit,
        "subunit": subunit,
        "format": fmt,
        "difficulty": diff,
        "exam_level": el,
        "skill_ids": skill_ids,
        "prerequisite_skills": prereqs,
        "elem_prerequisite_skills": prereqs,
        "q": q,
        "answer": str(answer),
        "source": "オリジナル",
        "note": note,
        "error_types": error_types or [],
        "tags": list(dict.fromkeys(tags)),
        "autoGradable": True,
        "created_at": TODAY,
    }

def frac_str(f):
    f = Fraction(f)
    if f.denominator == 1:
        return str(f.numerator)
    return f"{f.numerator}/{f.denominator}"

def fmt_num(x):
    return str(int(x)) if float(x) == int(float(x)) else str(x)

def gcd(a,b):
    while b: a,b=b,a%b
    return a
def lcm(a,b): return a*b//gcd(a,b)

extra = []

# ── 整数の性質 追加 +10問 ──────────────────────────────────────────
ERR_LCM = [{"code":"ERR_LCM","description":"公倍数と公約数を混同する"}]
ERR_GCD = [{"code":"ERR_GCD","description":"最大公約数を最小公倍数と混同"}]
pairs_extra = [(16,20),(15,18),(14,21),(12,20),(18,30),(24,42),(35,21),(28,42),(45,60),(30,50)]
for a,b in pairs_extra:
    l = lcm(a,b)
    g = gcd(a,b)
    extra.append(make_prob("整数の性質","公倍数・最小公倍数","計算問題",2,["sk_E5_005"],
        f"{a}と{b}の最小公倍数を求めなさい。",l,"",ERR_LCM))
    extra.append(make_prob("整数の性質","公約数・最大公約数","計算問題",2,["sk_E5_005"],
        f"{a}と{b}の最大公約数を求めなさい。",g,"",ERR_GCD))

# 倍数・約数判定
for n in [4,6,7,9,12]:
    candidates = list(range(n, n*13, n))
    extra.append(make_prob("整数の性質","倍数の性質","穴埋め",1,["sk_E5_005"],
        f"{n}の倍数を小さい順に5つ答えなさい。",", ".join(str(x) for x in candidates[:5]),"",ERR_LCM))

# ── 小数の乗除 追加 +10問 ──────────────────────────────────────────
ERR_DEC = [{"code":"ERR_DEC","description":"小数点位置のずれ"}]
extra_dec_mul = [(0.35,4),(1.25,8),(0.48,5),(2.5,1.6),(0.75,12),(1.4,1.5),(3.6,0.25),(0.9,0.08),(2.4,1.25),(0.125,8)]
for a,b in extra_dec_mul:
    ans = round(a*b,6)
    extra.append(make_prob("小数の乗除","小数の乗法（発展）","計算問題",2,["sk_E5_001"],
        f"{a} × {b} を計算しなさい。",fmt_num(ans),"",ERR_DEC))

# ── 分数の加減 追加 +25問 ──────────────────────────────────────────
ERR_FRAC = [{"code":"ERR_FRAC","description":"通分ミス・分子だけ加減する"}]

# 異分母加減 追加
extra_frac = [
    (1,6,1,8,"+"),(1,4,1,10,"+"),(3,8,1,6,"+"),(2,5,1,3,"+"),(3,7,1,2,"+"),
    (5,12,1,4,"+"),(1,9,1,6,"+"),(4,9,2,3,"-"),(7,12,1,4,"-"),(5,6,2,9,"-"),
    (7,8,5,12,"-"),(11,12,3,8,"-"),(2,3,1,7,"+"),(5,9,1,6,"+"),(7,10,3,8,"-"),
    (1,2,1,7,"+"),(3,4,2,7,"+"),(4,9,1,4,"+"),(5,8,3,10,"+"),(11,15,2,5,"-"),
    (7,9,1,3,"-"),(5,7,2,5,"-"),(8,9,1,6,"-"),(7,8,1,3,"-"),(3,5,1,4,"+"),
]
for n1,d1,n2,d2,op in extra_frac:
    f1,f2 = Fraction(n1,d1), Fraction(n2,d2)
    ans = f1+f2 if op=="+" else f1-f2
    extra.append(make_prob("分数の加減","異分母の加減（通分）","計算問題",2,["sk_E5_003"],
        f"{n1}/{d1} {op} {n2}/{d2} を計算しなさい（約分すること）。",frac_str(ans),"",ERR_FRAC))

# ── 面積 追加 +15問 ──────────────────────────────────────────────
ERR_AREA = [{"code":"ERR_AREA","description":"底辺と高さを誤る・÷2を忘れる"}]
extra_tri = [(16,9),(13,8),(11,6),(7,14),(9,12),(8,15),(10,13)]
for b,h in extra_tri:
    extra.append(make_prob("面積","三角形の面積","計算問題",2,["sk_E5_001"],
        f"底辺{b}cm、高さ{h}cmの三角形の面積を求めなさい。",fmt_num(b*h/2)+"cm²","",ERR_AREA))

extra_trap2 = [(2,8,5),(3,9,4),(5,13,6),(6,14,7),(7,11,8)]
for a,b,h in extra_trap2:
    extra.append(make_prob("面積","台形の面積","計算問題",2,["sk_E5_001"],
        f"上底{a}cm、下底{b}cm、高さ{h}cmの台形の面積を求めなさい。",fmt_num((a+b)*h/2)+"cm²","",ERR_AREA))

# 面積文章題（応用）
area_word = [
    ("底辺12cm、高さ7cmの三角形の面積を求めなさい。","42cm²"),
    ("上底5cm、下底11cm、高さ8cmの台形の面積を求めなさい。","64cm²"),
    ("たて9cm、横14cmの長方形の面積を求めなさい。","126cm²"),
]
for q,ans in area_word:
    extra.append(make_prob("面積","面積の応用","文章題",2,["sk_E5_001"],q,ans,"",ERR_AREA))

# ── 体積 追加 +15問 ──────────────────────────────────────────────
ERR_VOL = [{"code":"ERR_VOL","description":"縦×横だけで高さを掛け忘れる"}]
more_cuboid = [(10,4,5),(6,6,7),(3,8,9),(5,7,6),(4,9,5),(8,8,3),(2,6,11),(7,5,8),(3,4,10),(6,7,4)]
for a,b,c in more_cuboid:
    extra.append(make_prob("体積","直方体の体積","計算問題",2,["sk_E5_001"],
        f"縦{a}cm、横{b}cm、高さ{c}cmの直方体の体積を求めなさい。",str(a*b*c)+"cm³","",ERR_VOL))

# L・mLとの換算追加
vol_conv2 = [(2000,"mL","cm³",2000),(3000,"cm³","L",3),(1500,"mL","dL",15),(4000,"cm³","L",4),(750,"mL","cm³",750)]
for val,fu,tu,ans in vol_conv2:
    extra.append(make_prob("体積","体積と容積の単位換算","穴埋め",2,["sk_E5_001"],
        f"{val}{fu}を{tu}で表しなさい。",str(ans),"",ERR_VOL))

# ── 割合 追加 +10問 ──────────────────────────────────────────────
ERR_RATIO = [{"code":"ERR_RATIO","description":"割合・基準量・比較量の混同"}]
extra_ratio = [
    (120,0.4),(350,0.6),(800,0.15),(500,0.08),(240,0.75),(1200,0.2),(600,0.35),(450,0.4),(900,0.6),(360,0.25),
]
for base,r in extra_ratio:
    comp = base*r
    extra.append(make_prob("割合","比較量を求める","計算問題",2,["sk_E5_004"],
        f"基準量が{base}のとき、{int(r*100)}%の比較量を求めなさい。",str(int(comp)),"",ERR_RATIO))

# ── 単位量あたり 追加 +12問 ──────────────────────────────────────
ERR_UNIT = [{"code":"ERR_UNIT","description":"単位量あたりの量の計算で分子・分母を逆にする"}]
extra_speed = [(300,5),(420,6),(540,9),(680,8),(720,9),(800,10),(450,5),(560,7),(630,7),(720,8),(900,12),(1100,11)]
for d,t in extra_speed:
    extra.append(make_prob("単位量あたり","速さを求める","計算問題",2,["sk_E5_001"],
        f"{d}mを{t}秒で走ったときの速さ（毎秒何m）を求めなさい。",fmt_num(d/t)+"m/秒","",ERR_UNIT))

# ── 平均 追加 +12問 ──────────────────────────────────────────────
ERR_AVG = [{"code":"ERR_AVG","description":"合計÷個数を間違える・0を無視する"}]
extra_avg_sets = [
    [8,12,16,20,24],[7,11,15,19,23],[10,14,18,22,26],[9,13,17,21,25],
    [4,8,12,16],[6,10,14,18,22],[5,9,13,17,21],[3,7,11,15,19],
    [20,25,30,35,40],[12,16,20,24,28],[15,20,25,30],[8,12,16,20,24,28],
]
for data in extra_avg_sets:
    avg = sum(data)/len(data)
    extra.append(make_prob("平均","平均を求める","計算問題",1,["sk_E5_001"],
        f"次のデータの平均を求めなさい。{data}",fmt_num(avg),"",ERR_AVG))

# ── 比例・変わり方 追加（文章題・応用） ──────────────────────────
ERR_PROP = [{"code":"ERR_PROP","description":"比例定数を誤る・y=axとy=a/xを混同"}]
extra_prop_word = [
    ("y=6x のとき、x=7のyを求めなさい。","42"),
    ("y=9x のとき、x=4のyを求めなさい。","36"),
    ("y=7x のとき、x=8のyを求めなさい。","56"),
    ("y=ax でx=3のときy=21。a=?","7"),
    ("y=ax でx=5のときy=60。a=?","12"),
    ("毎分5Lずつ水が入る水槽。x分後のy（L）の式を書き、x=12のyを求めなさい。","y=5x, y=60"),
    ("1個30円のあめをx個買う代金y円の式を書き、x=9のyを求めなさい。","y=30x, y=270"),
    ("y=4x でx=0.5のyを求めなさい。","2"),
    ("y=8x でy=56のときのxを求めなさい。","7"),
    ("xとyが比例関係にあり、x=4のときy=28。x=7のときのyを求めなさい。","49"),
]
for q,ans in extra_prop_word:
    extra.append(make_prob("比例・変わり方","比例の応用","文章題",2,["sk_E5_001"],q,ans,"",ERR_PROP))

# ── 立体図形 追加 ──────────────────────────────────────────────
ERR_3D = [{"code":"ERR_3D","description":"面・辺・頂点の数え間違い"}]
extra_solid = [
    ("五角柱の面の数を答えなさい。","7"),
    ("五角柱の辺の数を答えなさい。","15"),
    ("五角柱の頂点の数を答えなさい。","10"),
    ("五角錐の面の数を答えなさい。","6"),
    ("五角錐の辺の数を答えなさい。","10"),
    ("五角錐の頂点の数を答えなさい。","6"),
    ("n角柱の面の数を式で表しなさい。","n+2"),
    ("n角柱の辺の数を式で表しなさい。","3n"),
    ("n角錐の面の数を式で表しなさい。","n+1"),
    ("n角錐の辺の数を式で表しなさい。","2n"),
]
for q,ans in extra_solid:
    extra.append(make_prob("立体図形","立体図形の性質","穴埋め",2,["sk_E5_001"],q,ans,"",ERR_3D))

# ── データ活用 追加 ──────────────────────────────────────────────
ERR_DATA = [{"code":"ERR_DATA","description":"度数の読み取りミス・平均計算のミス"}]
extra_data = [
    ("データ「5,10,15,20,25,30」の平均を求めなさい。","17.5"),
    ("データ「8,12,16,20,24」の最大値と最小値の差（範囲）を求めなさい。","16"),
    ("20人のクラスで8人が図書委員。図書委員の割合（%）を求めなさい。","40%"),
    ("6人の身長が148,150,153,155,158,162cm。平均を求めなさい。","154.33...cm→約154.3cm"),
    ("データが「4,6,8,10,12,14」のとき、中央値を求めなさい。","9"),
    ("度数が2,4,7,5,2の階級がある。最も多い階級は何番目ですか。","3番目"),
    ("平均気温が12月23℃、1月18℃、2月20℃。3ヵ月の平均気温を求めなさい。","20.33...℃→約20.3℃"),
    ("30人のクラスで、テストが80点以上の人が12人。80点以上の割合（%）を求めなさい。","40%"),
    ("データ「10,20,30,40,50,60」の平均を求めなさい。","35"),
    ("合計点が360点で平均が72点。データの個数を求めなさい。","5"),
]
for q,ans in extra_data:
    extra.append(make_prob("データ活用","データの読み取りと整理","一行問題",2,["sk_E5_001"],q,ans,"",ERR_DATA))

# ── 文字式 追加 ──────────────────────────────────────────────────
ERR_EQ = [{"code":"ERR_EQ","description":"□の位置によって立式の方向を間違える"}]
extra_eq = [
    ("□ × 9 = 81","□=","9"),
    ("□ + 17 = 30","□=","13"),
    ("□ - 14 = 9","□=","23"),
    ("42 ÷ □ = 7","□=","6"),
    ("□ × 5 + 3 = 28","□=","5"),
    ("4 × □ - 6 = 18","□=","6"),
    ("(□ - 3) × 4 = 24","□=","9"),
    ("□ ÷ 6 - 2 = 4","□=","36"),
    ("3 × □ + 2.5 = 14.5","□=","4"),
    ("□ × 8 = 72","□=","9"),
    ("2x - 3 = 11","x=","7"),
    ("x/3 + 4 = 9","x=","15"),
    ("4x + 5 = 29","x=","6"),
    ("x ÷ 4 - 3 = 2","x=","20"),
    ("6x = 4.8","x=","0.8"),
]
for eq,prompt,ans in extra_eq:
    d = 1 if "×" not in eq and "+" not in eq else 2
    extra.append(make_prob("文字式","□・xを使った式","穴埋め",d,["sk_E4_003"],
        f"{eq}　{prompt}を求めなさい。",ans,"",ERR_EQ))

print(f"追加問題数: {len(extra)}")

# 既存JSONを読み込んでマージ
with open(OUT_FILE, encoding="utf-8") as f:
    existing = json.load(f)

unit_prefix = {
    "整数の性質": "INT",
    "小数の乗除": "DEC",
    "分数の加減": "FRAC",
    "面積":       "AREA",
    "体積":       "VOL",
    "割合":       "RATIO",
    "単位量あたり":"UNIT",
    "平均":       "AVG",
    "比例・変わり方":"PROP",
    "立体図形":   "SOLID",
    "データ活用": "DATA",
    "文字式":     "EQ",
}

# 既存IDの最大連番を取得
from collections import Counter, defaultdict
import re

max_counters = defaultdict(int)
for p in existing:
    pid = p.get("id","")
    m = re.match(r"G5-([A-Z]+)-(\d+)", pid)
    if m:
        prefix, num = m.group(1), int(m.group(2))
        if num > max_counters[prefix]:
            max_counters[prefix] = num

seen_ids = {p["id"] for p in existing}

for p in extra:
    prefix = unit_prefix.get(p["unit"], "G5")
    n = max_counters[prefix] + 1
    pid = f"G5-{prefix}-{n:03d}"
    while pid in seen_ids:
        n += 1
        pid = f"G5-{prefix}-{n:03d}"
    max_counters[prefix] = n
    seen_ids.add(pid)
    p["id"] = pid

all_problems = existing + extra

unit_counts = Counter(p["unit"] for p in all_problems)
print("\n=== 単元別問題数（マージ後） ===")
total = 0
for u,c in sorted(unit_counts.items()):
    print(f"  {u}: {c}問")
    total += c
print(f"\n  合計: {total}問")

with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(all_problems, f, ensure_ascii=False, indent=2)
print(f"\n保存完了: {OUT_FILE}")
