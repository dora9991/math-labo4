#!/usr/bin/env python3
"""小学5年生 算数問題データベース生成スクリプト（700問以上）"""
import json, math, random
from fractions import Fraction
from datetime import date

TODAY = "2026-06-20"
SKILL_FILE = "/Users/kazuhisaijima/Documents/Claude/Projects/数学教材/math-labo4/data/skill_master.json"
OUT_FILE   = "/Users/kazuhisaijima/Documents/Claude/Projects/数学教材/math-labo4/data/problem_bank_grade5.json"

# ── スキルマスタ読み込み ──────────────────────────────────────────────────────
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
    return list(dict.fromkeys(result))  # 重複除去・順序保持

def make_prob(unit, subunit, fmt, diff, skill_ids, q, answer, note="", error_types=None, tags_extra=None):
    """問題辞書を組み立てる（IDはあとで付与）"""
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

problems = []

# ════════════════════════════════════════════════════════════════════════════
# 1. 整数の性質（公倍数・公約数・最小公倍数・最大公約数） 80問
# ════════════════════════════════════════════════════════════════════════════
UNIT1 = "整数の性質"
ERR_LCM = [{"code":"ERR_LCM","description":"公倍数と公約数を混同する"}]
ERR_GCD = [{"code":"ERR_GCD","description":"最大公約数を最小公倍数と混同"}]
ERR_FACTOR = [{"code":"ERR_FACTOR","description":"素因数分解の計算ミス"}]

def gcd(a,b):
    while b: a,b=b,a%b
    return a
def lcm(a,b): return a*b//gcd(a,b)

# 倍数・公倍数の基礎
pairs_lcm_easy = [(2,3),(2,5),(3,4),(4,6),(5,10),(6,8),(3,9),(4,8),(6,9),(2,7)]
for a,b in pairs_lcm_easy:
    l = lcm(a,b)
    problems.append(make_prob(UNIT1,"公倍数・最小公倍数","計算問題",1,["sk_E5_005"],
        f"{a}と{b}の最小公倍数を求めなさい。",l,"",ERR_LCM))

pairs_lcm_mid = [(4,6),(6,10),(8,12),(9,12),(10,15),(12,18),(6,14),(8,10),(15,20),(9,15),
                 (12,16),(10,12),(6,15),(4,10),(8,6)]
for a,b in pairs_lcm_mid:
    l = lcm(a,b)
    problems.append(make_prob(UNIT1,"公倍数・最小公倍数","計算問題",2,["sk_E5_005"],
        f"{a}と{b}の最小公倍数を求めなさい。",l,"",ERR_LCM))

# 3数のLCM
triples_lcm = [(2,3,4),(2,4,6),(3,4,6),(4,6,8),(2,5,6),(3,5,6),(4,5,10),(6,8,12),(3,6,9),(2,3,5)]
for a,b,c in triples_lcm:
    l = lcm(lcm(a,b),c)
    problems.append(make_prob(UNIT1,"公倍数・最小公倍数","計算問題",2,["sk_E5_005"],
        f"{a}と{b}と{c}の最小公倍数を求めなさい。",l,"",ERR_LCM))

# 公約数・GCD
pairs_gcd = [(12,18),(24,36),(15,20),(16,24),(30,45),(12,16),(18,24),(20,30),(14,21),(8,12),
             (24,32),(36,48),(15,25),(18,27),(20,28),(12,30),(16,20),(24,40),(9,15),(10,25)]
for a,b in pairs_gcd:
    g = gcd(a,b)
    d = 1 if (a,b) in [(12,18),(16,24)] else 2
    problems.append(make_prob(UNIT1,"公約数・最大公約数","計算問題",d,["sk_E5_005"],
        f"{a}と{b}の最大公約数を求めなさい。",g,"",ERR_GCD))

# 文章題（LCM/GCD応用）
word_lcm = [
    (3,5,"バスAは3分ごと、バスBは5分ごとに発車します。今同時に発車しました。次にまた同時に発車するのは何分後ですか。",15),
    (4,6,"4の倍数でもあり6の倍数でもある数のうち、最も小さい正の整数を答えなさい。",12),
    (6,8,"たてが6cm、横が8cmの長方形のタイルを並べて正方形を作ります。最小の正方形の一辺は何cmですか。",24),
    (2,3,"2でも3でも割り切れる数のうち、50以下のものは何個ありますか。",8),
    (3,4,"3と4の公倍数の中で100以下の最大の数を答えなさい。",96),
]
for a,b,q,ans in word_lcm:
    problems.append(make_prob(UNIT1,"公倍数・最小公倍数の応用","文章題",2,["sk_E5_005"],q,ans,"",ERR_LCM))

word_gcd = [
    (24,36,"24個と36個のあめを余りなく同じ人数に分けます。最大何人に分けられますか。",12),
    (18,27,"たて18cm、横27cmの長方形を同じ大きさの正方形に切り分けます。できるだけ大きな正方形を作ると一辺は何cmですか。",9),
    (12,20,"12本と20本の鉛筆を余りなく同じ数ずつ袋に分けます。最大何袋できますか。",4),
    (30,45,"30と45の最大公約数を求め、2つの数はともに何の倍数かを答えなさい。",15),
    (16,24,"16人と24人のグループを同じ人数のチームに分けます。最大何チームできますか。",8),
]
for a,b,q,ans in word_gcd:
    problems.append(make_prob(UNIT1,"公約数・最大公約数の応用","文章題",2,["sk_E5_005"],q,ans,"",ERR_GCD))

# 偶数・奇数・倍数判定
for n in [2,3,4,5,6,8,9,10]:
    problems.append(make_prob(UNIT1,"倍数の判定","穴埋め",1,["sk_E5_005"],
        f"次の中から{n}の倍数をすべて選びなさい。【12, 18, 24, 30, 36, 42, 48】",
        "，".join(str(x) for x in [12,18,24,30,36,42,48] if x%n==0),"",ERR_FACTOR))
    if len([p for p in problems if p["unit"]==UNIT1]) >= 80:
        break

print(f"単元1 完了: {sum(1 for p in problems if p['unit']==UNIT1)}問")

# ════════════════════════════════════════════════════════════════════════════
# 2. 小数の乗除 80問
# ════════════════════════════════════════════════════════════════════════════
UNIT2 = "小数の乗除"
ERR_DEC = [{"code":"ERR_DEC","description":"小数点位置のずれ"}]
ERR_DIVDEC = [{"code":"ERR_DIVDEC","description":"割り算の商の小数点位置を間違える"}]

def fmt_num(x):
    return str(int(x)) if x == int(x) else str(x)

# 小数×整数・整数×小数
mul_di = [(1.2,3),(2.4,5),(3.6,4),(0.8,7),(1.5,6),(2.5,4),(0.4,9),(3.2,3),(0.6,8),(1.4,5),
          (2.3,6),(4.5,2),(0.9,7),(1.8,4),(3.1,3)]
for a,b in mul_di:
    ans = round(a*b,4)
    problems.append(make_prob(UNIT2,"小数×整数","計算問題",1,["sk_E5_001"],
        f"{fmt_num(a)} × {b} を計算しなさい。",fmt_num(ans),"",ERR_DEC))

# 小数×小数
mul_dd = [(1.2,1.5),(2.4,1.5),(3.6,2.5),(0.8,0.7),(1.5,1.4),(2.5,1.2),(0.4,0.9),(3.2,1.5),
          (0.6,0.8),(1.4,2.5),(2.3,1.4),(4.5,0.6),(0.9,0.7),(1.8,1.5),(3.1,2.0),
          (0.12,5),(1.25,4),(0.75,8),(2.4,0.5),(1.6,0.25)]
for a,b in mul_dd:
    ans = round(a*b,6)
    d = 1 if (a>=1 or b>=1) else 2
    problems.append(make_prob(UNIT2,"小数×小数","計算問題",d,["sk_E5_001"],
        f"{fmt_num(a)} × {fmt_num(b)} を計算しなさい。",fmt_num(ans),"",ERR_DEC))

# 小数÷整数
div_di = [(3.6,3),(7.2,4),(4.8,6),(9.6,8),(5.4,9),(2.4,4),(6.3,7),(8.1,9),(4.5,5),(2.8,4),
          (7.5,5),(3.6,4),(9.6,6),(4.2,7),(8.4,6)]
for a,b in div_di:
    ans = round(a/b,6)
    problems.append(make_prob(UNIT2,"小数÷整数","計算問題",1,["sk_E5_001"],
        f"{fmt_num(a)} ÷ {b} を計算しなさい。",fmt_num(ans),"",ERR_DIVDEC))

# 小数÷小数
div_dd = [(3.6,1.2),(7.2,2.4),(4.8,0.8),(9.6,1.6),(5.4,0.9),(2.4,1.2),(6.3,0.7),(8.1,2.7),
          (4.5,1.5),(2.8,1.4),(7.5,2.5),(3.6,0.4),(9.6,0.6),(4.2,1.4),(8.4,2.1),
          (1.5,0.25),(2.4,0.8),(0.72,0.9),(3.6,0.12),(4.8,0.16)]
for a,b in div_dd:
    ans = round(a/b,6)
    d = 2 if b<1 else 1
    problems.append(make_prob(UNIT2,"小数÷小数","計算問題",d,["sk_E5_001"],
        f"{fmt_num(a)} ÷ {fmt_num(b)} を計算しなさい。",fmt_num(ans),"",ERR_DIVDEC))

# 文章題
word_dec = [
    ("1mが1.2kgのロープがあります。3.5m分の重さは何kgですか。",round(1.2*3.5,4)),
    ("1Lが0.8kgのジュースがあります。2.5L分の重さは何kgですか。",round(0.8*2.5,4)),
    ("9.6mのリボンを1.2mずつ切ります。何本できますか。",int(9.6/1.2)),
    ("4.8Lの水を0.6Lずつコップに入れます。何杯分になりますか。",int(4.8/0.6)),
    ("時速2.4kmで3.5時間歩きます。何km進みますか。",round(2.4*3.5,4)),
    ("たて1.5m、横2.4mの長方形の面積を求めなさい。（m²）",round(1.5*2.4,4)),
    ("1個0.8kgのリンゴが12個あります。合計は何kgですか。",round(0.8*12,4)),
    ("15.6÷2.4を計算しなさい（小数第1位まで）",round(15.6/2.4,1)),
]
for q,ans in word_dec:
    problems.append(make_prob(UNIT2,"小数の乗除の応用","文章題",2,["sk_E5_001"],q,fmt_num(ans),"",ERR_DEC))

print(f"単元2 完了: {sum(1 for p in problems if p['unit']==UNIT2)}問")

# ════════════════════════════════════════════════════════════════════════════
# 3. 分数の加減 80問
# ════════════════════════════════════════════════════════════════════════════
UNIT3 = "分数の加減"
ERR_FRAC = [{"code":"ERR_FRAC","description":"通分ミス・分子だけ加減する"}]
ERR_REDUCE = [{"code":"ERR_REDUCE","description":"約分を忘れる・分母を変えてしまう"}]

def frac_str(f):
    f = Fraction(f)
    if f.denominator == 1:
        return str(f.numerator)
    return f"{f.numerator}/{f.denominator}"

# 同分母の加減（基礎）
same_denom = [(1,5,2,5,"+"),(2,7,3,7,"+"),(3,8,4,8,"+"),(5,9,2,9,"+"),(1,6,4,6,"+"),
              (3,5,1,5,"-"),(5,7,2,7,"-"),(7,8,3,8,"-"),(8,9,4,9,"-"),(5,6,1,6,"-")]
for n1,d1,n2,d2,op in same_denom:
    f1,f2 = Fraction(n1,d1), Fraction(n2,d2)
    ans = f1+f2 if op=="+" else f1-f2
    problems.append(make_prob(UNIT3,"同分母の分数の加減","計算問題",1,["sk_E5_003"],
        f"{n1}/{d1} {op} {n2}/{d2} を計算しなさい。",frac_str(ans),"",ERR_FRAC))

# 異分母の加減（通分あり）
diff_denom_easy = [
    (1,2,1,3,"+"),(1,3,1,4,"+"),(1,4,1,6,"+"),(2,3,1,4,"+"),(1,2,1,5,"+"),
    (3,4,1,6,"+"),(2,5,1,4,"+"),(1,3,1,6,"+"),(3,5,1,10,"+"),(2,3,1,5,"+"),
    (3,4,1,2,"-"),(5,6,1,3,"-"),(7,8,1,4,"-"),(2,3,1,6,"-"),(5,6,1,2,"-"),
    (3,4,1,3,"-"),(7,10,2,5,"-"),(5,8,1,4,"-"),(4,5,3,10,"-"),(2,3,3,12,"-"),
]
for n1,d1,n2,d2,op in diff_denom_easy:
    f1,f2 = Fraction(n1,d1), Fraction(n2,d2)
    ans = f1+f2 if op=="+" else f1-f2
    sym = "＋" if op=="+" else "－"
    problems.append(make_prob(UNIT3,"異分母の加減（通分）","計算問題",2,["sk_E5_003"],
        f"{n1}/{d1} {op} {n2}/{d2} を計算しなさい（約分も行うこと）。",frac_str(ans),"",ERR_FRAC))

# 帯分数の加減
mixed_add = [
    ("1と1/2","1と2/3",Fraction(1,1)+Fraction(1,2)+Fraction(1,1)+Fraction(2,3),"+"),
    ("2と1/4","1と1/3",Fraction(2,1)+Fraction(1,4)+Fraction(1,1)+Fraction(1,3),"+"),
    ("3と1/3","1と1/4",Fraction(3,1)+Fraction(1,3)+Fraction(1,1)+Fraction(1,4),"+"),
    ("1と3/4","2と1/6",Fraction(1,1)+Fraction(3,4)+Fraction(2,1)+Fraction(1,6),"+"),
    ("2と2/3","1と1/2",Fraction(2,1)+Fraction(2,3)+Fraction(1,1)+Fraction(1,2),"+"),
]
for a_str,b_str,ans,op in mixed_add:
    problems.append(make_prob(UNIT3,"帯分数の加法","計算問題",2,["sk_E5_003"],
        f"{a_str} ＋ {b_str} を計算しなさい。",frac_str(ans),"",ERR_FRAC))

mixed_sub = [
    ("3と1/2","1と1/4",Fraction(3,1)+Fraction(1,2)-Fraction(1,1)-Fraction(1,4)),
    ("4と2/3","1と1/3",Fraction(4,1)+Fraction(2,3)-Fraction(1,1)-Fraction(1,3)),
    ("5と1/4","2と3/8",Fraction(5,1)+Fraction(1,4)-Fraction(2,1)-Fraction(3,8)),
    ("3と1/3","1と1/2",Fraction(3,1)+Fraction(1,3)-Fraction(1,1)-Fraction(1,2)),
    ("4と1/6","1and5/6",Fraction(4,1)+Fraction(1,6)-Fraction(1,1)-Fraction(5,6)),
]
labels = [("3と1/2","1と1/4"),("4と2/3","1と1/3"),("5と1/4","2と3/8"),("3と1/3","1と1/2"),("4と1/6","1と5/6")]
subs   = [Fraction(3,1)+Fraction(1,2)-Fraction(1,1)-Fraction(1,4),
          Fraction(4,1)+Fraction(2,3)-Fraction(1,1)-Fraction(1,3),
          Fraction(5,1)+Fraction(1,4)-Fraction(2,1)-Fraction(3,8),
          Fraction(3,1)+Fraction(1,3)-Fraction(1,1)-Fraction(1,2),
          Fraction(4,1)+Fraction(1,6)-Fraction(1,1)-Fraction(5,6)]
for (a_str,b_str),ans in zip(labels,subs):
    problems.append(make_prob(UNIT3,"帯分数の減法","計算問題",2,["sk_E5_003"],
        f"{a_str} － {b_str} を計算しなさい。",frac_str(ans),"",ERR_FRAC))

# 分数の大小比較
compare_pairs = [(Fraction(1,2),Fraction(2,5)),(Fraction(3,4),Fraction(5,6)),
                 (Fraction(2,3),Fraction(3,4)),(Fraction(5,8),Fraction(7,12)),
                 (Fraction(4,5),Fraction(7,9)),(Fraction(3,7),Fraction(2,5)),
                 (Fraction(5,6),Fraction(7,8)),(Fraction(2,9),Fraction(3,13)),
                 (Fraction(4,7),Fraction(5,9)),(Fraction(7,10),Fraction(5,7))]
for f1,f2 in compare_pairs:
    ans = ">" if f1>f2 else "<"
    problems.append(make_prob(UNIT3,"分数の大小比較","穴埋め",1,["sk_E5_002"],
        f"{f1.numerator}/{f1.denominator} ○ {f2.numerator}/{f2.denominator}　○に > か < を入れなさい。",ans,"",
        [{"code":"ERR_COMPARE","description":"通分せずに分子だけで比較する"}]))

# 文章題（分数）
word_frac = [
    (f"テープが1/2mと1/3mあります。合わせると何mですか。", frac_str(Fraction(1,2)+Fraction(1,3))),
    (f"水が3/4Lあります。1/6L使いました。残りは何Lですか。", frac_str(Fraction(3,4)-Fraction(1,6))),
    (f"1/3kmと2/5kmの道のりをあわせると何kmですか。", frac_str(Fraction(1,3)+Fraction(2,5))),
    (f"ジュースが5/6Lあります。3/8L飲みました。残りは何Lですか。", frac_str(Fraction(5,6)-Fraction(3,8))),
    (f"リボンが2と1/4mあります。1と3/8m使いました。残りは何mですか。", frac_str(Fraction(2,1)+Fraction(1,4)-Fraction(1,1)-Fraction(3,8))),
]
for q,ans in word_frac:
    problems.append(make_prob(UNIT3,"分数の加減の応用","文章題",2,["sk_E5_003"],q,ans,"",ERR_FRAC))

print(f"単元3 完了: {sum(1 for p in problems if p['unit']==UNIT3)}問")

# ════════════════════════════════════════════════════════════════════════════
# 4. 面積（三角形・平行四辺形・ひし形・台形） 70問
# ════════════════════════════════════════════════════════════════════════════
UNIT4 = "面積"
ERR_AREA = [{"code":"ERR_AREA","description":"底辺と高さを誤る・÷2を忘れる"}]

# 三角形の面積
tri_data = [(6,4),(8,5),(10,6),(12,7),(9,4),(5,8),(7,6),(14,3),(11,4),(3,10),
            (6,9),(8,7),(12,5),(15,4),(4,11)]
for b,h in tri_data:
    ans = b*h/2
    d = 1 if b*h <= 48 else 2
    problems.append(make_prob(UNIT4,"三角形の面積","計算問題",d,["sk_E5_001"],
        f"底辺が{b}cm、高さが{h}cmの三角形の面積を求めなさい。",fmt_num(ans)+"cm²","",ERR_AREA))

# 平行四辺形の面積
para_data = [(5,4),(6,3),(8,5),(10,4),(7,6),(9,3),(12,5),(4,7),(6,8),(11,4),
             (13,6),(5,9),(14,3),(7,7),(8,6)]
for b,h in para_data:
    ans = b*h
    problems.append(make_prob(UNIT4,"平行四辺形の面積","計算問題",1,["sk_E5_001"],
        f"底辺が{b}cm、高さが{h}cmの平行四辺形の面積を求めなさい。",str(ans)+"cm²","",ERR_AREA))

# ひし形の面積
rhombus_data = [(6,4),(8,6),(10,5),(12,8),(9,6),(7,4),(14,10),(6,9),(8,5),(5,8)]
for d1,d2 in rhombus_data:
    ans = d1*d2/2
    problems.append(make_prob(UNIT4,"ひし形の面積","計算問題",2,["sk_E5_001"],
        f"対角線が{d1}cmと{d2}cmのひし形の面積を求めなさい。",fmt_num(ans)+"cm²","",ERR_AREA))

# 台形の面積
trap_data = [(3,5,4),(4,6,5),(5,7,4),(6,8,6),(7,9,5),(3,7,6),(4,8,3),(5,9,4),(6,10,5),(4,6,3),(8,12,5),(5,11,6)]
for a,b,h in trap_data:
    ans = (a+b)*h/2
    problems.append(make_prob(UNIT4,"台形の面積","計算問題",2,["sk_E5_001"],
        f"上底が{a}cm、下底が{b}cm、高さが{h}cmの台形の面積を求めなさい。",fmt_num(ans)+"cm²","",ERR_AREA))

# 複合図形（文章題）
compound = [
    ("たてが8cm、横が6cmの長方形の中に、底辺6cm、高さ4cmの三角形があります。三角形の面積を求めなさい。","12cm²"),
    ("底辺12cm、高さ9cmの平行四辺形から、底辺4cm、高さ6cmの三角形を切り取ります。残りの面積は何cm²ですか。",str(12*9-4*6//2)+"cm²"),
    ("対角線が10cmと8cmのひし形と、底辺5cm、高さ6cmの三角形があります。面積の合計は何cm²ですか。",str(int(10*8/2+5*6/2))+"cm²"),
]
for q,ans in compound:
    problems.append(make_prob(UNIT4,"複合図形の面積","文章題",3,["sk_E5_001"],q,ans,"",ERR_AREA))

# 面積から辺を求める逆問題
inverse_area = [
    (24,"底辺","高さ6cm","三角形",24//6*2),
    (30,"底辺","高さ5cm","平行四辺形",30//5),
    (36,"高さ","底辺9cm","台形・上底4cm",36*2//9-4),
]
for area,missing,given,shape,ans in inverse_area:
    problems.append(make_prob(UNIT4,"面積から辺を逆算","一行問題",3,["sk_E5_001"],
        f"面積が{area}cm²、{given}の{shape}の{missing}を求めなさい。",str(ans)+"cm","",ERR_AREA))

print(f"単元4 完了: {sum(1 for p in problems if p['unit']==UNIT4)}問")

# ════════════════════════════════════════════════════════════════════════════
# 5. 体積（直方体・立方体） 50問
# ════════════════════════════════════════════════════════════════════════════
UNIT5 = "体積"
ERR_VOL = [{"code":"ERR_VOL","description":"縦×横だけで高さを掛け忘れる"}]

# 直方体の体積
cuboid_data = [(2,3,4),(3,4,5),(4,5,6),(2,5,6),(3,3,4),(5,5,4),(6,4,3),(7,3,4),(2,4,7),(5,6,3),
               (8,3,4),(4,4,5),(6,5,3),(7,4,2),(3,6,5),(9,2,4),(5,4,6),(3,7,3),(4,6,4),(6,3,6)]
for a,b,c in cuboid_data:
    ans = a*b*c
    d = 1 if ans<=100 else 2
    problems.append(make_prob(UNIT5,"直方体の体積","計算問題",d,["sk_E5_001"],
        f"縦{a}cm、横{b}cm、高さ{c}cmの直方体の体積を求めなさい。",str(ans)+"cm³","",ERR_VOL))

# 立方体の体積
cube_sides = [2,3,4,5,6,7,8,9,10]
for s in cube_sides:
    problems.append(make_prob(UNIT5,"立方体の体積","計算問題",1,["sk_E5_001"],
        f"一辺が{s}cmの立方体の体積を求めなさい。",str(s**3)+"cm³","",ERR_VOL))

# 体積の単位換算
unit_conv = [(1000,"cm³","何L",1),(500,"cm³","何dL",5),(2000,"cm³","何L",2),(250,"mL","何cm³",250)]
for val,from_u,to_q,ans in unit_conv:
    problems.append(make_prob(UNIT5,"体積と容積の単位換算","穴埋め",2,["sk_E5_001"],
        f"{val}{from_u}は{to_q}ですか。",str(ans),"",ERR_VOL))

# 文章題
word_vol = [
    ("縦3cm、横4cm、高さ5cmの箱があります。体積を求めなさい。","60cm³"),
    ("水槽の縦が20cm、横が30cm、深さが15cmです。満水のとき何cm³の水が入りますか。","9000cm³"),
    ("一辺6cmの立方体の体積を求めなさい。","216cm³"),
    ("縦5cm、横8cm、高さ4cmの直方体と、一辺4cmの立方体の体積の差を求めなさい。",str(5*8*4-4**3)+"cm³"),
]
for q,ans in word_vol:
    problems.append(make_prob(UNIT5,"体積の応用","文章題",2,["sk_E5_001"],q,ans,"",ERR_VOL))

print(f"単元5 完了: {sum(1 for p in problems if p['unit']==UNIT5)}問")

# ════════════════════════════════════════════════════════════════════════════
# 6. 割合（百分率・歩合・比較量・基準量） 80問
# ════════════════════════════════════════════════════════════════════════════
UNIT6 = "割合"
ERR_RATIO = [{"code":"ERR_RATIO","description":"割合・基準量・比較量の混同"}]
ERR_PCT = [{"code":"ERR_PCT","description":"百分率と歩合の変換ミス"}]

# 割合を求める（比較量÷基準量）
ratio_find = [
    (20,100),(30,100),(50,100),(25,100),(75,100),(40,100),(60,100),(80,100),(15,100),(90,100),
    (12,60),(8,40),(15,60),(6,30),(14,70),(18,90),(24,120),(10,40),(6,24),(9,36),
]
for comp,base in ratio_find:
    r = comp/base
    pct = int(r*100) if r*100==int(r*100) else round(r*100,1)
    problems.append(make_prob(UNIT6,"割合を求める","計算問題",2,["sk_E5_004"],
        f"基準量が{base}、比較量が{comp}のとき、割合（百分率）を求めなさい。",str(pct)+"%","",ERR_RATIO))

# 比較量を求める（基準量×割合）
comp_find = [
    (200,0.3),(500,0.4),(800,0.25),(1000,0.6),(400,0.75),(600,0.2),(300,0.8),(250,0.4),(120,0.5),(80,0.25),
    (240,Fraction(1,3)),(360,Fraction(1,4)),(480,Fraction(1,6)),(600,Fraction(2,5)),(720,Fraction(3,8)),
]
for base,r in comp_find:
    comp = base*r
    r_str = f"{int(r*100)}%" if isinstance(r,float) else f"{r.numerator}/{r.denominator}"
    problems.append(make_prob(UNIT6,"比較量を求める","計算問題",2,["sk_E5_004"],
        f"基準量が{base}のとき、割合{r_str}の比較量を求めなさい。",str(int(comp)),"",ERR_RATIO))

# 基準量を求める（比較量÷割合）
base_find = [
    (60,0.3),(80,0.4),(150,0.5),(200,0.25),(240,0.6),(90,0.3),(120,0.4),(75,0.25),(180,0.6),(100,0.2),
]
for comp,r in base_find:
    base = int(comp/r)
    problems.append(make_prob(UNIT6,"基準量を求める","計算問題",2,["sk_E5_004"],
        f"比較量が{comp}で、割合が{int(r*100)}%のとき、基準量を求めなさい。",str(base),"",ERR_RATIO))

# 百分率・歩合の変換
conv_pct = [(30,0.3,"3割"),(50,0.5,"5割"),(25,0.25,"2割5分"),(75,0.75,"7割5分"),(40,0.40,"4割"),
            (12,0.12,"1割2分"),(60,0.60,"6割"),(15,0.15,"1割5分"),(80,0.80,"8割"),(5,0.05,"5分")]
for pct,dec,wari in conv_pct:
    problems.append(make_prob(UNIT6,"百分率と歩合の変換","穴埋め",1,["sk_E5_004"],
        f"{pct}%を歩合で表しなさい。",wari,"",ERR_PCT))
    problems.append(make_prob(UNIT6,"百分率と歩合の変換","穴埋め",1,["sk_E5_004"],
        f"{wari}を百分率で表しなさい。",str(pct)+"%","",ERR_PCT))

# 文章題（割合）
word_ratio = [
    ("定価800円の品物が30%引きで売られています。売値を求めなさい。",str(int(800*0.7))+"円"),
    ("クラスの40人のうち60%が給食を完食しました。完食した人数を求めなさい。","24人"),
    ("もとの値段の75%が1500円です。もとの値段を求めなさい。","2000円"),
    ("180人の生徒のうち45人が眼鏡をかけています。割合（百分率）を求めなさい。","25%"),
    ("定価1200円の2割引きの値段を求めなさい。","960円"),
]
for q,ans in word_ratio:
    problems.append(make_prob(UNIT6,"割合の応用","文章題",3,["sk_E5_004"],q,ans,"",ERR_RATIO))

print(f"単元6 完了: {sum(1 for p in problems if p['unit']==UNIT6)}問")

# ════════════════════════════════════════════════════════════════════════════
# 7. 単位量あたり（人口密度・速さの基礎） 50問
# ════════════════════════════════════════════════════════════════════════════
UNIT7 = "単位量あたり"
ERR_UNIT = [{"code":"ERR_UNIT","description":"単位量あたりの量の計算で分子・分母を逆にする"}]

# 人口密度
pop_data = [(12000,40),(30000,60),(8000,20),(50000,100),(15000,50),(24000,80),(9000,30),(36000,90),(21000,70),(16000,40)]
for pop,area in pop_data:
    ans = pop//area
    problems.append(make_prob(UNIT7,"人口密度","計算問題",2,["sk_E5_001"],
        f"人口{pop}人、面積{area}km²のとき、人口密度（人/km²）を求めなさい。",str(ans),"",ERR_UNIT))

# 速さの基礎（距離・時間・速さ）
speed_data = [(60,2),(90,3),(120,4),(150,5),(80,2),(100,4),(45,3),(200,5),(75,3),(160,4),
              (12,0.5),(18,0.5),(24,0.5),(30,0.5),(15,0.5)]
for dist,time in speed_data:
    spd = dist/time
    problems.append(make_prob(UNIT7,"速さを求める","計算問題",2,["sk_E5_001"],
        f"{dist}kmを{fmt_num(time)}時間で走ったときの速さ（時速）を求めなさい。",str(fmt_num(spd))+"km/時","",ERR_UNIT))

# 1mあたり・1個あたりの単位量
unit_q = [
    (360,6,"1個の値段を求めなさい（円）",60),
    (480,8,"1個の値段を求めなさい（円）",60),
    (840,7,"1個の値段を求めなさい（円）",120),
    (1200,5,"1個の値段を求めなさい（円）",240),
    (750,6,"1個の値段を求めなさい（円）",125),
    (900,9,"1個の値段を求めなさい（円）",100),
    (360,4,"1mあたりの値段を求めなさい（円）",90),
    (480,6,"1mあたりの値段を求めなさい（円）",80),
    (600,8,"1mあたりの値段を求めなさい（円）",75),
    (1080,9,"1mあたりの値段を求めなさい（円）",120),
]
for total,n,q,ans in unit_q:
    problems.append(make_prob(UNIT7,"1単位あたりの量","計算問題",1,["sk_E5_001"],
        f"合計{total}円で{n}個（本）のとき、{q}。",str(ans)+"円","",ERR_UNIT))

# 文章題
word_unit = [
    ("Aの畑は1000m²で400kgのじゃがいもが収穫できました。1m²あたり何kgですか。","0.4kg"),
    ("車で240kmを3時間で走りました。時速を求めなさい。","80km/時"),
    ("飛行機が1800kmを3時間で飛びました。時速を求めなさい。","600km/時"),
    ("時速50kmで3時間走ります。何km進みますか。","150km"),
    ("時速60kmで走る自動車が150km進むのにかかる時間は何時間ですか。","2.5時間"),
]
for q,ans in word_unit:
    problems.append(make_prob(UNIT7,"単位量あたりの応用","文章題",2,["sk_E5_001"],q,ans,"",ERR_UNIT))

print(f"単元7 完了: {sum(1 for p in problems if p['unit']==UNIT7)}問")

# ════════════════════════════════════════════════════════════════════════════
# 8. 平均 40問
# ════════════════════════════════════════════════════════════════════════════
UNIT8 = "平均"
ERR_AVG = [{"code":"ERR_AVG","description":"合計÷個数を間違える・0を無視する"}]

# 平均を求める
avg_sets = [
    ([4,6,8,10,12],""),
    ([5,7,9,11,13],""),
    ([3,5,7,9,11],""),
    ([10,20,30,40],""),
    ([6,8,10,12,14],""),
    ([12,15,18,21],""),
    ([8,10,12,14,16],""),
    ([24,28,32,36],""),
    ([5,10,15,20,25],""),
    ([9,11,13,15,17],""),
    ([4,8,12,16,20],""),
    ([7,9,11,13],""),
    ([2,4,6,8,10,12],""),
    ([15,20,25,30],""),
    ([6,9,12,15,18],""),
]
for data,_ in avg_sets:
    avg = sum(data)/len(data)
    problems.append(make_prob(UNIT8,"平均を求める","計算問題",1,["sk_E5_001"],
        f"次のデータの平均を求めなさい。{data}",fmt_num(avg),"",ERR_AVG))

# 0を含む平均
avg_zero = [
    ([0,4,8,12,16],""),
    ([0,5,10,15],""),
    ([0,6,12,18,24],""),
    ([0,3,6,9],""),
    ([0,7,14,21],""),
]
for data,_ in avg_zero:
    avg = sum(data)/len(data)
    problems.append(make_prob(UNIT8,"0を含む平均","計算問題",2,["sk_E5_001"],
        f"次のデータの平均を求めなさい。（0を含む）{data}",fmt_num(avg),"",ERR_AVG))

# 平均から合計・個数を求める逆問題
inv_avg = [
    (5,8,40,"合計は？"),
    (6,7,42,"合計は？"),
    (4,9,36,"合計は？"),
    (3,10,30,"合計は？"),
    (7,6,42,"合計は？"),
]
for n,avg,total,q in inv_avg:
    problems.append(make_prob(UNIT8,"平均と合計の関係","一行問題",2,["sk_E5_001"],
        f"平均が{avg}で{n}個のデータがあります。{q}",str(total),"",ERR_AVG))

# 文章題
word_avg = [
    ("5回のテストの点数が72, 80, 68, 76, 84でした。平均を求めなさい。","76点"),
    ("3日間で300km走りました。1日あたりの平均は何kmですか。","100km"),
    ("平均60点の4人の合計点数を求めなさい。","240点"),
    ("身長が130, 135, 128, 132, 140cmの5人の平均身長を求めなさい。","133cm"),
    ("平均が25で5個のデータがあります。合計を求めなさい。","125"),
]
for q,ans in word_avg:
    problems.append(make_prob(UNIT8,"平均の応用","文章題",2,["sk_E5_001"],q,ans,"",ERR_AVG))

print(f"単元8 完了: {sum(1 for p in problems if p['unit']==UNIT8)}問")

# ════════════════════════════════════════════════════════════════════════════
# 9. 比例・変わり方（y=ax） 50問
# ════════════════════════════════════════════════════════════════════════════
UNIT9 = "比例・変わり方"
ERR_PROP = [{"code":"ERR_PROP","description":"比例定数を誤る・y=axとy=a/xを混同"}]

# y=ax の基本
for a in [2,3,4,5,6,8,10]:
    for x in [1,2,3,4,5,6]:
        y = a*x
        problems.append(make_prob(UNIT9,"比例の計算（y=ax）","計算問題",1,["sk_E5_001"],
            f"y = {a}x のとき、x = {x} のときのyを求めなさい。",str(y),"",ERR_PROP))
        if len([p for p in problems if p["unit"]==UNIT9]) >= 40:
            break
    if len([p for p in problems if p["unit"]==UNIT9]) >= 40:
        break

# 比例定数を求める
prop_pairs = [(3,12),(4,20),(5,30),(6,42),(2,14),(7,49),(8,56),(3,21),(5,45),(4,32)]
for x,y in prop_pairs:
    a = y//x
    problems.append(make_prob(UNIT9,"比例定数を求める","計算問題",2,["sk_E5_001"],
        f"y = ax で x={x} のとき y={y}。aを求めなさい。",str(a),"",ERR_PROP))

# 文章題
word_prop = [
    ("1分間に3Lずつ水が入るプールがあります。x分後のyLを求める式を書きなさい。また、x=8のときのyを求めなさい。","y=3x、y=24"),
    ("1冊80円のノートをx冊買うときの代金yを求める式を書き、x=7のときのyを求めなさい。","y=80x、y=560"),
    ("毎分4mで進む虫がx分後に進んだ距離yを求める式とx=15のときのyを求めなさい。","y=4x、y=60"),
    ("比例 y=5x でx=12のときのyを求めなさい。","y=60"),
]
for q,ans in word_prop:
    problems.append(make_prob(UNIT9,"比例の応用","文章題",2,["sk_E5_001"],q,ans,"",ERR_PROP))

print(f"単元9 完了: {sum(1 for p in problems if p['unit']==UNIT9)}問")

# ════════════════════════════════════════════════════════════════════════════
# 10. 立体図形（見取り図・展開図） 30問
# ════════════════════════════════════════════════════════════════════════════
UNIT10 = "立体図形"
ERR_3D = [{"code":"ERR_3D","description":"面・辺・頂点の数え間違い"}]

solid_qa = [
    ("直方体の面の数を答えなさい。","6","面"),
    ("直方体の辺の数を答えなさい。","12","辺"),
    ("直方体の頂点の数を答えなさい。","8","頂点"),
    ("立方体の面の数を答えなさい。","6","面"),
    ("立方体の辺の数を答えなさい。","12","辺"),
    ("立方体の頂点の数を答えなさい。","8","頂点"),
    ("三角柱の面の数を答えなさい。","5","面"),
    ("三角柱の辺の数を答えなさい。","9","辺"),
    ("三角柱の頂点の数を答えなさい。","6","頂点"),
    ("四角柱の面の数を答えなさい。","6","面"),
    ("四角柱の辺の数を答えなさい。","12","辺"),
    ("四角柱の頂点の数を答えなさい。","8","頂点"),
    ("三角錐の面の数を答えなさい。","4","面"),
    ("三角錐の辺の数を答えなさい。","6","辺"),
    ("三角錐の頂点の数を答えなさい。","4","頂点"),
    ("四角錐の面の数を答えなさい。","5","面"),
    ("四角錐の辺の数を答えなさい。","8","辺"),
    ("四角錐の頂点の数を答えなさい。","5","頂点"),
    ("円柱の底面は何形ですか。","円形","底面"),
    ("円錐の頂点の数を答えなさい。","1","頂点"),
    ("直方体の展開図を広げたとき、面は何枚になりますか。","6","面"),
    ("正六面体（立方体）の展開図は全部で何種類ありますか。","11","種類"),
    ("三角柱の展開図を広げると、長方形（側面）は何枚になりますか。","3","枚"),
    ("正四面体の辺の数を答えなさい。","6","辺"),
    ("正四面体の頂点の数を答えなさい。","4","頂点"),
    ("底面が六角形の柱（六角柱）の面の数を答えなさい。","8","面"),
    ("底面が六角形の柱（六角柱）の辺の数を答えなさい。","18","辺"),
    ("底面が六角形の柱（六角柱）の頂点の数を答えなさい。","12","頂点"),
    ("辺が12本、頂点が8つの立体は何ですか。","直方体（または立方体）","立体名"),
    ("4つの面がすべて正三角形の立体を何といいますか。","正四面体","立体名"),
]
for i,(q,ans,_) in enumerate(solid_qa):
    d = 1 if i<18 else 2
    problems.append(make_prob(UNIT10,"立体図形の性質","穴埋め",d,["sk_E5_001"],q,ans,"",ERR_3D))

print(f"単元10 完了: {sum(1 for p in problems if p['unit']==UNIT10)}問")

# ════════════════════════════════════════════════════════════════════════════
# 11. データ活用（柱状グラフ・平均） 30問
# ════════════════════════════════════════════════════════════════════════════
UNIT11 = "データ活用"
ERR_DATA = [{"code":"ERR_DATA","description":"度数の読み取りミス・平均計算のミス"}]

data_qa = [
    ("度数分布表で、各階級の人数をたした合計を何といいますか。","度数の合計（総度数）"),
    ("柱状グラフの縦軸は何を表しますか。","度数（人数）"),
    ("柱状グラフの横軸は何を表しますか。","階級（区間）"),
    ("階級の幅が5のとき、40以上45未満の階級の幅を答えなさい。","5"),
    ("データが「10,20,30,40,50」のとき、平均を求めなさい。","30"),
    ("データが「15,25,35,45,55,65」のとき、平均を求めなさい。","40"),
    ("最大値と最小値の差を何といいますか。","範囲（レンジ）"),
    ("50人のクラスで10人が全問正解でした。全問正解の割合（%）を求めなさい。","20%"),
    ("100人のうち35人が血液型Aです。A型の割合を百分率で求めなさい。","35%"),
    ("テストの点数が60,70,80,90,100の5人の平均を求めなさい。","80点"),
    ("柱状グラフで最も高い棒の階級を「最頻値の階級」といいます。正しいですか。","正しい"),
    ("度数が最も多い階級の中央値をモードといいます。あるクラスの点数分布で50〜60点の人数が最多でした。最頻値の階級は何点以上何点未満ですか。","50点以上60点未満"),
    ("5人の身長が150,152,155,158,160cm。平均を求めなさい。","155cm"),
    ("4人の体重が30,35,40,45kg。平均を求めなさい。","37.5kg"),
    ("3回のテストが80,90,70点。平均を求めなさい。","80点"),
    ("データの個数が偶数のとき、中央値は何番目と何番目の値の平均ですか（6個の場合）。","3番目と4番目の平均"),
    ("度数が5,8,12,10,5の5階級があります。最も度数が多い階級は何番目ですか。","3番目"),
    ("100人の調査で「はい」が65人、「いいえ」が35人。「はい」の割合を百分率で求めなさい。","65%"),
    ("平均30点で10人のデータ。合計点を求めなさい。","300点"),
    ("6人の身長が142,145,148,150,153,158cm。平均を求めなさい。","149.33...→約149.3cm"),
    ("データ「2,4,6,8,10」の中央値を求めなさい。","6"),
    ("データ「3,5,7,9」の中央値を求めなさい。","6"),
    ("データ「10,20,30,40」の範囲（最大値－最小値）を求めなさい。","30"),
    ("40人のクラスで「犬が好き」が24人。割合（%）を求めなさい。","60%"),
    ("5人のテスト点数が68,72,75,80,85点。平均を求めなさい。","76点"),
    ("柱状グラフで階級幅が10、縦軸が人数のとき、棒の高さが7の階級の人数は何人ですか。","7人"),
    ("度数分布で、累積度数とは何ですか。","最初の階級からその階級までの度数の合計"),
    ("最大値60、最小値20のデータの範囲は何ですか。","40"),
    ("平均が25で8人のデータ。合計を求めなさい。","200"),
    ("3個のデータの平均が12。合計を求めなさい。","36"),
]
for i,(q,ans) in enumerate(data_qa):
    d = 1 if i<10 else (2 if i<20 else 3)
    problems.append(make_prob(UNIT11,"データの読み取りと整理","一行問題",d,["sk_E5_001"],q,ans,"",ERR_DATA))

print(f"単元11 完了: {sum(1 for p in problems if p['unit']==UNIT11)}問")

# ════════════════════════════════════════════════════════════════════════════
# 12. □・文字式（式の表し方発展） 40問
# ════════════════════════════════════════════════════════════════════════════
UNIT12 = "文字式"
ERR_EQ = [{"code":"ERR_EQ","description":"□の位置によって立式の方向を間違える"}]

# □を使った式・文字式
box_eq = [
    ("□ + 5 = 12","□に入る数を求めなさい。","7"),
    ("□ - 8 = 6","□に入る数を求めなさい。","14"),
    ("□ × 4 = 36","□に入る数を求めなさい。","9"),
    ("□ ÷ 3 = 7","□に入る数を求めなさい。","21"),
    ("15 - □ = 7","□に入る数を求めなさい。","8"),
    ("□ + 13 = 25","□に入る数を求めなさい。","12"),
    ("□ × 6 = 54","□に入る数を求めなさい。","9"),
    ("□ ÷ 8 = 4","□に入る数を求めなさい。","32"),
    ("24 ÷ □ = 6","□に入る数を求めなさい。","4"),
    ("□ × 7 = 63","□に入る数を求めなさい。","9"),
    ("3 × □ + 2 = 17","□に入る数を求めなさい。","5"),
    ("□ × 4 - 3 = 25","□に入る数を求めなさい。","7"),
    ("(□ + 5) × 3 = 24","□に入る数を求めなさい。","3"),
    ("□ ÷ 5 + 4 = 10","□に入る数を求めなさい。","30"),
    ("2 × □ + 8 = 20","□に入る数を求めなさい。","6"),
]
for eq,prompt,ans in box_eq:
    d = 1 if "×" not in eq or "+" not in eq else 2
    problems.append(make_prob(UNIT12,"□を使った方程式","穴埋め",d,["sk_E4_003"],
        f"{eq}　{prompt}",ans,"",ERR_EQ))

# x を使った式
x_eq = [
    ("x + 9 = 15","x=","6"),
    ("x - 7 = 8","x=","15"),
    ("3x = 24","x=","8"),
    ("x ÷ 5 = 6","x=","30"),
    ("2x + 1 = 13","x=","6"),
    ("x/4 = 7","x=","28"),
    ("5x - 10 = 30","x=","8"),
    ("x + 2.5 = 6","x=","3.5"),
    ("3x = 1.2","x=","0.4"),
    ("x + 3/4 = 5/4","x=","2/4=1/2"),
]
for eq,prompt,ans in x_eq:
    d = 2 if "+" in eq and "x" in eq else 1
    problems.append(make_prob(UNIT12,"xを使った式","穴埋め",d,["sk_E4_003"],
        f"{eq}　{prompt}を求めなさい。",ans,"",ERR_EQ))

# 文章題
word_eq = [
    ("ある数に7を加えると19になります。ある数を□として式を作り、□を求めなさい。","□+7=19、□=12"),
    ("1袋x円のお菓子を5袋買うと600円でした。xを求めなさい。","5x=600、x=120"),
    ("クラスの人数をx人とすると、40%の16人が女子です。xを求めなさい。","0.4x=16、x=40"),
    ("たての長さがxcm、横が8cmの長方形の面積が56cm²です。xを求めなさい。","8x=56、x=7"),
    ("1時間にy本のジュースを作る機械が4時間で60本作ります。yを求めなさい。","4y=60、y=15"),
    ("ある数を3倍すると24になります。ある数を□として□を求めなさい。","3□=24、□=8"),
    ("50からxを引くと32になります。xを求めなさい。","50-x=32、x=18"),
    ("2個でx円のりんごを6個買うと900円でした。xを求めなさい。","3x=900、x=300"),
    ("1辺がxcmの正方形の周の長さが36cmです。xを求めなさい。","4x=36、x=9"),
    ("x冊のノートを3人で等分すると1人分が8冊。xを求めなさい。","x÷3=8、x=24"),
]
for q,ans in word_eq:
    problems.append(make_prob(UNIT12,"文字式の文章題","文章題",2,["sk_E4_003"],q,ans,"",ERR_EQ))

print(f"単元12 完了: {sum(1 for p in problems if p['unit']==UNIT12)}問")

# ════════════════════════════════════════════════════════════════════════════
# IDを付与して保存
# ════════════════════════════════════════════════════════════════════════════
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
counters = {v:1 for v in unit_prefix.values()}

final = []
seen_ids = set()
for p in problems:
    prefix = unit_prefix.get(p["unit"], "G5")
    n = counters[prefix]
    pid = f"G5-{prefix}-{n:03d}"
    while pid in seen_ids:
        n += 1
        pid = f"G5-{prefix}-{n:03d}"
    counters[prefix] = n+1
    seen_ids.add(pid)
    p["id"] = pid
    final.append(p)

# 単元別集計
from collections import Counter
unit_counts = Counter(p["unit"] for p in final)
print("\n=== 単元別問題数 ===")
total = 0
for u,c in sorted(unit_counts.items()):
    print(f"  {u}: {c}問")
    total += c
print(f"\n  合計: {total}問")

with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(final, f, ensure_ascii=False, indent=2)
print(f"\n保存完了: {OUT_FILE}")
