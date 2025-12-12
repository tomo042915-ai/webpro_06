# プレミアリーグ Webアプリケーション仕様書

## 1. 概要

本システムは，イングランド・プレミアリーグのクラブ情報およびアーセナルFCの選手情報を管理・閲覧するための Web アプリケーションである．  
Node.js と Express フレームワークを用いて実装され，サーバーサイドでデータを保持し，EJS テンプレートエンジンを用いて動的に HTML を生成する．

---

## 2. データ構造

### 2.1 プレミアリーグ クラブデータ `premierClubs`

プレミアリーグ所属クラブの情報を管理する配列．

| 項目名 | 変数名 | 型 | 説明 | 例 |
|--------|--------|-----|------|-----|
| ID | id | Number | クラブ固有のID | 1 |
| 略称 | shortName | String | クラブの3文字略称 | MCI |
| クラブ名 | name | String | クラブの正式名称 | マンチェスター・シティ |
| 市場価値 | marketValue | Number | 推定市場価値（億ユーロ） | 13.0 |
| 監督 | manager | String | 監督名 | ジョゼップ・グアルディオラ |
| スタジアム | stadium | String | ホームスタジアム名 | エティハド・スタジアム |

---

### 2.2 アーセナル 選手データ `arsenalPlayers`

アーセナルFCに所属する選手の詳細データを管理する配列．

| 項目名 | 変数名 | 型 | 説明 | 例 |
|--------|--------|------|------|------|
| 名前 | name | String | 選手名 | ブカヨ・サカ |
| ポジション | position | String | 登録ポジション (FW/MF/DF/GK) | FW |
| 年齢 | age | Number | 現在の年齢 | 22 |
| 身長 | height | Number | 身長 (cm) | 178 |
| 利き足 | foot | String | 利き足 | 左足 |
| 評価 | rating | String | チーム内評価ランク | S |

---

## 3. 機能要件

### 3.1 ルーティング一覧

| 機能 | メソッド | URL | 処理内容 | 対応ビュー |
|------|----------|---------|--------------|----------------|
| プレミアリーグ一覧 | GET | /premier | クラブデータ一覧を表示 | `club_list.ejs` |
| プレミアリーグ詳細 | GET | /premier/:index | 指定クラブの詳細を表示 | `club_detail.ejs` |
| アーセナル選手一覧 | GET | /arsenal | 選手一覧を表示 | `arsenal_list.ejs` |
| アーセナル選手詳細 | GET | /arsenal/:index | 指定選手の詳細を表示 | `arsenal_detail.ejs` |

---

## 4. 画面遷移図 (Mermaid)

```mermaid
stateDiagram-v2
    [*] --> トップページ

    state プレミアリーグ機能 {
        トップページ --> クラブ一覧(/premier)
        クラブ一覧(/premier) --> クラブ詳細(/premier/:index): クラブ名クリック
        クラブ詳細(/premier/:index) --> クラブ一覧(/premier): 戻るボタン
    }

    state アーセナル機能 {
        トップページ --> 選手一覧(/arsenal)
        選手一覧(/arsenal) --> 選手詳細(/arsenal/:index): 選手名クリック
        選手詳細(/arsenal/:index) --> 選手一覧(/arsenal): 戻るボタン
    }
