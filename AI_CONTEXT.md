# AI Development Context & Architecture Guide

このドキュメントは、本プロジェクト（ff11-fish-tracker）を開発・保守するAIアシスタントのための仕様書およびガイドラインです。

---

## 1. プロジェクト概要

- **目的**: FF11（ファイナルファンタジー11）の釣魚進捗管理Webアプリ。
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
- `zoneIds`: 釣れるゾーンのID配列（`ZoneMaster.id` の配列）

### **竿相性データ (FishRodRelation)**
- `fishId`: 魚ID
- `rodId`: 竿ID
- `catchability`: `'possible'` | `'impossible'` | `'unknown'`
- `rodBreak`: `'yes'` | `'no'` | `'unknown'`
- `lineBreak`: `'yes'` | `'no'` | `'unknown'`
- `isTooSmall`: 「かかったが小さすぎる」等の特殊判定フラグ (`boolean` / オプショナル)
- `notes`: 補足説明

### **ユーザー進捗 (UserData / CharacterProgress)**
- LocalStorage キー: `ff11_fish_tracker_user_data`
- `checkedFishIds`: 達成済みの魚ID（`number[]`）を保持

---

## 4. コンポーネント・ファイル構成と役割

| ファイル | 役割 |
|---|---|
| `src/types/fish.ts` | 型定義（Windower互換データ、アプリ拡張、進捗構造） |
| `src/hooks/useUserData.ts` | LocalStorage永続化、キャラ追加/削除/切替、魚チェックON/OFFロジック |
| `src/components/Header.tsx` | アプリタイトル、キャラ切替UI、開発用ツール導線（`isDev`制御） |
| `src/components/FilterBar.tsx` | メインナビゲーション（魚/餌切替）、達成状態フィルター（すべて/未達成/達成済）、プログレス表示、名称検索フォーム |
| `src/components/Footer.tsx` | 権利表記・ライセンス注記・著作権表示コンポーネント |
| `src/components/MainContentRouter.tsx` | メイン領域の表示切替（魚/餌/エリア）、フィルタリング・検索適用ルーティング |
| `src/components/AdBanner.tsx` | 広告エリア（プレースホルダー / AdSense枠）コンポーネント |
| `src/components/fish/FishCard.tsx` | 個別魚カード（スペック表示、エリア情報の表示と+Nバッジによるカード内収容量制御） |
| `src/components/fish/FishListItem.tsx` | リスト表示用個別魚行コンポーネント |
| `src/components/fish/FishDetailView.tsx` | 魚詳細情報表示コンポーネント（選択時に表示） |
| `src/components/area/AreaCard.tsx` | 個別エリアカード（基本情報表示および釣れる魚の上限付き+Nバッジ表示） |
| `src/components/bait/BaitDetailView.tsx` | 餌詳細情報表示コンポーネント |
| `src/components/fish/FishListView.tsx` | 魚一覧／詳細ビューのレスポンシブレイアウト制御 |
| `src/styles/cardStyles.ts` | カードUI用共通Tailwind CSSクラス定義（`CARD_STYLES`） |
| `src/styles/detailStyles.ts` | 詳細ビュー用共通Tailwind CSSクラス定義（`DETAIL_STYLES`） |
| `src/data/` | 各種マスターデータおよびリレーション定義（`FISH_LOCATIONS`, `FISH_ROD_RELATIONS` 等） |

---

## 5. ユーザープロファイル・応答制約（開発AI向け）

- **応答の原則**: 結論・要点を先に述べ、簡潔かつ直接的に回答すること。
- **締め言葉の禁止**: 回答末尾での感想の質問、感情への同意の要求、過度なまとめや演出、問いかけは一切禁止。結論または成果物の提示のみで簡潔に終了すること。
- **Git運用**: 基本的に `main` から切り出した機能ブランチ（`feature/*`）で開発を進める。

---

## 6. 実装規約・ガイドライン

- **ファイル先頭のメタデータブロックの明記**:
  - コードファイル（JSX/TSX/TS等）の先頭には、必ず以下の形式で役割・ファイルパス・概要・改修時の注意事項を含めたブロックコメントを明記すること。

  \```tsx
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
  \```

- **リレーションデータの参照基準**:
  - 魚とエリアの結びつきを表示する際は、単体オブジェクトの配列プロパティ（`zoneIds`）ではなく、マスターリレーションデータ（`FISH_LOCATIONS`）を参照して統合すること。
- **カード内要素の溢れ制限デザイン**:
  - カード内に可変長の関連要素（エリア名や魚名）をタグ表示する場合は、原則として上位2件を表示し、超過分は `+N` のバッジ形式でカウント表示してカードの高さを保持すること。
- **UIスタイルの集約**:
  - カードや詳細表示等、再利用性の高い共通コンポーネントの Tailwind CSS クラス群は `src/styles/*Styles.ts` に定数（`as const`）として定義して参照する。
- **ボタン要素の定義**:
  - `button` タグを配置する際は、必ず `type="button"`（フォーム送信用の場合は `type="submit"`）を明記すること。
- **テキストデータの改行処理**:
  - マスターデータ内のテキスト改行は `\n` で統一・保持する。
  - 表示側（React）では、レンダリング要素に Tailwind CSS の `whitespace-pre-line` クラスを付与して改行を適用する。