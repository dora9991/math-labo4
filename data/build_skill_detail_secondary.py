#!/usr/bin/env python3
"""中学・高校 詳細スキルマスター JSON 生成スクリプト"""

import json
from pathlib import Path

out_path = Path(__file__).parent / "skill_detail_secondary.json"

details = [
    # ===== 中1 =====
    # sk_M1_001: 正負の数の概念・数直線
    {"id":"sk_M1_001_01","parent":"sk_M1_001","name":"負の数の概念・意味","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"正負の数の概念","is_bottleneck":False,"prerequisite_skill_ids":["sk_E6_005_01"],"description":"負の数の意味（借金・気温など）を理解し正負を区別できる"},
    {"id":"sk_M1_001_02","parent":"sk_M1_001","name":"数直線上の正負の数の位置","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"正負の数の概念","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_001_01"],"description":"数直線上に正の数・負の数を正確に位置付けられる"},
    {"id":"sk_M1_001_03","parent":"sk_M1_001","name":"自然数・整数・有理数の分類","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"正負の数の概念","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_001_02"],"description":"自然数・整数・分数を正しく分類し集合の包含関係を理解できる"},

    # sk_M1_002: 正負の数の大小・絶対値
    {"id":"sk_M1_002_01","parent":"sk_M1_002","name":"絶対値の定義と求め方","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"絶対値と大小","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_001_02"],"description":"絶対値の意味を理解し正負の数の絶対値を求められる"},
    {"id":"sk_M1_002_02","parent":"sk_M1_002","name":"正負の数の大小比較","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"絶対値と大小","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_002_01"],"description":"数直線を使って正負の数の大小を不等号で正しく表せる"},
    {"id":"sk_M1_002_03","parent":"sk_M1_002","name":"複数の正負の数を順に並べる","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"絶対値と大小","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_002_02"],"description":"複数の正負の数を小さい順・大きい順に並べられる"},

    # sk_M1_003: 正負の数の加法・減法 ★ボトルネック
    {"id":"sk_M1_003_01","parent":"sk_M1_003","name":"同符号の数の加法","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"加法・減法","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_002_01"],"description":"同符号の2数の和を絶対値の和・共通の符号で求められる"},
    {"id":"sk_M1_003_02","parent":"sk_M1_003","name":"異符号の数の加法","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"加法・減法","is_bottleneck":True,"prerequisite_skill_ids":["sk_M1_003_01"],"description":"異符号の2数の和を絶対値の差・大きい方の符号で求められる"},
    {"id":"sk_M1_003_03","parent":"sk_M1_003","name":"正負の数の減法（加法への変換）","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"加法・減法","is_bottleneck":True,"prerequisite_skill_ids":["sk_M1_003_02"],"description":"引き算を「符号を変えた数を足す」に変換して計算できる"},
    {"id":"sk_M1_003_04","parent":"sk_M1_003","name":"正負の数の加減混合計算","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"加法・減法","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_003_03"],"description":"複数項の加減混合を正の項・負の項に整理して効率よく計算できる"},

    # sk_M1_004: 正負の数の乗法・除法
    {"id":"sk_M1_004_01","parent":"sk_M1_004","name":"正負の数の乗法（符号の決定）","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"乗法・除法","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_003_04"],"description":"同符号の積は正、異符号の積は負になるルールを使って計算できる"},
    {"id":"sk_M1_004_02","parent":"sk_M1_004","name":"正負の数の除法","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"乗法・除法","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_004_01"],"description":"正負の数の割り算を符号のルールを使って計算できる"},
    {"id":"sk_M1_004_03","parent":"sk_M1_004","name":"複数の正負の数の乗除","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"乗法・除法","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_004_02"],"description":"3個以上の正負の数の乗除で符号を先に決めて絶対値を計算できる"},

    # sk_M1_005: 四則混合・累乗
    {"id":"sk_M1_005_01","parent":"sk_M1_005","name":"累乗の計算","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"四則混合・累乗","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_004_01"],"description":"正負の数の累乗を計算し(-2)²と-2²の違いを理解できる"},
    {"id":"sk_M1_005_02","parent":"sk_M1_005","name":"四則混合計算の順序","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"四則混合・累乗","is_bottleneck":True,"prerequisite_skill_ids":["sk_M1_005_01"],"description":"累乗→乗除→加減の順と括弧の優先順位を守って正確に計算できる"},
    {"id":"sk_M1_005_03","parent":"sk_M1_005","name":"正負の数の活用（平均など）","grade":"中1","subject":"数学","unit":"正の数・負の数","subunit":"四則混合・累乗","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_005_02"],"description":"正負の数を使った平均や増減の計算を文脈に沿って解ける"},

    # sk_M1_006: 文字と式の基礎 ★ボトルネック
    {"id":"sk_M1_006_01","parent":"sk_M1_006","name":"文字式の書き方・省略のルール","grade":"中1","subject":"数学","unit":"文字の式","subunit":"文字式の基礎","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_005_02"],"description":"×・÷の省略、係数1の省略など文字式の表記ルールを正しく使える"},
    {"id":"sk_M1_006_02","parent":"sk_M1_006","name":"文字式の意味の読み取り","grade":"中1","subject":"数学","unit":"文字の式","subunit":"文字式の基礎","is_bottleneck":True,"prerequisite_skill_ids":["sk_M1_006_01"],"description":"3aが「aを3倍した数」など文字式の意味を言葉で説明できる"},
    {"id":"sk_M1_006_03","parent":"sk_M1_006","name":"数量の文字式による表現","grade":"中1","subject":"数学","unit":"文字の式","subunit":"文字式の基礎","is_bottleneck":True,"prerequisite_skill_ids":["sk_M1_006_02"],"description":"速さ・割合など日常の数量を文字式で正しく表せる"},
    {"id":"sk_M1_006_04","parent":"sk_M1_006","name":"項・係数・次数の識別","grade":"中1","subject":"数学","unit":"文字の式","subunit":"文字式の基礎","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_006_01"],"description":"多項式の項・係数・次数を正しく答えられる"},

    # sk_M1_007: 文字式の計算
    {"id":"sk_M1_007_01","parent":"sk_M1_007","name":"一次式の加法・減法","grade":"中1","subject":"数学","unit":"文字の式","subunit":"文字式の計算","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_006_04"],"description":"同類項をまとめて一次式の加減を正確に計算できる"},
    {"id":"sk_M1_007_02","parent":"sk_M1_007","name":"一次式と数の乗除","grade":"中1","subject":"数学","unit":"文字の式","subunit":"文字式の計算","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_007_01"],"description":"(2x+3)×4のように一次式と数の乗除を分配法則で計算できる"},
    {"id":"sk_M1_007_03","parent":"sk_M1_007","name":"複数の一次式の混合計算","grade":"中1","subject":"数学","unit":"文字の式","subunit":"文字式の計算","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_007_02"],"description":"括弧を含む一次式の加減乗除混合を正確に処理できる"},

    # sk_M1_008: 文字式への代入
    {"id":"sk_M1_008_01","parent":"sk_M1_008","name":"式への数値の代入","grade":"中1","subject":"数学","unit":"文字の式","subunit":"代入と式の値","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_007_01"],"description":"文字式に数値を代入して式の値を正確に求められる"},
    {"id":"sk_M1_008_02","parent":"sk_M1_008","name":"負の数の代入と符号の処理","grade":"中1","subject":"数学","unit":"文字の式","subunit":"代入と式の値","is_bottleneck":True,"prerequisite_skill_ids":["sk_M1_008_01"],"description":"負の数や分数を代入するとき括弧を使い符号ミスなく計算できる"},
    {"id":"sk_M1_008_03","parent":"sk_M1_008","name":"文字式の等式・関係式での利用","grade":"中1","subject":"数学","unit":"文字の式","subunit":"代入と式の値","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_008_02"],"description":"等式・不等式を文字式で表し代入して確認できる"},

    # sk_M1_009: 一次方程式の解き方 ★ボトルネック
    {"id":"sk_M1_009_01","parent":"sk_M1_009","name":"等式の性質と移項","grade":"中1","subject":"数学","unit":"方程式","subunit":"一次方程式","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_008_01"],"description":"等式の性質（両辺に同じ数を加減乗除）と移項を理解して使える"},
    {"id":"sk_M1_009_02","parent":"sk_M1_009","name":"ax=b型・ax+b=c型の解法","grade":"中1","subject":"数学","unit":"方程式","subunit":"一次方程式","is_bottleneck":True,"prerequisite_skill_ids":["sk_M1_009_01"],"description":"移項を使ってax=bの形にし両辺をaで割る手順を確実に実行できる"},
    {"id":"sk_M1_009_03","parent":"sk_M1_009","name":"かっこ・分数を含む一次方程式","grade":"中1","subject":"数学","unit":"方程式","subunit":"一次方程式","is_bottleneck":True,"prerequisite_skill_ids":["sk_M1_009_02"],"description":"展開・通分を先に行って一次方程式を標準形に変形し解ける"},
    {"id":"sk_M1_009_04","parent":"sk_M1_009","name":"比の方程式","grade":"中1","subject":"数学","unit":"方程式","subunit":"一次方程式","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_009_03"],"description":"a:b=c:dの形の比の方程式を内項・外項の積を使って解ける"},

    # sk_M1_010: 一次方程式の文章題 ★ボトルネック
    {"id":"sk_M1_010_01","parent":"sk_M1_010","name":"文章題の方程式への翻訳","grade":"中1","subject":"数学","unit":"方程式","subunit":"文章題","is_bottleneck":True,"prerequisite_skill_ids":["sk_M1_009_02"],"description":"未知数をxとおき問題の条件を一次方程式に立式できる"},
    {"id":"sk_M1_010_02","parent":"sk_M1_010","name":"数・年齢・代金の文章題","grade":"中1","subject":"数学","unit":"方程式","subunit":"文章題","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_010_01"],"description":"数・年齢・代金に関する一次方程式の文章題を解き答えを検証できる"},
    {"id":"sk_M1_010_03","parent":"sk_M1_010","name":"速さ・割合・濃度の文章題","grade":"中1","subject":"数学","unit":"方程式","subunit":"文章題","is_bottleneck":True,"prerequisite_skill_ids":["sk_M1_010_02"],"description":"速さ・割合・濃度をテーブルで整理して方程式を立て解ける"},

    # sk_M1_011: 比例・関数の概念
    {"id":"sk_M1_011_01","parent":"sk_M1_011","name":"関数の概念・対応表","grade":"中1","subject":"数学","unit":"比例と反比例","subunit":"関数の概念","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_008_01"],"description":"xの値が決まるとyの値が一つに決まる関係を関数として理解できる"},
    {"id":"sk_M1_011_02","parent":"sk_M1_011","name":"比例y=axの意味と定数の求め方","grade":"中1","subject":"数学","unit":"比例と反比例","subunit":"比例","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_011_01"],"description":"比例y=axの比例定数aを一組の値から求められる"},
    {"id":"sk_M1_011_03","parent":"sk_M1_011","name":"反比例y=a/xの意味と定数の求め方","grade":"中1","subject":"数学","unit":"比例と反比例","subunit":"反比例","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_011_02"],"description":"反比例y=a/xの比例定数aを一組の値から求められる"},
    {"id":"sk_M1_011_04","parent":"sk_M1_011","name":"比例・反比例の区別と利用","grade":"中1","subject":"数学","unit":"比例と反比例","subunit":"関数の概念","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_011_03"],"description":"式・表・グラフから比例か反比例かを判断して活用できる"},

    # sk_M1_012: 比例・反比例のグラフ
    {"id":"sk_M1_012_01","parent":"sk_M1_012","name":"座標の読み取りと点のプロット","grade":"中1","subject":"数学","unit":"比例と反比例","subunit":"グラフ","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_011_01"],"description":"座標平面上の点の座標を読み取り、指定した点をプロットできる"},
    {"id":"sk_M1_012_02","parent":"sk_M1_012","name":"比例のグラフの作図と読み取り","grade":"中1","subject":"数学","unit":"比例と反比例","subunit":"グラフ","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_012_01","sk_M1_011_02"],"description":"y=axのグラフを原点を通る直線として正確に作図し特徴を説明できる"},
    {"id":"sk_M1_012_03","parent":"sk_M1_012","name":"反比例のグラフの作図と読み取り","grade":"中1","subject":"数学","unit":"比例と反比例","subunit":"グラフ","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_012_02","sk_M1_011_03"],"description":"y=a/xのグラフを双曲線として作図し比例との違いを説明できる"},
    {"id":"sk_M1_012_04","parent":"sk_M1_012","name":"グラフを使った問題解決","grade":"中1","subject":"数学","unit":"比例と反比例","subunit":"グラフ","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_012_03"],"description":"グラフから値を読み取り速さや割合の問題を解決できる"},

    # ===== 中2 =====
    # sk_M2_001: 連立方程式（加減法）
    {"id":"sk_M2_001_01","parent":"sk_M2_001","name":"連立方程式の意味と解の確認","grade":"中2","subject":"数学","unit":"連立方程式","subunit":"加減法","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_009_03"],"description":"2元1次方程式の意味と連立方程式の解の定義を理解できる"},
    {"id":"sk_M2_001_02","parent":"sk_M2_001","name":"加減法による連立方程式の解法","grade":"中2","subject":"数学","unit":"連立方程式","subunit":"加減法","is_bottleneck":True,"prerequisite_skill_ids":["sk_M2_001_01"],"description":"係数を揃えて一方の文字を消去する加減法を確実に実行できる"},
    {"id":"sk_M2_001_03","parent":"sk_M2_001","name":"係数を整数倍して消去する加減法","grade":"中2","subject":"数学","unit":"連立方程式","subunit":"加減法","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_001_02"],"description":"係数が一致しない場合に適切な倍数をかけて消去できる"},

    # sk_M2_002: 連立方程式（代入法）
    {"id":"sk_M2_002_01","parent":"sk_M2_002","name":"代入法による連立方程式の解法","grade":"中2","subject":"数学","unit":"連立方程式","subunit":"代入法","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_001_02"],"description":"一方の式を他方に代入して1文字の方程式を作り解ける"},
    {"id":"sk_M2_002_02","parent":"sk_M2_002","name":"かっこ・分数を含む連立方程式","grade":"中2","subject":"数学","unit":"連立方程式","subunit":"代入法","is_bottleneck":True,"prerequisite_skill_ids":["sk_M2_002_01"],"description":"括弧の展開・通分を行って整理してから連立方程式を解ける"},
    {"id":"sk_M2_002_03","parent":"sk_M2_002","name":"連立方程式の文章題","grade":"中2","subject":"数学","unit":"連立方程式","subunit":"文章題","is_bottleneck":True,"prerequisite_skill_ids":["sk_M2_002_02"],"description":"2つの未知数をx・yとおき2つの条件から連立方程式を立て解ける"},

    # sk_M2_003: 一次関数の式と変化の割合
    {"id":"sk_M2_003_01","parent":"sk_M2_003","name":"一次関数の意味・変化の割合","grade":"中2","subject":"数学","unit":"一次関数","subunit":"一次関数の式","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_012_02"],"description":"y=ax+bの変化の割合がaに等しいことを理解し計算できる"},
    {"id":"sk_M2_003_02","parent":"sk_M2_003","name":"傾きと切片からグラフを作図","grade":"中2","subject":"数学","unit":"一次関数","subunit":"グラフ","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_003_01"],"description":"傾きaと切片bからy=ax+bのグラフを正確に作図できる"},
    {"id":"sk_M2_003_03","parent":"sk_M2_003","name":"2点・傾き+1点から式を求める","grade":"中2","subject":"数学","unit":"一次関数","subunit":"一次関数の式","is_bottleneck":True,"prerequisite_skill_ids":["sk_M2_003_02"],"description":"2点の座標や傾きと1点からy=ax+bの式を決定できる"},
    {"id":"sk_M2_003_04","parent":"sk_M2_003","name":"一次関数の文章題・グラフ利用","grade":"中2","subject":"数学","unit":"一次関数","subunit":"文章題","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_003_03"],"description":"時間・距離・料金などを一次関数でモデル化し問題を解ける"},

    # sk_M2_004: 多項式の展開・因数分解 ★ボトルネック
    {"id":"sk_M2_004_01","parent":"sk_M2_004","name":"単項式×多項式の展開","grade":"中2","subject":"数学","unit":"式の計算","subunit":"展開","is_bottleneck":False,"prerequisite_skill_ids":["sk_M1_007_02"],"description":"分配法則を使って単項式と多項式の積を展開できる"},
    {"id":"sk_M2_004_02","parent":"sk_M2_004","name":"乗法公式による展開","grade":"中2","subject":"数学","unit":"式の計算","subunit":"展開","is_bottleneck":True,"prerequisite_skill_ids":["sk_M2_004_01"],"description":"(a+b)²(a-b)²(a+b)(a-b)(x+a)(x+b)の4公式を使って展開できる"},
    {"id":"sk_M2_004_03","parent":"sk_M2_004","name":"共通因数による因数分解","grade":"中2","subject":"数学","unit":"式の計算","subunit":"因数分解","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_004_02"],"description":"共通因数をくくりだして因数分解できる"},
    {"id":"sk_M2_004_04","parent":"sk_M2_004","name":"公式を使った因数分解","grade":"中2","subject":"数学","unit":"式の計算","subunit":"因数分解","is_bottleneck":True,"prerequisite_skill_ids":["sk_M2_004_03"],"description":"乗法公式の逆を使ってx²+(a+b)x+ab形などを因数分解できる"},

    # sk_M2_005: 図形の性質（平行線・多角形の角）
    {"id":"sk_M2_005_01","parent":"sk_M2_005","name":"平行線と同位角・錯角","grade":"中2","subject":"数学","unit":"図形","subunit":"平行線の性質","is_bottleneck":False,"prerequisite_skill_ids":[],"description":"平行線における同位角・錯角が等しいことを理解し角度を求められる"},
    {"id":"sk_M2_005_02","parent":"sk_M2_005","name":"三角形の内角・外角の性質","grade":"中2","subject":"数学","unit":"図形","subunit":"多角形の角","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_005_01"],"description":"三角形の内角の和と外角の定理を使って未知の角度を求められる"},
    {"id":"sk_M2_005_03","parent":"sk_M2_005","name":"多角形の内角・外角の和","grade":"中2","subject":"数学","unit":"図形","subunit":"多角形の角","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_005_02"],"description":"n角形の内角の和180(n-2)と外角の和360°を使って計算できる"},

    # sk_M2_006: 三角形の合同・証明の基礎
    {"id":"sk_M2_006_01","parent":"sk_M2_006","name":"三角形の合同条件の理解","grade":"中2","subject":"数学","unit":"図形","subunit":"合同","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_005_02"],"description":"三角形の3つの合同条件を正確に覚えて適用できる"},
    {"id":"sk_M2_006_02","parent":"sk_M2_006","name":"合同の証明の書き方（仮定・結論・根拠）","grade":"中2","subject":"数学","unit":"図形","subunit":"証明","is_bottleneck":True,"prerequisite_skill_ids":["sk_M2_006_01"],"description":"合同の証明を仮定→根拠→結論の形式で正しく記述できる"},
    {"id":"sk_M2_006_03","parent":"sk_M2_006","name":"二等辺三角形・平行四辺形の性質と証明","grade":"中2","subject":"数学","unit":"図形","subunit":"証明","is_bottleneck":True,"prerequisite_skill_ids":["sk_M2_006_02"],"description":"二等辺三角形・平行四辺形の性質を合同を使って証明できる"},

    # sk_M2_007: 確率の基礎
    {"id":"sk_M2_007_01","parent":"sk_M2_007","name":"確率の定義と求め方（等確率）","grade":"中2","subject":"数学","unit":"確率","subunit":"確率の基礎","is_bottleneck":False,"prerequisite_skill_ids":[],"description":"同様に確からしい場合の数を使って確率p=a/nで求められる"},
    {"id":"sk_M2_007_02","parent":"sk_M2_007","name":"樹形図・表による場合の数の整理","grade":"中2","subject":"数学","unit":"確率","subunit":"確率の基礎","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_007_01"],"description":"コインやサイコロの試行を樹形図・表で整理して確率を求められる"},
    {"id":"sk_M2_007_03","parent":"sk_M2_007","name":"余事象・確率の加法","grade":"中2","subject":"数学","unit":"確率","subunit":"確率の応用","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_007_02"],"description":"「少なくとも1つ」は余事象を使う方が効率的と判断して計算できる"},

    # ===== 中3 =====
    # sk_M3_001: 二次方程式
    {"id":"sk_M3_001_01","parent":"sk_M3_001","name":"因数分解による二次方程式の解法","grade":"中3","subject":"数学","unit":"二次方程式","subunit":"二次方程式の解法","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_004_04"],"description":"因数分解を使ってax²+bx+c=0を解くことができる"},
    {"id":"sk_M3_001_02","parent":"sk_M3_001","name":"平方根を使った解法","grade":"中3","subject":"数学","unit":"二次方程式","subunit":"二次方程式の解法","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_001_01"],"description":"(x-p)²=qの形に変形して平方根で解ける"},
    {"id":"sk_M3_001_03","parent":"sk_M3_001","name":"解の公式による解法","grade":"中3","subject":"数学","unit":"二次方程式","subunit":"二次方程式の解法","is_bottleneck":True,"prerequisite_skill_ids":["sk_M3_001_02"],"description":"解の公式x=(-b±√(b²-4ac))/2aを正確に使って二次方程式を解ける"},
    {"id":"sk_M3_001_04","parent":"sk_M3_001","name":"二次方程式の文章題","grade":"中3","subject":"数学","unit":"二次方程式","subunit":"文章題","is_bottleneck":True,"prerequisite_skill_ids":["sk_M3_001_03"],"description":"面積・速さ・連続する整数などを二次方程式でモデル化して解ける"},

    # sk_M3_002: y=ax²
    {"id":"sk_M3_002_01","parent":"sk_M3_002","name":"y=ax²の式と比例定数の求め方","grade":"中3","subject":"数学","unit":"関数y=ax²","subunit":"y=ax²の式","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_003_01"],"description":"y=ax²の比例定数aを1点の座標から求められる"},
    {"id":"sk_M3_002_02","parent":"sk_M3_002","name":"y=ax²のグラフの特徴と作図","grade":"中3","subject":"数学","unit":"関数y=ax²","subunit":"グラフ","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_002_01"],"description":"放物線の頂点・軸・開口方向を説明しグラフを作図できる"},
    {"id":"sk_M3_002_03","parent":"sk_M3_002","name":"y=ax²の変化の割合","grade":"中3","subject":"数学","unit":"関数y=ax²","subunit":"変化の割合","is_bottleneck":True,"prerequisite_skill_ids":["sk_M3_002_02"],"description":"二次関数の変化の割合Δy/Δxを計算し一次関数と違いを説明できる"},
    {"id":"sk_M3_002_04","parent":"sk_M3_002","name":"y=ax²と一次関数の交点・面積問題","grade":"中3","subject":"数学","unit":"関数y=ax²","subunit":"応用","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_002_03"],"description":"放物線と直線の交点座標を求め三角形の面積を計算できる"},

    # sk_M3_003: 平方根の計算 ★ボトルネック
    {"id":"sk_M3_003_01","parent":"sk_M3_003","name":"平方根の意味と√の表し方","grade":"中3","subject":"数学","unit":"平方根","subunit":"平方根の概念","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_004_02"],"description":"平方根の定義を理解し√aの意味と値を答えられる"},
    {"id":"sk_M3_003_02","parent":"sk_M3_003","name":"平方根の乗法・除法","grade":"中3","subject":"数学","unit":"平方根","subunit":"平方根の計算","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_003_01"],"description":"√a×√b=√(ab)などの性質を使って乗除を計算できる"},
    {"id":"sk_M3_003_03","parent":"sk_M3_003","name":"根号の変形・有理化","grade":"中3","subject":"数学","unit":"平方根","subunit":"平方根の計算","is_bottleneck":True,"prerequisite_skill_ids":["sk_M3_003_02"],"description":"√の中の数を簡単にし分母の有理化を正確に実行できる"},
    {"id":"sk_M3_003_04","parent":"sk_M3_003","name":"平方根を含む加減・混合計算","grade":"中3","subject":"数学","unit":"平方根","subunit":"平方根の計算","is_bottleneck":True,"prerequisite_skill_ids":["sk_M3_003_03"],"description":"同じ根号の項をまとめ乗法公式も使って複雑な√計算を実行できる"},

    # sk_M3_004: 図形の相似・相似比
    {"id":"sk_M3_004_01","parent":"sk_M3_004","name":"相似の意味と相似条件","grade":"中3","subject":"数学","unit":"図形","subunit":"相似","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_006_01"],"description":"三角形の3つの相似条件を理解し相似な三角形を判断できる"},
    {"id":"sk_M3_004_02","parent":"sk_M3_004","name":"相似比と辺の長さの計算","grade":"中3","subject":"数学","unit":"図形","subunit":"相似","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_004_01"],"description":"相似比m:nを使って対応する辺の長さを求められる"},
    {"id":"sk_M3_004_03","parent":"sk_M3_004","name":"面積比・体積比と相似比","grade":"中3","subject":"数学","unit":"図形","subunit":"相似","is_bottleneck":True,"prerequisite_skill_ids":["sk_M3_004_02"],"description":"相似比m:nなら面積比m²:n²・体積比m³:n³になることを使い計算できる"},
    {"id":"sk_M3_004_04","parent":"sk_M3_004","name":"平行線と線分の比・中点連結定理","grade":"中3","subject":"数学","unit":"図形","subunit":"相似の利用","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_004_02"],"description":"平行線と線分比の定理・中点連結定理を適用して長さを求められる"},

    # sk_M3_005: 三平方の定理 ★ボトルネック
    {"id":"sk_M3_005_01","parent":"sk_M3_005","name":"三平方の定理の理解と証明の概要","grade":"中3","subject":"数学","unit":"図形","subunit":"三平方の定理","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_003_02"],"description":"a²+b²=c²を理解し直角三角形の辺の長さを求められる"},
    {"id":"sk_M3_005_02","parent":"sk_M3_005","name":"特殊な直角三角形（30-60-90, 45-45-90）","grade":"中3","subject":"数学","unit":"図形","subunit":"三平方の定理","is_bottleneck":True,"prerequisite_skill_ids":["sk_M3_005_01"],"description":"1:1:√2と1:√3:2の辺比を記憶し素早く辺の長さを求められる"},
    {"id":"sk_M3_005_03","parent":"sk_M3_005","name":"平面図形への三平方の定理の応用","grade":"中3","subject":"数学","unit":"図形","subunit":"三平方の定理の応用","is_bottleneck":True,"prerequisite_skill_ids":["sk_M3_005_02"],"description":"対角線・高さ・面積など平面図形の問題を三平方で解ける"},
    {"id":"sk_M3_005_04","parent":"sk_M3_005","name":"空間図形への三平方の定理の応用","grade":"中3","subject":"数学","unit":"図形","subunit":"三平方の定理の応用","is_bottleneck":True,"prerequisite_skill_ids":["sk_M3_005_03"],"description":"直方体・三角錐などの立体の辺・面・体対角線を三平方で求められる"},

    # sk_M3_006: 円の性質（円周角定理）
    {"id":"sk_M3_006_01","parent":"sk_M3_006","name":"円周角の定理と中心角","grade":"中3","subject":"数学","unit":"図形","subunit":"円の性質","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_005_02"],"description":"円周角は中心角の半分という定理を使って角度を求められる"},
    {"id":"sk_M3_006_02","parent":"sk_M3_006","name":"円周角の定理の逆（4点共円）","grade":"中3","subject":"数学","unit":"図形","subunit":"円の性質","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_006_01"],"description":"円周角の定理の逆を使って4点が同一円上にあることを示せる"},
    {"id":"sk_M3_006_03","parent":"sk_M3_006","name":"円と接線・弦の性質","grade":"中3","subject":"数学","unit":"図形","subunit":"円の性質","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_006_02"],"description":"接線の性質・弦の性質を使って長さや角度を求められる"},

    # ===== 高1 =====
    # sk_H1_001: 式の展開（乗法公式）
    {"id":"sk_H1_001_01","parent":"sk_H1_001","name":"多項式の乗法（分配法則）","grade":"高1","subject":"数学I","unit":"数と式","subunit":"式の展開","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_004_02"],"description":"(a+b)(c+d)型を分配法則で展開できる"},
    {"id":"sk_H1_001_02","parent":"sk_H1_001","name":"乗法公式（(a±b)²・(a+b)(a-b)）","grade":"高1","subject":"数学I","unit":"数と式","subunit":"式の展開","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_001_01"],"description":"中学で学んだ乗法公式を高校レベルの式に拡張して使える"},
    {"id":"sk_H1_001_03","parent":"sk_H1_001","name":"(a+b+c)²・(a+b)³などの展開","grade":"高1","subject":"数学I","unit":"数と式","subunit":"式の展開","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_001_02"],"description":"3項以上や3乗の展開公式を正確に適用できる"},

    # sk_H1_002: 因数分解（応用）
    {"id":"sk_H1_002_01","parent":"sk_H1_002","name":"たすきがけによる因数分解","grade":"高1","subject":"数学I","unit":"数と式","subunit":"因数分解","is_bottleneck":True,"prerequisite_skill_ids":["sk_M2_004_04"],"description":"ax²+bx+cをたすきがけで因数分解できる"},
    {"id":"sk_H1_002_02","parent":"sk_H1_002","name":"置換・グループ化による因数分解","grade":"高1","subject":"数学I","unit":"数と式","subunit":"因数分解","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_002_01"],"description":"共通部分の置換やグループ分けで複雑な式を因数分解できる"},
    {"id":"sk_H1_002_03","parent":"sk_H1_002","name":"因数分解と整式への活用","grade":"高1","subject":"数学I","unit":"数と式","subunit":"因数分解","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_002_02"],"description":"方程式・不等式の解決に因数分解を適切に活用できる"},

    # sk_H1_003: 平方根・無理数の計算
    {"id":"sk_H1_003_01","parent":"sk_H1_003","name":"√の変形・有理化（高校レベル）","grade":"高1","subject":"数学I","unit":"数と式","subunit":"実数","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_003_04"],"description":"分母に√を含む複雑な式を有理化して簡単にできる"},
    {"id":"sk_H1_003_02","parent":"sk_H1_003","name":"二重根号・根号の整理","grade":"高1","subject":"数学I","unit":"数と式","subunit":"実数","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_003_01"],"description":"√(a±2√b)型の二重根号を外して整理できる"},

    # sk_H1_004: 実数の概念
    {"id":"sk_H1_004_01","parent":"sk_H1_004","name":"有理数・無理数・実数の分類","grade":"高1","subject":"数学I","unit":"数と式","subunit":"実数","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_003_01"],"description":"有理数・無理数・実数の包含関係を正確に説明できる"},
    {"id":"sk_H1_004_02","parent":"sk_H1_004","name":"絶対値を含む式の計算と不等式","grade":"高1","subject":"数学I","unit":"数と式","subunit":"実数","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_004_01"],"description":"|x-a|型の絶対値を場合分けで外して計算・解決できる"},

    # sk_H1_005: 2次方程式（解の公式・判別式）
    {"id":"sk_H1_005_01","parent":"sk_H1_005","name":"解の公式と複雑な二次方程式","grade":"高1","subject":"数学I","unit":"2次方程式","subunit":"二次方程式","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_001_03"],"description":"解の公式を高校レベルの係数（分数・文字）に拡張して使える"},
    {"id":"sk_H1_005_02","parent":"sk_H1_005","name":"判別式Dによる解の個数判定","grade":"高1","subject":"数学I","unit":"2次方程式","subunit":"判別式","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_005_01"],"description":"判別式D=b²-4acの符号で実数解の個数を判定できる"},
    {"id":"sk_H1_005_03","parent":"sk_H1_005","name":"解と係数の関係（ビエタの公式）","grade":"高1","subject":"数学I","unit":"2次方程式","subunit":"解と係数の関係","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_005_02"],"description":"解をα・βとしてα+βとαβをa・b・cで表せる"},

    # sk_H1_006: 2次関数（平方完成・頂点） ★ボトルネック
    {"id":"sk_H1_006_01","parent":"sk_H1_006","name":"平方完成の手順","grade":"高1","subject":"数学I","unit":"2次関数","subunit":"2次関数の基礎","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_005_01"],"description":"ax²+bx+cをa(x-p)²+q型に平方完成できる"},
    {"id":"sk_H1_006_02","parent":"sk_H1_006","name":"頂点・軸・グラフの作図","grade":"高1","subject":"数学I","unit":"2次関数","subunit":"グラフ","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_006_01"],"description":"平方完成の結果から頂点・軸を読み取りグラフを作図できる"},
    {"id":"sk_H1_006_03","parent":"sk_H1_006","name":"a・h・kによるグラフの平行移動","grade":"高1","subject":"数学I","unit":"2次関数","subunit":"グラフ","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_006_02"],"description":"a(x-h)²+kのa・h・kの変化がグラフに与える影響を説明できる"},

    # sk_H1_007: 2次関数の最大・最小・変域 ★ボトルネック
    {"id":"sk_H1_007_01","parent":"sk_H1_007","name":"変域なし・変域ありの最大最小","grade":"高1","subject":"数学I","unit":"2次関数","subunit":"最大・最小","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_006_02"],"description":"頂点と軸の位置・変域の関係から最大値・最小値を求められる"},
    {"id":"sk_H1_007_02","parent":"sk_H1_007","name":"軸が変域内外にある場合の場合分け","grade":"高1","subject":"数学I","unit":"2次関数","subunit":"最大・最小","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_007_01"],"description":"軸が変域の内・左・右にある3ケースを場合分けして最大最小を求める"},
    {"id":"sk_H1_007_03","parent":"sk_H1_007","name":"文字係数・頂点移動を含む最大最小","grade":"高1","subject":"数学I","unit":"2次関数","subunit":"最大・最小","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_007_02"],"description":"係数に文字を含む場合の最大最小を場合分けで整理して答えられる"},

    # sk_H1_008: 2次不等式
    {"id":"sk_H1_008_01","parent":"sk_H1_008","name":"2次不等式の解法（グラフ利用）","grade":"高1","subject":"数学I","unit":"2次関数","subunit":"2次不等式","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_007_01","sk_H1_005_02"],"description":"放物線とx軸の位置関係からax²+bx+c>0の解を求められる"},
    {"id":"sk_H1_008_02","parent":"sk_H1_008","name":"D=0・D<0の場合の2次不等式","grade":"高1","subject":"数学I","unit":"2次関数","subunit":"2次不等式","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_008_01"],"description":"判別式が0以下の場合に解が全実数・解なしになることを判断できる"},
    {"id":"sk_H1_008_03","parent":"sk_H1_008","name":"連立不等式・文字係数の2次不等式","grade":"高1","subject":"数学I","unit":"2次関数","subunit":"2次不等式","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_008_02"],"description":"2次不等式を含む連立不等式と文字係数の問題を解ける"},

    # sk_H1_009: 三角比（sin/cos/tan）
    {"id":"sk_H1_009_01","parent":"sk_H1_009","name":"直角三角形でのsin・cos・tan","grade":"高1","subject":"数学I","unit":"三角比","subunit":"三角比の定義","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_005_02"],"description":"直角三角形の辺の比としてsin・cos・tanを定義し値を求められる"},
    {"id":"sk_H1_009_02","parent":"sk_H1_009","name":"単位円による三角比の拡張（0°～180°）","grade":"高1","subject":"数学I","unit":"三角比","subunit":"三角比の拡張","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_009_01"],"description":"単位円を使って鈍角の三角比を求めsin²θ+cos²θ=1を使える"},
    {"id":"sk_H1_009_03","parent":"sk_H1_009","name":"三角比の相互関係と変換","grade":"高1","subject":"数学I","unit":"三角比","subunit":"三角比の相互関係","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_009_02"],"description":"3つの相互関係式を使って一方から他の三角比を求められる"},

    # sk_H1_010: 正弦定理・余弦定理
    {"id":"sk_H1_010_01","parent":"sk_H1_010","name":"正弦定理とその応用","grade":"高1","subject":"数学I","unit":"三角比","subunit":"正弦定理","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_009_02"],"description":"a/sinA=2Rを使って三角形の辺・角・外接円半径を求められる"},
    {"id":"sk_H1_010_02","parent":"sk_H1_010","name":"余弦定理とその応用","grade":"高1","subject":"数学I","unit":"三角比","subunit":"余弦定理","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_010_01"],"description":"余弦定理c²=a²+b²-2ab·cosCで辺・角を求め三角形を決定できる"},
    {"id":"sk_H1_010_03","parent":"sk_H1_010","name":"三角形の面積・測量問題","grade":"高1","subject":"数学I","unit":"三角比","subunit":"三角比の応用","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_010_02"],"description":"S=½absinCを使って面積を求め測量・空間の問題に応用できる"},

    # sk_H1_011: 場合の数（順列・組合せ）
    {"id":"sk_H1_011_01","parent":"sk_H1_011","name":"積の法則・和の法則","grade":"高1","subject":"数学A","unit":"場合の数","subunit":"基本原理","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_007_02"],"description":"積の法則と和の法則を使って場合の数を効率よく数えられる"},
    {"id":"sk_H1_011_02","parent":"sk_H1_011","name":"順列nPrの計算","grade":"高1","subject":"数学A","unit":"場合の数","subunit":"順列","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_011_01"],"description":"nPr=n!/(n-r)!を使って順番を考慮した選び方を求められる"},
    {"id":"sk_H1_011_03","parent":"sk_H1_011","name":"組合せnCrの計算","grade":"高1","subject":"数学A","unit":"場合の数","subunit":"組合せ","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_011_02"],"description":"nCr=nPr/r!=n!/(r!(n-r)!)で順番を考慮しない選び方を求められる"},
    {"id":"sk_H1_011_04","parent":"sk_H1_011","name":"重複・円順列・条件付き数え方","grade":"高1","subject":"数学A","unit":"場合の数","subunit":"応用","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_011_03"],"description":"円順列や条件付きの組合せ問題を正しく分類して解ける"},

    # sk_H1_012: 確率の計算（余事象・条件付き）
    {"id":"sk_H1_012_01","parent":"sk_H1_012","name":"確率の基本（等確率・加法定理）","grade":"高1","subject":"数学A","unit":"確率","subunit":"確率の計算","is_bottleneck":False,"prerequisite_skill_ids":["sk_M2_007_03","sk_H1_011_03"],"description":"排反事象の加法定理P(A∪B)=P(A)+P(B)を使って確率を求められる"},
    {"id":"sk_H1_012_02","parent":"sk_H1_012","name":"余事象の確率","grade":"高1","subject":"数学A","unit":"確率","subunit":"余事象","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_012_01"],"description":"P(Ā)=1-P(A)を使って「少なくとも1つ」などの確率を求められる"},
    {"id":"sk_H1_012_03","parent":"sk_H1_012","name":"条件付き確率と乗法定理","grade":"高1","subject":"数学A","unit":"確率","subunit":"条件付き確率","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_012_02"],"description":"P(B|A)=P(A∩B)/P(A)の条件付き確率を理解し計算できる"},

    # sk_H1_013: 整数の性質
    {"id":"sk_H1_013_01","parent":"sk_H1_013","name":"素因数分解と約数の個数","grade":"高1","subject":"数学A","unit":"整数の性質","subunit":"素因数分解","is_bottleneck":False,"prerequisite_skill_ids":[],"description":"素因数分解を使って最大公約数・最小公倍数・約数の個数を求められる"},
    {"id":"sk_H1_013_02","parent":"sk_H1_013","name":"ユークリッドの互除法","grade":"高1","subject":"数学A","unit":"整数の性質","subunit":"最大公約数","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_013_01"],"description":"互除法でGCDを求め、不定方程式ax+by=gcdの整数解を1つ求められる"},
    {"id":"sk_H1_013_03","parent":"sk_H1_013","name":"合同式（mod）と整数問題","grade":"高1","subject":"数学A","unit":"整数の性質","subunit":"整数の性質","is_bottleneck":True,"prerequisite_skill_ids":["sk_H1_013_02"],"description":"合同式a≡b(mod n)を使って余りの問題・整数の証明を解ける"},

    # sk_H1_014: 図形の性質（チェバ・円）
    {"id":"sk_H1_014_01","parent":"sk_H1_014","name":"メネラウスの定理","grade":"高1","subject":"数学A","unit":"図形の性質","subunit":"図形の定理","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_004_04"],"description":"メネラウスの定理を使って三角形の辺の比を求められる"},
    {"id":"sk_H1_014_02","parent":"sk_H1_014","name":"チェバの定理","grade":"高1","subject":"数学A","unit":"図形の性質","subunit":"図形の定理","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_014_01"],"description":"チェバの定理を使って三角形のセビアンの比の関係を示せる"},
    {"id":"sk_H1_014_03","parent":"sk_H1_014","name":"円の性質（方べきの定理・円と直線）","grade":"高1","subject":"数学A","unit":"図形の性質","subunit":"円の性質","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_006_03"],"description":"方べきの定理・接線と弦の角・2円の位置関係を使って問題を解ける"},

    # ===== 高2 =====
    # sk_H2_001: 式と証明
    {"id":"sk_H2_001_01","parent":"sk_H2_001","name":"恒等式の係数決定","grade":"高2","subject":"数学II","unit":"式と証明","subunit":"恒等式","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_001_03"],"description":"恒等式の両辺の係数を比較・特殊値代入で定数を決定できる"},
    {"id":"sk_H2_001_02","parent":"sk_H2_001","name":"因数定理と組立除法","grade":"高2","subject":"数学II","unit":"式と証明","subunit":"因数定理","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_001_01"],"description":"因数定理P(a)=0⟺(x-a)|P(x)を使って高次多項式を因数分解できる"},
    {"id":"sk_H2_001_03","parent":"sk_H2_001","name":"不等式の証明（相加相乗平均）","grade":"高2","subject":"数学II","unit":"式と証明","subunit":"不等式の証明","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_001_02"],"description":"差を取る・相加相乗平均の不等式を使って不等式を証明できる"},

    # sk_H2_002: 複素数・高次方程式
    {"id":"sk_H2_002_01","parent":"sk_H2_002","name":"複素数の四則演算","grade":"高2","subject":"数学II","unit":"複素数","subunit":"複素数の計算","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_005_02"],"description":"i²=-1を使って複素数の加減乗除を実部・虚部に整理して計算できる"},
    {"id":"sk_H2_002_02","parent":"sk_H2_002","name":"複素数の範囲での2次方程式","grade":"高2","subject":"数学II","unit":"複素数","subunit":"複素数と方程式","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_002_01"],"description":"D<0の場合に複素数の解を求め共役複素数の関係を説明できる"},
    {"id":"sk_H2_002_03","parent":"sk_H2_002","name":"高次方程式（3次・4次）","grade":"高2","subject":"数学II","unit":"複素数","subunit":"高次方程式","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_001_02","sk_H2_002_02"],"description":"因数定理を使って高次方程式を因数分解し全ての解を求められる"},

    # sk_H2_003: 図形と方程式
    {"id":"sk_H2_003_01","parent":"sk_H2_003","name":"2点間の距離・内外分点・重心","grade":"高2","subject":"数学II","unit":"図形と方程式","subunit":"点の座標","is_bottleneck":False,"prerequisite_skill_ids":["sk_M3_005_01"],"description":"座標平面上の距離・内外分点・重心の公式を使って計算できる"},
    {"id":"sk_H2_003_02","parent":"sk_H2_003","name":"直線の方程式と平行・垂直条件","grade":"高2","subject":"数学II","unit":"図形と方程式","subunit":"直線","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_003_01"],"description":"2点を通る直線の方程式を求め平行・垂直の条件を使えられる"},
    {"id":"sk_H2_003_03","parent":"sk_H2_003","name":"円の方程式と中心・半径","grade":"高2","subject":"数学II","unit":"図形と方程式","subunit":"円","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_003_02"],"description":"(x-a)²+(y-b)²=r²を使って円の方程式を求め標準形に変換できる"},
    {"id":"sk_H2_003_04","parent":"sk_H2_003","name":"直線と円の交点・共有点の個数","grade":"高2","subject":"数学II","unit":"図形と方程式","subunit":"円と直線","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_003_03"],"description":"判別式・距離を使って直線と円の共有点の個数と座標を求められる"},

    # sk_H2_004: 三角関数（弧度法・単位円） ★ボトルネック
    {"id":"sk_H2_004_01","parent":"sk_H2_004","name":"弧度法とラジアンへの変換","grade":"高2","subject":"数学II","unit":"三角関数","subunit":"弧度法","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_009_02"],"description":"弧度法の定義を理解し度とラジアンを相互変換できる"},
    {"id":"sk_H2_004_02","parent":"sk_H2_004","name":"単位円による三角関数の定義（全角度）","grade":"高2","subject":"数学II","unit":"三角関数","subunit":"三角関数の定義","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_004_01"],"description":"全実数θに対してsinθ・cosθ・tanθを単位円で定義し値を求められる"},
    {"id":"sk_H2_004_03","parent":"sk_H2_004","name":"三角関数のグラフと周期・振幅","grade":"高2","subject":"数学II","unit":"三角関数","subunit":"グラフ","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_004_02"],"description":"y=asin(bx+c)+dのグラフを周期2π/b・振幅aで正確に作図できる"},

    # sk_H2_005: 三角関数の応用（加法定理）
    {"id":"sk_H2_005_01","parent":"sk_H2_005","name":"加法定理の公式","grade":"高2","subject":"数学II","unit":"三角関数","subunit":"加法定理","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_004_02"],"description":"sin(α±β)・cos(α±β)・tan(α±β)の加法定理を使って値を求められる"},
    {"id":"sk_H2_005_02","parent":"sk_H2_005","name":"2倍角・半角公式の導出と利用","grade":"高2","subject":"数学II","unit":"三角関数","subunit":"加法定理の応用","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_005_01"],"description":"2倍角・半角公式を加法定理から導出し計算に使える"},
    {"id":"sk_H2_005_03","parent":"sk_H2_005","name":"三角関数の合成（asinθ+bcosθ）","grade":"高2","subject":"数学II","unit":"三角関数","subunit":"合成","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_005_02"],"description":"rsin(θ+α)の形に合成して最大最小・方程式を解ける"},

    # sk_H2_006: 指数関数
    {"id":"sk_H2_006_01","parent":"sk_H2_006","name":"指数法則の拡張（有理数・実数指数）","grade":"高2","subject":"数学II","unit":"指数・対数関数","subunit":"指数関数","is_bottleneck":False,"prerequisite_skill_ids":["sk_H1_001_02"],"description":"累乗根・有理数指数を使って指数法則を正確に適用できる"},
    {"id":"sk_H2_006_02","parent":"sk_H2_006","name":"指数関数のグラフと大小比較","grade":"高2","subject":"数学II","unit":"指数・対数関数","subunit":"指数関数","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_006_01"],"description":"y=aˣのグラフの形・増減・底の大小による違いを説明できる"},
    {"id":"sk_H2_006_03","parent":"sk_H2_006","name":"指数方程式・不等式","grade":"高2","subject":"数学II","unit":"指数・対数関数","subunit":"指数方程式","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_006_02"],"description":"底を揃えるか置換して指数方程式・不等式を解ける"},

    # sk_H2_007: 対数関数
    {"id":"sk_H2_007_01","parent":"sk_H2_007","name":"対数の定義と基本性質","grade":"高2","subject":"数学II","unit":"指数・対数関数","subunit":"対数関数","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_006_02"],"description":"logₐbの定義と3つの性質（積・商・累乗）を使って計算できる"},
    {"id":"sk_H2_007_02","parent":"sk_H2_007","name":"対数方程式・不等式","grade":"高2","subject":"数学II","unit":"指数・対数関数","subunit":"対数方程式","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_007_01"],"description":"真数条件・底の条件を確認して対数方程式・不等式を解ける"},
    {"id":"sk_H2_007_03","parent":"sk_H2_007","name":"常用対数と桁数・小数の問題","grade":"高2","subject":"数学II","unit":"指数・対数関数","subunit":"常用対数","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_007_02"],"description":"常用対数log₁₀を使って大きな数の桁数・頭の数字を求められる"},

    # sk_H2_008: 微分の基礎 ★ボトルネック
    {"id":"sk_H2_008_01","parent":"sk_H2_008","name":"極限と微分係数の定義","grade":"高2","subject":"数学II","unit":"微分・積分","subunit":"微分の基礎","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_006_01"],"description":"平均変化率から微分係数f'(a)の定義を理解し計算できる"},
    {"id":"sk_H2_008_02","parent":"sk_H2_008","name":"多項式の導関数の計算","grade":"高2","subject":"数学II","unit":"微分・積分","subunit":"導関数","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_008_01"],"description":"(xⁿ)'=nxⁿ⁻¹と線形性を使って多項式の導関数を求められる"},
    {"id":"sk_H2_008_03","parent":"sk_H2_008","name":"接線の方程式","grade":"高2","subject":"数学II","unit":"微分・積分","subunit":"接線","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_008_02"],"description":"f'(a)を傾きとしてy=f(a)+f'(a)(x-a)の接線の式を求められる"},
    {"id":"sk_H2_008_04","parent":"sk_H2_008","name":"増減表・極大・極小","grade":"高2","subject":"数学II","unit":"微分・積分","subunit":"グラフの形状","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_008_03"],"description":"f'(x)=0の解と符号変化から増減表を作り極大・極小を求められる"},

    # sk_H2_009: 積分の基礎（面積）
    {"id":"sk_H2_009_01","parent":"sk_H2_009","name":"不定積分の基本計算","grade":"高2","subject":"数学II","unit":"微分・積分","subunit":"不定積分","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_008_02"],"description":"∫xⁿdx=xⁿ⁺¹/(n+1)+Cを使って多項式の不定積分を求められる"},
    {"id":"sk_H2_009_02","parent":"sk_H2_009","name":"定積分の計算","grade":"高2","subject":"数学II","unit":"微分・積分","subunit":"定積分","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_009_01"],"description":"定積分∫[a,b]f(x)dxを[F(x)]ₐᵇ=F(b)-F(a)で計算できる"},
    {"id":"sk_H2_009_03","parent":"sk_H2_009","name":"面積の計算（曲線と直線・2曲線間）","grade":"高2","subject":"数学II","unit":"微分・積分","subunit":"面積","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_009_02"],"description":"∫|f(x)-g(x)|dxで面積を求め符号に注意した正しい立式ができる"},

    # sk_H2_010: 数列
    {"id":"sk_H2_010_01","parent":"sk_H2_010","name":"等差数列・等比数列の一般項と和","grade":"高2","subject":"数学B","unit":"数列","subunit":"等差・等比数列","is_bottleneck":False,"prerequisite_skill_ids":[],"description":"等差・等比数列の一般項aₙと和Sₙの公式を使って計算できる"},
    {"id":"sk_H2_010_02","parent":"sk_H2_010","name":"Σ記号の計算","grade":"高2","subject":"数学B","unit":"数列","subunit":"Σ計算","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_010_01"],"description":"Σの3公式（k, k², k³）と線形性を使ってΣを含む式を計算できる"},
    {"id":"sk_H2_010_03","parent":"sk_H2_010","name":"漸化式の解法（等差・等比型・特性方程式）","grade":"高2","subject":"数学B","unit":"数列","subunit":"漸化式","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_010_02"],"description":"漸化式を特性方程式や変数変換で解いて一般項を求められる"},
    {"id":"sk_H2_010_04","parent":"sk_H2_010","name":"数学的帰納法","grade":"高2","subject":"数学B","unit":"数列","subunit":"数学的帰納法","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_010_03"],"description":"n=1での成立とn=kでの仮定→n=k+1の成立を示す帰納法を正しく書ける"},

    # sk_H2_011: ベクトル
    {"id":"sk_H2_011_01","parent":"sk_H2_011","name":"ベクトルの演算（和・差・スカラー倍）","grade":"高2","subject":"数学B","unit":"ベクトル","subunit":"ベクトルの基礎","is_bottleneck":False,"prerequisite_skill_ids":[],"description":"ベクトルの加減・スカラー倍を図形的・成分的に計算できる"},
    {"id":"sk_H2_011_02","parent":"sk_H2_011","name":"内積の計算と利用","grade":"高2","subject":"数学B","unit":"ベクトル","subunit":"内積","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_011_01"],"description":"a⃗·b⃗=|a||b|cosθ=a₁b₁+a₂b₂で内積を求め角度・垂直を判定できる"},
    {"id":"sk_H2_011_03","parent":"sk_H2_011","name":"位置ベクトルと分点・重心","grade":"高2","subject":"数学B","unit":"ベクトル","subunit":"位置ベクトル","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_011_02"],"description":"位置ベクトルを使って内外分点・重心・線分上の点を表せる"},
    {"id":"sk_H2_011_04","parent":"sk_H2_011","name":"空間ベクトルと直線・平面","grade":"高2","subject":"数学B","unit":"ベクトル","subunit":"空間ベクトル","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_011_03"],"description":"3次元ベクトルで直線・平面の方程式を立て共有点を求められる"},

    # ===== 高3 =====
    # sk_H3_001: 極限
    {"id":"sk_H3_001_01","parent":"sk_H3_001","name":"数列の極限と収束・発散","grade":"高3","subject":"数学III","unit":"極限","subunit":"数列の極限","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_010_03"],"description":"n→∞のとき数列が収束・発散・振動するかを判定し極限値を求められる"},
    {"id":"sk_H3_001_02","parent":"sk_H3_001","name":"無限等比数列の和","grade":"高3","subject":"数学III","unit":"極限","subunit":"無限級数","is_bottleneck":False,"prerequisite_skill_ids":["sk_H3_001_01"],"description":"|r|<1のとき無限等比数列の和S=a/(1-r)を求められる"},
    {"id":"sk_H3_001_03","parent":"sk_H3_001","name":"関数の極限とε-δ的理解","grade":"高3","subject":"数学III","unit":"極限","subunit":"関数の極限","is_bottleneck":True,"prerequisite_skill_ids":["sk_H3_001_02"],"description":"x→aのときf(x)の極限・右極限・左極限を求め連続性を判定できる"},
    {"id":"sk_H3_001_04","parent":"sk_H3_001","name":"sinx/x→1などの重要極限","grade":"高3","subject":"数学III","unit":"極限","subunit":"関数の極限","is_bottleneck":True,"prerequisite_skill_ids":["sk_H3_001_03"],"description":"lim(x→0)sinx/x=1などの重要極限を使って複合的な極限を求められる"},

    # sk_H3_002: 微分法 ★ボトルネック
    {"id":"sk_H3_002_01","parent":"sk_H3_002","name":"積・商・合成関数の微分法則","grade":"高3","subject":"数学III","unit":"微分法","subunit":"微分法則","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_008_02"],"description":"(fg)'・(f/g)'・(f∘g)'の微分法則を正確に適用できる"},
    {"id":"sk_H3_002_02","parent":"sk_H3_002","name":"三角関数・指数・対数の微分","grade":"高3","subject":"数学III","unit":"微分法","subunit":"各種関数の微分","is_bottleneck":True,"prerequisite_skill_ids":["sk_H3_002_01"],"description":"sinx・cosx・eˣ・logxの導関数を記憶し複合した式を微分できる"},
    {"id":"sk_H3_002_03","parent":"sk_H3_002","name":"対数微分法・陰関数微分","grade":"高3","subject":"数学III","unit":"微分法","subunit":"高度な微分","is_bottleneck":False,"prerequisite_skill_ids":["sk_H3_002_02"],"description":"対数微分法・陰関数の微分を使って複雑な関数を微分できる"},

    # sk_H3_003: 微分の応用
    {"id":"sk_H3_003_01","parent":"sk_H3_003","name":"高次関数のグラフ（増減・凹凸・変曲点）","grade":"高3","subject":"数学III","unit":"微分法","subunit":"グラフの描画","is_bottleneck":False,"prerequisite_skill_ids":["sk_H3_002_02","sk_H2_008_04"],"description":"f'・f''を使って増減・凹凸・変曲点を調べグラフを精密に描ける"},
    {"id":"sk_H3_003_02","parent":"sk_H3_003","name":"最大・最小・最適化問題","grade":"高3","subject":"数学III","unit":"微分法","subunit":"最大・最小","is_bottleneck":True,"prerequisite_skill_ids":["sk_H3_003_01"],"description":"微分を使って実際場面の最大・最小問題を立式から解まで解ける"},
    {"id":"sk_H3_003_03","parent":"sk_H3_003","name":"方程式・不等式への微分の応用","grade":"高3","subject":"数学III","unit":"微分法","subunit":"微分の応用","is_bottleneck":False,"prerequisite_skill_ids":["sk_H3_003_02"],"description":"方程式の実数解の個数をグラフで判定し不等式を微分で証明できる"},

    # sk_H3_004: 積分法 ★ボトルネック
    {"id":"sk_H3_004_01","parent":"sk_H3_004","name":"置換積分法","grade":"高3","subject":"数学III","unit":"積分法","subunit":"積分法則","is_bottleneck":True,"prerequisite_skill_ids":["sk_H2_009_02","sk_H3_002_02"],"description":"u=g(x)と置いてdxをduに置き換える置換積分を実行できる"},
    {"id":"sk_H3_004_02","parent":"sk_H3_004","name":"部分積分法","grade":"高3","subject":"数学III","unit":"積分法","subunit":"積分法則","is_bottleneck":True,"prerequisite_skill_ids":["sk_H3_004_01"],"description":"∫f·g'dx=fg-∫f'·gdxの部分積分を適切な分割で実行できる"},
    {"id":"sk_H3_004_03","parent":"sk_H3_004","name":"三角関数・指数・対数を含む積分","grade":"高3","subject":"数学III","unit":"積分法","subunit":"各種関数の積分","is_bottleneck":True,"prerequisite_skill_ids":["sk_H3_004_02"],"description":"置換・部分積分・公式を組み合わせてsinx・eˣ・logxを積分できる"},

    # sk_H3_005: 積分の応用
    {"id":"sk_H3_005_01","parent":"sk_H3_005","name":"面積計算（複雑な曲線間）","grade":"高3","subject":"数学III","unit":"積分法","subunit":"面積","is_bottleneck":False,"prerequisite_skill_ids":["sk_H3_004_03","sk_H2_009_03"],"description":"三角・指数・対数を含む曲線で囲まれた面積を正確に求められる"},
    {"id":"sk_H3_005_02","parent":"sk_H3_005","name":"回転体の体積","grade":"高3","subject":"数学III","unit":"積分法","subunit":"体積","is_bottleneck":True,"prerequisite_skill_ids":["sk_H3_005_01"],"description":"V=π∫[a,b]{f(x)}²dxを使って回転体の体積を求められる"},
    {"id":"sk_H3_005_03","parent":"sk_H3_005","name":"曲線の長さ・速度・加速度への応用","grade":"高3","subject":"数学III","unit":"積分法","subunit":"応用","is_bottleneck":False,"prerequisite_skill_ids":["sk_H3_005_02"],"description":"曲線の長さの公式や媒介変数を使って長さを計算できる"},

    # sk_H3_006: 複素数平面
    {"id":"sk_H3_006_01","parent":"sk_H3_006","name":"複素数平面の座標と絶対値・偏角","grade":"高3","subject":"数学III","unit":"複素数平面","subunit":"複素数平面","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_002_01"],"description":"複素数をガウス平面上の点・ベクトルで表し絶対値・偏角を求められる"},
    {"id":"sk_H3_006_02","parent":"sk_H3_006","name":"極形式と積・商（回転・拡大）","grade":"高3","subject":"数学III","unit":"複素数平面","subunit":"極形式","is_bottleneck":True,"prerequisite_skill_ids":["sk_H3_006_01"],"description":"極形式r(cosθ+isinθ)で積が回転と拡大になることを使えられる"},
    {"id":"sk_H3_006_03","parent":"sk_H3_006","name":"ド・モアブルの定理とn乗根","grade":"高3","subject":"数学III","unit":"複素数平面","subunit":"ド・モアブル","is_bottleneck":True,"prerequisite_skill_ids":["sk_H3_006_02"],"description":"ド・モアブルの定理でn乗を計算しzⁿ=aのn乗根を全て求められる"},

    # sk_H3_007: 2次曲線・媒介変数・極座標
    {"id":"sk_H3_007_01","parent":"sk_H3_007","name":"放物線・楕円・双曲線の方程式","grade":"高3","subject":"数学III","unit":"曲線","subunit":"2次曲線","is_bottleneck":False,"prerequisite_skill_ids":["sk_H2_003_03"],"description":"2次曲線の標準形と焦点・準線を理解し方程式を求められる"},
    {"id":"sk_H3_007_02","parent":"sk_H3_007","name":"媒介変数表示と微分・積分","grade":"高3","subject":"数学III","unit":"曲線","subunit":"媒介変数","is_bottleneck":True,"prerequisite_skill_ids":["sk_H3_007_01","sk_H3_004_01"],"description":"x=f(t)・y=g(t)の媒介変数表示でdy/dxを求め面積・長さを計算できる"},
    {"id":"sk_H3_007_03","parent":"sk_H3_007","name":"極座標と極方程式","grade":"高3","subject":"数学III","unit":"曲線","subunit":"極座標","is_bottleneck":False,"prerequisite_skill_ids":["sk_H3_007_02"],"description":"極座標(r,θ)と直交座標を相互変換し極方程式が表す曲線を描ける"},
]

# 重複IDチェック
ids = [s["id"] for s in details]
assert len(ids) == len(set(ids)), f"重複IDがあります: {[i for i in ids if ids.count(i) > 1]}"

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(details, f, ensure_ascii=False, indent=2)

print(f"✅ 出力完了: {len(details)} スキル → {out_path}")

# 親スキル別集計
from collections import Counter
parent_counts = Counter(s["parent"] for s in details)
print("\n--- 親スキル別集計 ---")
for parent_id in sorted(parent_counts):
    print(f"  {parent_id}: {parent_counts[parent_id]} スキル")

print(f"\n合計親スキル数: {len(parent_counts)}")
