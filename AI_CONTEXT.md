# AI Development Context & Architecture Guide

このドキュメントは、本プロジェクト（ff11-fish-tracker）を開発・保守するAIアシスタントのための仕様書およびガイドラインです。

---

## 1. プロジェクト概要

- **目的**: FF11（ファイナルファンタジー11）の釣魚進捗管理および釣りデータ参照Webアプリ。[cite: 9]
- **ターゲット**: 個人プレイヤー（PC/スマホ双方対応）。[cite: 9]
- **データ設計指針**: Windower Resources (items.lua, zones.lua) のデータ仕様・ID体系をベースとし、アプリ独自の補足データ（上限スキル、ハラキリ等）および LocalStorage によるユーザー進捗を統合。[cite: 9]
- ** AIチャットスレッド名**: 📝FF11 釣魚チェッカー開発支援

---

## 2. 技術スタック & 設定

- **ビルドツール**: Vite[cite: 9]
- **UIライブラリ**: React (TypeScript)[cite: 9]
- **スタイリング**: Tailwind CSS (v4)[cite: 9]
- **アイコン**: lucide-react[cite: 9]
- **パスエイリアス**: `@/*` -> `./src/*` (`tsconfig.app.json` および `vite.config.ts` でマッピング)[cite: 9]
- **モジュール構文**: `verbatimModuleSyntax` 有効（型インポート時は `import type { ... }` を使用すること）[cite: 9]

---

## 3. データ構造（src/types/fishtracker.ts）
### **データ宣言**
- `src/types/`以下にあるファイルの宣言に従うこと[cite: 9]

### **リレーションデータ**
- `FISH_LOCATIONS`: 魚ID (`fishId`) と エリアID (`zoneId`) の紐付け[cite: 9]
- `FISH_BAIT_RELATIONS`: 魚ID (`fishId`) と 餌ID (`baitId`) の紐付け[cite: 9]
- `FISH_ROD_RELATIONS`: 魚ID (`fishId`) と 竿ID (`rodId`) の相性データ[cite: 9]

### **ユーザー進捗 (UserData / CharacterProgress)**
- LocalStorage キー: `ff11_fish_tracker_user_data`[cite: 9]
- `checkedFishIds`: 達成済みの魚ID（`number[]`）を保持[cite: 9]

---

## 4. ファイル・コンポーネント一覧

| ファイル | 役割 |
|---|---|
| `src/types/fishtracker.ts` | 型定義（Windower互換データ、アプリ拡張、進捗構造）[cite: 9] |
| `src/hooks/useNavigationStack.ts` | ページ遷移の管理[cite: 9] |
| `src/hooks/useUserData.ts` | LocalStorage永続化、キャラ追加/削除/切替、魚チェックON/OFFロジック[cite: 9] |
| `src/utils/share.ts` | Web Share APIおよびクリップボードコピー処理ユーティリティ[cite: 9] |
| `src/components/common/SEO.tsx` | SEOメタ情報設定（Head管理）[cite: 9] |
| `src/components/common/SeoHead.tsx` | ページ個別ヘッダーメタ定義[cite: 9] |
| `src/components/common/AdBanner.tsx` | 広告エリア（プレースホルダー / AdSense枠）[cite: 9] |
| `src/components/common/ShareDetailButton.tsx` | 詳細画面用共有ボタン[cite: 9] |
| `src/components/common/ShareProgressButton.tsx` | 釣獲進捗のSNS共有ボタン[cite: 9] |
| `src/components/layout/Header.tsx` | アプリタイトル、キャラ切替UI、開発用ツール導線[cite: 9] |
| `src/components/layout/Footer.tsx` | 権利表記・ライセンス注記・著作権表示[cite: 9] |
| `src/components/settings/SettingsModal.tsx` | 各種設定モーダルダイアログ[cite: 9] |
| `src/components/dev/MasterDataEditorModal.tsx` | マスターデータ編集・テスト用モーダル[cite: 9] |
| `src/components/LandingPage.tsx` | ランディングページコンポーネント[cite: 9] |
| `src/features/fishtracker/FilterBar.tsx` | メインナビゲーション（魚/エリア/餌切替）、達成状態フィルター、プログレス表示、検索フォーム[cite: 9] |
| `src/features/fishtracker/FishTrackerContent.tsx` | 魚チェッカーメイン領域の表示切替（魚/エリア/餌）、ルーティング[cite: 9] |
| `src/features/fishtracker/fish/FishCard.tsx` | 個別魚カード（スペック表示、エリア情報の表示と+Nバッジ表示、アクセシビリティ対応）[cite: 9] |
| `src/features/fishtracker/fish/FishListItem.tsx` | リスト表示用個別魚行コンポーネント（詳細パネル内での `variant="inline"` 対応、アクセシビリティ対応）[cite: 9] |
| `src/features/fishtracker/fish/FishDetailView.tsx` | 魚詳細情報表示コンポーネント（アクセシビリティ・ユニークキー対応）[cite: 9] |
| `src/features/fishtracker/area/AreaCard.tsx` | 個別エリアカード（基本情報および釣れる魚のタグ一覧＋+Nバッジ表示、アクセシビリティ・ユニークキー対応）[cite: 9] |
| `src/features/fishtracker/area/AreaListItem.tsx` | リスト表示用個別エリア行コンポーネント（対象魚の総数バッジ表示、`useMemo`・改行エスケープ最適化、アクセシビリティ対応）[cite: 9] |
| `src/features/fishtracker/area/AreaDetailView.tsx` | エリア詳細情報表示コンポーネント（魚チェック・スタック遷移連携、アクセシビリティ・ユニークキー対応）[cite: 9] |
| `src/features/fishtracker/bait/BaitCard.tsx` | 個別餌カード（基本情報および釣れる魚のタグ一覧＋+Nバッジ表示、アクセシビリティ対応）[cite: 9] |
| `src/features/fishtracker/bait/BaitListItem.tsx` | リスト表示用個別餌行コンポーネント（説明文横並び＋対象魚の総数バッジ表示、`useMemo`・改行エスケープ最適化、アクセシビリティ対応）[cite: 9] |
| `src/features/fishtracker/bait/BaitDetailView.tsx` | 餌詳細情報表示コンポーネント（魚チェック・スタック遷移連携、アクセシビリティ対応）[cite: 9] |
| `src/styles/components/cardStyles.ts` | カードUI用共通Tailwind CSSクラス定義（`CARD_STYLES`）[cite: 9] |
| `src/styles/components/listStyles.ts` | リストUI用共通Tailwind CSSクラス定義（`LIST_STYLES`）[cite: 9] |
| `src/styles/components/detailStyles.ts` | 詳細ビュー用共通Tailwind CSSクラス定義（`DETAIL_STYLES`）[cite: 9] |
| `src/styles/features/FishTrackerStyle.ts` | 魚チェッカー CSSクラス定義（`FISH_STYLES`）[cite: 9] |
| `src/styles/tokens/commonTokens.ts` | アプリ共通 CSSクラス定義（`COMMON_TOKENS`）[cite: 9] |
| `src/styles/tokens/layoutTokens.ts` | アプリ共通 CSSクラス定義（`LAYOUT_TOKENS`）[cite: 9] |
| `src/data/` | マスターデータおよびリレーション定義（`fishes`, `zones`, `baits`, `locations`, `relations`）[cite: 9] |

---

## 5. UI/UX標準化ルール（カード vs リスト）

### **カード表示 (`AreaCard`, `BaitCard`, `FishCard`)**
- カードの垂直高さを適正に保ちつつ、情報網羅性を高める **3段構成** を採用する。[cite: 9]
  1. **上段:** 名称表示領域（日本語名・英語名の縦並び）[cite: 9]
  2. **中段:** 説明文領域 (`CARD_STYLES.descriptionBox`)[cite: 9]
  3. **下段:** 関連データ一覧表示（`Fish`アイコン + 「釣れる魚 (N):」 + タグ最大2件 + 超過分の `+N` バッジ）[cite: 9]

### **リスト表示 (`AreaListItem`, `BaitListItem`, `FishListItem`)**
- 垂直方向への高速スキャンと高密度表示を実現する **横並び構成** を採用する。[cite: 9]
  - 縦に段数を増やさず（3段目の追加を禁止）、1行（高密度2段）の垂直高さを維持する。[cite: 9]
  - **構成:** 左側:名称（縦並び） / 中央:説明文（1行 truncate・右寄せ） / 右端:総数インジケーター（`Fish`アイコン + 件数バッジ）。[cite: 9]

### **アクセシビリティ・キーボード操作対応**
- カードおよびリスト要素などのクリック可能領域 (`div`) には、必ず `role="button"`、`tabIndex={0}`、および `onKeyDown`（Enter / Spaceキー判定）を付与する。[cite: 9]
- 戻るボタンや閉じるボタンなどのアイコン操作部には、`title` と同時に `aria-label` を明記してスクリーンリーダーへ配慮する。[cite: 9]

### **ヘッダーアイコンのカラー定義**
- **魚（Fish）:** シアン (`text-cyan-400`)[cite: 9]
- **エリア（MapPin）:** エメラルド / レッド (`text-red-400` 等)[cite: 9]
- **エサ（Disc / Utensils）:** アンバー (`text-amber-400`)[cite: 9]

---

## 6. ユーザープロファイル・応答制約（開発AI向け）

- **応答の原則**: 結論・要点を先に述べ、簡潔かつ直接的に回答すること。[cite: 9]
- **締め言葉の禁止**: 回答末尾での感想の質問、感情への同意の要求、過度なまとめや演出、問いかけは一切禁止。結論または成果物の提示のみで簡潔に終了すること。[cite: 9]
- **Git運用**: 基本的に `main` から切り出した機能ブランチ（`feature/*`）で開発を進める。[cite: 9]

---

## 7. 実装規約・ガイドライン

### **ファイルヘッダーコメントの標準規約（AI指示書型フォーマット）**
今後作成・更新するすべてのコードファイル（TS/TSX/JSX等）の冒頭には、以下の標準化フォーマットに基づくJSDocブロックコメントを必ず明記し、リファクタリング時にも最新状態へ維持・更新してください。[cite: 9]

#### 1. ヘッダーコメント記述フォーマット
```tsx
/**
 * ============================================================================
 * [FilePath] {src/から始まる相対パス}
 * [Role]     {このファイルの主要な役割・存在理由を一言で記述}
 * 
 * [概要]
 * - {機能・役割の要点1}
 * - {機能・役割の要点2}
 * 
 * [依存関係・関連ファイル]
 * - スタイル : {参照しているスタイル定数やトークンファイル}
 * - 型定義   : {依存している型定義ファイル}
 * - 親・関連 : {このコンポーネントを呼ぶ親、または相互参照するコンポーネント}
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レイアウト/構造上の制約】 {例: 親側で高度固定されているため height: 100% を維持すること 等}
 * 2. 【スタイルの集約】        {例: 直接Tailwindを書かず、トークン/スタイル定数を使うこと 等}
 * 3. 【ロジック・例外処理】    {例: 0除算防止チェックを外さないこと 等}
 * 4. 【アクセシビリティ・作法】{例: button には type="button" を明記すること 等}
 * ============================================================================
 */
```

#### 2. 各項目の定義と記述基準
- **`[FilePath]`**: プロジェクト内での正確な位置を示します（例: `src/features/fishtracker/FilterBar.tsx`）。[cite: 9]
- **`[Role]`**: コンポーネントやモジュールの責務を一言で定義します。[cite: 9]
- **`[概要]`**: 主要機能、描画条件、状態管理のルールを箇条書きで平易に記載します。[cite: 9]
- **`[依存関係・関連ファイル]`**: スタイル定数、型定義、関連コンポーネントとの結合関係を明記し、不適切な新規インポートを防ぎます。[cite: 9]
- **`[編集・改修時の注意事項]`**: **AIに対する強い制約指示（ガードレール）**です。レイアウト破壊を防ぐ制約や、コード改修時に保持すべき重要ルール（`as const`、`type="button"`、sticky吸着制御、ゼロ除算回避等）を明記します。既存の注意事項を理由なく削除・無視することを禁止します。[cite: 9]

---

### **開発・コード記述規約**

- **リレーションデータの参照基準**:
  - 魚・エリア・餌の結びつきを表示する際は、単体マスターの埋め込み配列ではなく、必ずマスターリレーションデータ（`FISH_LOCATIONS`, `FISH_BAIT_RELATIONS` 等）を参照して動的に算出すること。[cite: 9]
- **カード内要素の溢れ制限デザイン**:
  - カード内に可変長の関連要素（エリア名や魚名）をタグ表示する場合は、原則として上位2件を表示し、超過分は `+N` のバッジ形式でカウント表示してカードの高さを保持すること。[cite: 9]
- **UIスタイルの集約**:
  - カード、リスト、詳細表示等、再利用性の高い共通コンポーネントの Tailwind CSS クラス群は `src/styles/*Styles.ts` や `src/styles/tokens/*` に定数（`as const`）として定義して参照する。[cite: 9]
- **ボタン要素の定義**:
  - `button` タグを配置する際は、必ず `type="button"`（フォーム送信用の場合は `type="submit"`）を明記すること。[cite: 9]
- **テキストデータの改行処理とレンダリングのキー厳格化**:
  - マスターデータ内のテキスト改行は `\n`（または `\\n`）で混在しうるため、表示側（React）では `/\r?\n|\\n/` の正規表現等を用いて安全に分割・置換・レンダリングを行うこと。[cite: 9]
  - JSXで配列を `map` 描画する際、テキスト行などのキーには配列インデックス単体（`key={index}`）を避け、文字列の一部やユニークなIDを組み合わせたキー（`key={`${index}-${line.slice(0, 10)}`}`）を使用すること。[cite: 9]

---

## AI Development Context & Architecture Guide出力時の注意

- *マークダウン出力時の注意* バッククォートを4連（````）で囲むことで、内部の ```tsx などのコードブロックが意図せず閉じたり、プレーンテキスト表示が崩れたりしないようにエスケープ処理を行ってください。[cite: 9]