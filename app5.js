const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true })); // POSTリクエストのボディをパースするために必要

// ★★★ データ配列の定義 ★★★

// 京葉線 駅名リスト (簡易版)
let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

// 京葉線 駅詳細リスト (CRUD対象)
let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:0 },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:1.2 },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:7.4 },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:12.7 },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:28.3 },
  { id:6, code:"JE17", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:39.0 },
  { id:7, code:"JE18", name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:43.0 },
];

// 1. バロンドール歴代受賞者データ (増量版)
let ballondorWinners = [
  { year: 2023, name: "リオネル・メッシ", country: "アルゼンチン", club: "インテル・マイアミ", position: "FW", desc: "カタールW杯優勝の功績が評価され、自身8度目の受賞。" },
  { year: 2022, name: "カリム・ベンゼマ", country: "フランス", club: "レアル・マドリード", position: "FW", desc: "ラ・リーガとCLの二冠に貢献し、圧倒的な得点力を見せた。" },
  { year: 2021, name: "リオネル・メッシ", country: "アルゼンチン", club: "パリ・サンジェルマン", position: "FW", desc: "コパ・アメリカ優勝により悲願の代表タイトルを獲得。" },
  { year: 2019, name: "リオネル・メッシ", country: "アルゼンチン", club: "バルセロナ", position: "FW", desc: "ラ・リーガ優勝と得点王を獲得し、個人パフォーマンスが際立った。" },
  { year: 2018, name: "ルカ・モドリッチ", country: "クロアチア", club: "レアル・マドリード", position: "MF", desc: "CL3連覇とロシアW杯準優勝の原動力となり、メッシ・ロナウドの独占を崩した。" },
  { year: 2017, name: "クリスティアーノ・ロナウド", country: "ポルトガル", club: "レアル・マドリード", position: "FW", desc: "レアル・マドリードのCL連覇に貢献し、5度目の受賞。" },
  { year: 2016, name: "クリスティアーノ・ロナウド", country: "ポルトガル", club: "レアル・マドリード", position: "FW", desc: "CL優勝に加え、EURO2016でポルトガルを初の国際タイトルに導いた。" },
  { year: 2015, name: "リオネル・メッシ", country: "アルゼンチン", club: "バルセロナ", position: "FW", desc: "MSNトリオを牽引し、バルセロナの三冠（トレブル）達成に貢献。" },
  { year: 2014, name: "クリスティアーノ・ロナウド", country: "ポルトガル", club: "レアル・マドリード", position: "FW", desc: "CLシーズン最多得点記録を更新し、デシマ（10度目のCL優勝）を達成。" },
  { year: 2013, name: "クリスティアーノ・ロナウド", country: "ポルトガル", club: "レアル・マドリード", position: "FW", desc: "無冠ながらも圧倒的な個人成績（年間69ゴール）でリベリーらを抑え受賞。" },
  { year: 2008, name: "クリスティアーノ・ロナウド", country: "ポルトガル", club: "マンチェスター・ユナイテッド", position: "FW", desc: "プレミアリーグとCLの二冠、さらに両大会で得点王を獲得。" },
  { year: 2007, name: "カカ", country: "ブラジル", club: "ACミラン", position: "MF", desc: "ACミランをCL優勝に導き、圧倒的なスピードとエレガントさで世界を魅了した。" },
  { year: 2006, name: "ファビオ・カンナヴァーロ", country: "イタリア", club: "レアル・マドリード", position: "DF", desc: "ドイツW杯でイタリア代表の守備の要として優勝に貢献。DFとしての受賞は稀有。" },
  { year: 2005, name: "ロナウジーニョ", country: "ブラジル", club: "バルセロナ", position: "MF", desc: "予測不能なテクニックと笑顔で観客を魅了し、ベルナベウでスタンディングオベーションを受けた。" },
  { year: 2004, name: "アンドリー・シェフチェンコ", country: "ウクライナ", club: "ACミラン", position: "FW", desc: "セリエA得点王を獲得し、ミランのスクデット獲得に貢献した「ウクライナの矢」。" },
  { year: 2003, name: "パベル・ネドベド", country: "チェコ", club: "ユヴェントス", position: "MF", desc: "尽きないスタミナと闘争心でユヴェントスを牽引。「チェコの大砲」。" },
  { year: 2002, name: "ロナウド", country: "ブラジル", club: "レアル・マドリード", position: "FW", desc: "日韓W杯で得点王となりブラジルを優勝に導き、怪我からの完全復活を遂げた。" },
  { year: 2001, name: "マイケル・オーウェン", country: "イングランド", club: "リヴァプール", position: "FW", desc: "リヴァプールのカップ・トレブル（三冠）に貢献。「ワンダーボーイ」と呼ばれた。" },
  { year: 1998, name: "ジネディーヌ・ジダン", country: "フランス", club: "ユヴェントス", position: "MF", desc: "自国開催のフランスW杯決勝で2ゴールを挙げ、フランスを初優勝に導いた英雄。" }
];

// プレミアリーグのクラブデータ (ID、略称、クラブ名、推定市場価値 - 奥, ホームスタジアム)
let premierClubs = [
  { id: 1, shortName: "MCI", name: "マンチェスター・シティ", marketValue: 13.0, manager: "ジョゼップ・グアルディオラ", stadium: "エティハド・スタジアム" },
  { id: 2, shortName: "ARS", name: "アーセナル", marketValue: 11.5, manager: "ミケル・アルテタ", stadium: "エミレーツ・スタジアム" },
  { id: 3, shortName: "LIV", name: "リヴァプール", marketValue: 9.2, manager: "ユルゲン・クロップ", stadium: "アンフィールド" },
  { id: 4, shortName: "CHE", name: "チェルシー", marketValue: 9.8, manager: "マウリシオ・ポチェッティーノ", stadium: "スタンフォード・ブリッジ" },
  { id: 5, shortName: "MUN", name: "マンチェスター・ユナイテッド", marketValue: 8.9, manager: "エリック・テン・ハーグ", stadium: "オールド・トラッフォード" },
  { id: 6, shortName: "TOT", name: "トッテナム・ホットスパー", marketValue: 7.5, manager: "アンジェ・ポステコグルー", stadium: "トッテナム・ホットスパー・スタジアム" },
  { id: 7, shortName: "NEW", name: "ニューカッスル・ユナイテッド", marketValue: 6.8, manager: "エディ・ハウ", stadium: "セント・ジェームズ・パーク" },
];

// ★★★ 新規追加: アーセナルの選手データ ★★★
let arsenalPlayers = [
  { name: "ブカヨ・サカ", position: "FW", age: 22, height: 178, foot: "左足", rating: "S" },
  { name: "ガブリエル・ジェズス", position: "FW", age: 28, height: 175, foot: "右足", rating: "A" },
  { name: "エベレチ・エゼ", position: "FW", age: 27, height: 173, foot: "右足", rating: "A+" },
  { name: "ガブリエル・マルティネリ", position: "FW", age: 24, height: 178, foot: "右足", rating: "A+" },
  { name: "ビクトル・ギェケレシュ", position: "FW", age: 27, height: 187, foot: "右足", rating: "A" },
  { name: "レアンドロ・トロサール", position: "FW", age: 31, height: 172, foot: "右足", rating: "A" },
  { name: "チュクノンソー・マドゥエケ", position: "FW", age: 23, height: 182, foot: "左足", rating: "A+" },
  { name: "イーサン・ヌワネリ", position: "FW", age: 18, height: 176, foot: "左足", rating: "B+" },
  { name: "カイ・ハヴァーツ", position: "FW", age: 24, height: 193, foot: "左足", rating: "A+" },
  { name: "マルティン・ウーデゴール", position: "MF", age: 25, height: 178, foot: "左足", rating: "S+" },
  { name: "クリスティアン・ノアゴール", position: "MF", age: 31, height: 186, foot: "右足", rating: "B" },
  { name: "ミケル・メリーノ", position: "MF", age: 29, height: 189, foot: "左足", rating: "A" },
  { name: "マルティン・スビメンディ", position: "MF", age: 26, height: 180, foot: "右足", rating: "B+" },
  { name: "マイルズ・ルイス スケリー", position: "MF", age: 19, height: 178, foot: "左足", rating: "B" },
  { name: "デクラン・ライス", position: "MF", age: 25, height: 185, foot: "右足", rating: "S" },
  { name: "クリスティアン・モスケラ", position: "DF", age: 21, height: 188, foot: "右足", rating: "C" },
  { name: "ベン・ホワイト", position: "DF", age: 28, height: 186, foot: "右足", rating: "A" },
  { name: "ピエロ・インカピエ", position: "DF", age: 23, height: 183, foot: "左足", rating: "C" },
  { name: "ユリエン・ティンバー", position: "DF", age: 24, height: 179, foot: "右足", rating: "A" },
  { name: "リッカルド・カラフィオーリ", position: "DF", age: 23, height: 188, foot: "左足", rating: "B+" },
  { name: "ジョシュア・ニコルズ", position: "DF", age: 19, height: 178, foot: "右足", rating: "D" },
  { name: "ウィリアム・サリバ", position: "DF", age: 23, height: 192, foot: "右足", rating: "A" },
  { name: "ガブリエウ・マガリャンイス", position: "DF", age: 26, height: 190, foot: "左足", rating: "B+" },
  { name: "ダビド・ラヤ", position: "GK", age: 28, height: 183, foot: "右足", rating: "A" },
  { name: "ケパ・アリサバラガ", position: "GK", age: 31, height: 189, foot: "右足", rating: "B" },
  { name: "トミー・セットフォード", position: "GK", age: 19, height: 185, foot: "右足", rating: "C" },
  { name: "アレクセイ・ロハス", position: "GK", age: 20, height: 186, foot: "右足", rating: "D" },
];
// ★★★★★★★★★★★★★★★★★★★★★★★★★★




// ==================================================
//  ルーティング
// ==================================================

// トップページ
app.get("/", (req, res) => {
  res.render('index');
});

// --------------------------------------------------
// 1. プレミアリーグ機能 (CRUD)
// --------------------------------------------------
app.get("/premier", (req, res) => {
  res.render('club_list', { data: premierClubs });
});

app.get("/premier/detail/:index", (req, res) => {
  const index = Number(req.params.index);
  if (premierClubs[index]) {
    res.render('club_detail', { club: premierClubs[index] });
  } else { res.status(404).send("データが見つかりません"); }
});

// 新規登録
app.get("/premier/add", (req, res) => {
  res.render('club_form', { mode: 'create', club: null, index: null });
});
app.post("/premier/add", (req, res) => {
  const newClub = {
    id: Number(req.body.id),
    name: req.body.name,
    short: req.body.short,
    val: Number(req.body.val),
    manager: req.body.manager,
    stadium: req.body.stadium
  };
  premierClubs.push(newClub);
  res.redirect('/premier');
});

// 編集
app.get("/premier/edit/:index", (req, res) => {
  const index = Number(req.params.index);
  if (premierClubs[index]) {
    res.render('club_form', { mode: 'edit', club: premierClubs[index], index: index });
  } else { res.status(404).send("データが見つかりません"); }
});
app.post("/premier/update/:index", (req, res) => {
  const index = Number(req.params.index);
  if (premierClubs[index]) {
    premierClubs[index] = {
      id: Number(req.body.id),
      name: req.body.name,
      short: req.body.short,
      val: Number(req.body.val),
      manager: req.body.manager,
      stadium: req.body.stadium
    };
    res.redirect('/premier');
  } else { res.status(404).send("データが見つかりません"); }
});

// 削除
app.post("/premier/delete/:index", (req, res) => {
  const index = Number(req.params.index);
  if (premierClubs[index]) {
    premierClubs.splice(index, 1);
    res.redirect('/premier');
  } else { res.status(404).send("データが見つかりません"); }
});


// --------------------------------------------------
// 2. バロンドール機能 (CRUD)
// --------------------------------------------------
app.get("/ballondor", (req, res) => {
  res.render('ballondor_list', { winners: ballondorWinners });
});

app.get("/ballondor/detail/:index", (req, res) => {
  const index = Number(req.params.index);
  if (ballondorWinners[index]) {
    res.render('ballondor_detail', { winner: ballondorWinners[index] });
  } else { res.status(404).send("データが見つかりません"); }
});

// 新規登録
app.get("/ballondor/add", (req, res) => {
  res.render('ballondor_form', { mode: 'create', winner: null, index: null });
});
app.post("/ballondor/add", (req, res) => {
  const newWinner = {
    year: Number(req.body.year),
    name: req.body.name,
    country: req.body.country,
    club: req.body.club,
    position: req.body.position,
    desc: req.body.desc
  };
  ballondorWinners.push(newWinner);
  res.redirect('/ballondor');
});

// 編集
app.get("/ballondor/edit/:index", (req, res) => {
  const index = Number(req.params.index);
  if (ballondorWinners[index]) {
    res.render('ballondor_form', { mode: 'edit', winner: ballondorWinners[index], index: index });
  } else { res.status(404).send("データが見つかりません"); }
});
app.post("/ballondor/update/:index", (req, res) => {
  const index = Number(req.params.index);
  if (ballondorWinners[index]) {
    ballondorWinners[index] = {
      year: Number(req.body.year),
      name: req.body.name,
      country: req.body.country,
      club: req.body.club,
      position: req.body.position,
      desc: req.body.desc
    };
    res.redirect('/ballondor');
  } else { res.status(404).send("データが見つかりません"); }
});

// 削除
app.post("/ballondor/delete/:index", (req, res) => {
  const index = Number(req.params.index);
  if (ballondorWinners[index]) {
    ballondorWinners.splice(index, 1);
    res.redirect('/ballondor');
  } else { res.status(404).send("データが見つかりません"); }
});


// --------------------------------------------------
// 3. アーセナル機能 (CRUD)
// --------------------------------------------------
// アーセナル 選手一覧
app.get("/arsenal", (req, res) => {
  res.render('arsenal_list', { players: arsenalPlayers });
});

// アーセナル 選手詳細
app.get("/arsenal/detail/:index", (req, res) => {
  const index = Number(req.params.index);
  if (arsenalPlayers[index]) {
    // テンプレート内で編集・削除リンクを作るために index も渡す
    res.render('arsenal_detail', { player: arsenalPlayers[index], index: index });
  } else {
    res.status(404).send("選手が見つかりません");
  }
});

// 新規登録画面
app.get("/arsenal/add", (req, res) => {
  res.render('arsenal_form', { mode: 'create', player: null, index: null });
});

// 新規登録処理
app.post("/arsenal/add", (req, res) => {
  const newPlayer = {
    name: req.body.name,
    position: req.body.position, // プロパティ名を統一
    age: Number(req.body.age),
    height: Number(req.body.height),
    foot: req.body.foot,
    rating: req.body.rating // プロパティ名を統一
  };
  arsenalPlayers.push(newPlayer);
  res.redirect('/arsenal');
});

// 編集画面
app.get("/arsenal/edit/:index", (req, res) => {
  const index = Number(req.params.index);
  if (arsenalPlayers[index]) {
    res.render('arsenal_form', { mode: 'edit', player: arsenalPlayers[index], index: index });
  } else {
    res.status(404).send("選手が見つかりません");
  }
});

// 更新処理
app.post("/arsenal/update/:index", (req, res) => {
  const index = Number(req.params.index);
  if (arsenalPlayers[index]) {
    arsenalPlayers[index] = {
      name: req.body.name,
      position: req.body.position,
      age: Number(req.body.age),
      height: Number(req.body.height),
      foot: req.body.foot,
      rating: req.body.rating
    };
    res.redirect('/arsenal/detail/' + index);
  } else {
    res.status(404).send("選手が見つかりません");
  }
});

// 削除処理
app.post("/arsenal/delete/:index", (req, res) => {
  const index = Number(req.params.index);
  if (arsenalPlayers[index]) {
    arsenalPlayers.splice(index, 1);
    res.redirect('/arsenal');
  } else {
    res.status(404).send("選手が見つかりません");
  }
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));