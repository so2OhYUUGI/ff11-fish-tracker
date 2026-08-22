# AI Development Context & Architecture Guide

このドキュメントは、本プロジェクト（ff11-fish-tracker）を開発・保守するAIアシスタントのための仕様書およびガイドラインです。

---

## 1. プロジェクト概要

- **目的**: FF11（ファイナルファンタジー11）の釣魚進捗管理および釣りデータ参照Webアプリ。
- **ターゲット**: 個人プレイヤー（PC/スマホ双方対応）。
- **データ設計指針**: Windower Resources (items.lua, zones.lua) のデータ仕様・ID体系をベースとし、アプリ独自の補足データ（上限スキル、ハラキリ等）および LocalStorage によるユーザー進捗を統合。

---

## 2. 技術スタック & 設定

- **ビルドツール**: Vite
- **UIライブラリ**: React (TypeScript)
- **スタイリング**: Tailwind CSS (v4)
- **アイコン**: lucide-react
- **パスエイリアス**: `@/*` -> `./src/*` (`tsconfig.app.json` および `vite.config.ts` でマッピング)
- **モジュール構文**: `verbatimModuleSyntax` 有効（型インポート時は `import type { ... }` を使用すること）

---

## 3. データ構造（src/types/fish.ts）

### **魚マスターデータ (FishMaster)**
- `id`: Windower items.lua 準拠のアイテムID（数値）
- `ja` / `en`: 日本語名 / 英語名
- `maxSkill`: 限界スキルレベル
- `sizeType`: `'small'` | `'large'`
- `harakiri`: ハラキリ対象フラグ (`boolean`)
- `ebisu`: 恵比寿の竿関連フラグ (`boolean`)
- `taikobou`: 太公望の竿関連フラグ (`boolean`)

### **エリアマスターデータ (ZoneMaster) & 餌マスターデータ (BaitMaster)**
- `id`: ゾーンID / アイテムID
- `ja` / `en`: 日本語名 / 英語名
- `description`: 簡略説明文（改行コード `\n` を含む）

### **リレーションデータ**
- `FISH_LOCATIONS`: 魚ID (`fishId`) と エリアID (`zoneId`) の紐付け
- `FISH_BAIT_RELATIONS`: 魚ID (`fishId`) と 餌ID (`baitId`) の紐付け
- `FISH_ROD_RELATIONS`: 魚ID (`fishId`) と 竿ID (`rodId`) の相性データ

### **ユーザー進捗 (UserData / CharacterProgress)**
- LocalStorage キー: `ff11_fish_tracker_user_data`
- `checkedFishIds`: 達成済みの魚ID（`number[]`）を保持

---

## 4. コンポーネント・ファイル構成と役割

| ファイル | 役割 |
|---|---|
| `src/types/fish.ts` | 型定義（Windower互換データ、アプリ拡張、進捗構造） |
| `src/hooks/useUserData.ts` | LocalStorage永続化、キャラ追加/削除/切替、魚チェックON/OFFロジック |
| `src/components/common/Header.tsx` | アプリタイトル、キャラ切替UI、開発用ツール導線（`isDev`制御） |
| `src/components/common/FilterBar.tsx` | メインナビゲーション（魚/エリア/餌切替）、達成状態フィルター、プログレス表示、検索フォーム |
| `src/components/common/Footer.tsx` | 権利表記・ライセンス注記・著作権表示コンポーネント |
| `src/components/common/MainContentRouter.tsx` | メイン領域の表示切替（魚/エリア/餌）、ルーティング |
| `src/components/common/AdBanner.tsx` | 広告エリア（プレースホルダー / AdSense枠）コンポーネント |
| `src/components/fish/FishCard.tsx` | 個別魚カード（スペック表示、エリア情報の表示と+Nバッジ表示） |
| `src/components/fish/FishListItem.tsx` | リスト表示用個別魚行コンポーネント |
| `src/components/fish/FishDetailView.tsx` | 魚詳細情報表示コンポーネント |
| `src/components/area/AreaCard.tsx` | 個別エリアカード（基本情報および釣れる魚のタグ一覧＋+Nバッジ表示） |
| `src/components/area/AreaListItem.tsx` | リスト表示用個別エリア行コンポーネント（対象魚の総数バッジ表示） |
| `src/components/area/AreaDetailView.tsx` | エリア詳細情報表示コンポーネント |
| `src/components/bait/BaitCard.tsx` | 個別餌カード（基本情報および釣れる魚のタグ一覧＋+Nバッジ表示） |
| `src/components/bait/BaitListItem.tsx` | リスト表示用個別餌行コンポーネント（説明文横並び＋対象魚の総数バッジ表示） |
| `src/components/bait/BaitDetailView.tsx` | 餌詳細情報表示コンポーネント |
| `src/styles/cardStyles.ts` | カードUI用共通Tailwind CSSクラス定義（`CARD_STYLES`） |
| `src/styles/listStyles.ts` | リストUI用共通Tailwind CSSクラス定義（`LIST_STYLES`） |
| `src/styles/detailStyles.ts` | 詳細ビュー用共通Tailwind CSSクラス定義（`DETAIL_STYLES`） |
| `src/data/` | マスターデータおよびリレーション定義（`fishes`, `zones`, `baits`, `locations`, `relations`） |

---

## 5. UI/UX標準化ルール（カード vs リスト）

### **カード表示 (`AreaCard`, `BaitCard`, `FishCard`)**
- カードの垂直高さを適正に保ちつつ、情報網羅性を高める **3段構成** を採用する。
  1. **上段:** 名称表示領域（日本語名・英語名の縦並び）
  2. **中段:** 説明文領域 (`CARD_STYLES.boxBlock`)
  3. **下段:** 関連データ一覧表示（`Fish`アイコン + 「対象の魚 (N):」 + タグ最大2件 + 超過分の `+N` バッジ）

### **リスト表示 (`AreaListItem`, `BaitListItem`, `FishListItem`)**
- 垂直方向への高速スキャンと高密度表示を実現する **横並び構成** を採用する。
  - 縦に段数を増やさず（3段目の追加を禁止）、1行（高密度2段）の垂直高さを維持する。
  - **構成:** 左側:名称（縦並び） / 中央:説明文（1行 truncate・右寄せ） / 右端:総数インジケーター（`Fish`アイコン + 件数バッジ）。

### **ヘッダーアイコンのカラー定義**
- **魚（Fish）:** シアン (`text-cyan-400`)
- **エリア（MapPin）:** エメラルド (`text-red-400`)
- **エサ（Disc）:** オレンジ/アンバー (`text-amber-400`)

---

## 6. ユーザープロファイル・応答制約（開発AI向け）

- **応答の原則**: 結論・要点を先に述べ、簡潔かつ直接的に回答すること。
- **締め言葉の禁止**: 回答末尾での感想の質問、感情への同意の要求、過度なまとめや演出、問いかけは一切禁止。結論または成果物の提示のみで簡潔に終了すること。
- **Git運用**: 基本的に `main` から切り出した機能ブランチ（`feature/*`）で開発を進める。

---

## 7. 実装規約・ガイドライン

- **ファイル先頭のメタデータブロックの明記**:
  - コードファイル（JSX/TSX/TS等）の先頭には、必ず以下の形式で役割・ファイルパス・概要・改修時の注意事項を含めたブロックコメントを明記すること。

  \`\`\`tsx
  /**
   * ============================================================================
   * [FilePath] src/components/Example.tsx
   * [Role] コンポーネントの役割
   * 
   * [概要]
   * - 主な機能・役割1
   * - 主な機能・役割2
   * 
   * [編集・改修時の注意事項]
   * 1. 【注意事項1】記述内容
   * 2. 【注意事項2】記述内容
   * ============================================================================
   */
  \`\`\`

- **リレーションデータの参照基準**:
  - 魚・エリア・餌の結びつきを表示する際は、単体マスターの埋め込み配列ではなく、必ずマスターリレーションデータ（`FISH_LOCATIONS`, `FISH_BAIT_RELATIONS` 等）を参照して動的に算出すること。
- **カード内要素の溢れ制限デザイン**:
  - カード内に可変長の関連要素（エリア名や魚名）をタグ表示する場合は、原則として上位2件を表示し、超過分は `+N` のバッジ形式でカウント表示してカードの高さを保持すること。
- **UIスタイルの集約**:
  - カード、リスト、詳細表示等、再利用性の高い共通コンポーネントの Tailwind CSS クラス群は `src/styles/*Styles.ts` に定数（`as const`）として定義して参照する。
- **ボタン要素の定義**:
  - `button` タグを配置する際は、必ず `type="button"`（フォーム送信用の場合は `type="submit"`）を明記すること。
- **テキストデータの改行処理**:
  - マスターデータ内のテキスト改行は `\n` で統一・保持する。
  - 表示側（React）では `.split('\\n')` や `whitespace-pre-line` クラス等を用いて適切に改行レンダリングを行うこと。