# AI Development Context & Architecture Guide

このドキュメントは、本プロジェクト（ff11-fish-tracker）を開発・保守するAIアシスタントのための仕様書およびガイドラインです。

---

## 1. プロジェクト概要

- **目的**: FF11（ファイナルファンタジー11）の釣魚進捗管理および釣りデータ参照Webアプリ。
- **ターゲット**: 個人プレイヤー（PC/スマホ双方対応）。
- **データ設計指針**: Windower Resources (items.lua, zones.lua) のデータ仕様・ID体系をベースとし、アプリ独自の補足データ（上限スキル、ハラキリ等）および LocalStorage によるユーザー進捗を統合。
- ** AIチャットスレッド名**: 📝FF11 釣魚チェッカー開発支援

---

## 2. 技術スタック & 設定

- **ビルドツール**: Vite
- **UIライブラリ**: React (TypeScript)
- **スタイリング**: Tailwind CSS (v4)
- **アイコン**: lucide-react
- **エッジ/SSR環境**: Cloudflare Workers / Pages Functions (`functions/[[path]].ts`)
- **メタ情報・Head管理**: `react-helmet-async`
- **パスエイリアス**: `@/*` -> `./src/*` (`tsconfig.app.json` および `vite.config.ts` でマッピング)
- **モジュール構文**: `verbatimModuleSyntax` 有効（型インポート時は `import type { ... }` を使用すること）

---

## 3. データ構造（src/types/fishtracker.ts）
### **データ宣言**
- `src/types/`以下にあるファイルの宣言に従うこと

### **リレーションデータ**
- `FISH_LOCATIONS`: 魚ID (`fishId`) と エリアID (`zoneId`) の紐付け
- `FISH_BAIT_RELATIONS`: 魚ID (`fishId`) と 餌ID (`baitId`) の紐付け
- `FISH_ROD_RELATIONS`: 魚ID (`fishId`) と 竿ID (`rodId`) の相性データ

### **ユーザー進捗 (UserData / CharacterProgress)**
- LocalStorage キー: `ff11_fish_tracker_user_data`
- `checkedFishIds`: 達成済みの魚ID（`number[]`）を保持

### **共有・OGP関連データ**
- 共有URLクエリパラメータ: `share`（Base64 URL Safe等でエンコードされた文字列）
- デコード後構造: `{ characterName: string, checkedFishIds: number[] }`
- OGPカード生成用データ: `buildShareCardData` により算出（キャラクター名、達成数、全魚種数、達成率、上位獲得魚リスト等）

---

## 4. ファイル・コンポーネント一覧

| ファイル | 役割 |
|---|---|
| `functions/[[path]].ts` | OGP画像生成（/api/ogp）およびSNSクローラー向けHTMLメタタグの動的書き換え（HTMLRewriter/エッジ処理） |
| `src/types/fishtracker.ts` | 型定義（Windower互換データ、アプリ拡張、進捗構造） |
| `src/hooks/useUserData.ts` | LocalStorage永続化、キャラ追加/削除/切替、魚チェックON/OFFロジック |
| `src/utils/share.ts` | Web Share APIおよびクリップボードコピー処理ユーティリティ |
| `src/utils/shareEncoding.ts` | 釣獲進捗データの共有用エンコード/デコード処理 |
| `src/utils/shareDataBuilder.ts` | 共有パラメータからOGP描画に必要なカード表示用データを算出・集計 |
| `src/components/common/SEO.tsx` | SEOメタ情報設定（Head管理） |
| `src/components/common/SeoHead.tsx` | ページ個別ヘッダーメタ定義 |
| `src/components/share/DynamicOgpMeta.tsx` | 共有URLパラメータに基づきクライアント側で動的OGPメタタグを設定するコンポーネント |
| `src/components/common/AdBanner.tsx` | 広告エリア（プレースホルダー / AdSense枠） |
| `src/components/common/ShareDetailButton.tsx` | 詳細画面用共有ボタン |
| `src/components/common/ShareProgressButton.tsx` | 釣獲進捗のSNS共有ボタン |
| `src/components/layout/Header.tsx` | アプリタイトル、キャラ切替UI、開発用ツール導線 |
| `src/components/layout/Footer.tsx` | 権利表記・ライセンス注記・著作権表示 |
| `src/components/settings/SettingsModal.tsx` | 各種設定モーダルダイアログ |
| `src/components/dev/MasterDataEditorModal.tsx` | マスターデータ編集・テスト用モーダル |
| `src/components/LandingPage.tsx` | ランディングページコンポーネント |
| `src/features/fishtracker/FilterBar.tsx` | メインナビゲーション（魚/エリア/餌切替）、達成状態フィルター、プログレス表示、検索フォーム |
| `src/features/fishtracker/FishTrackerContent.tsx` | 魚チェッカーメイン領域の表示切替（魚/エリア/餌）、ルーティング |
| `src/features/fishtracker/fish/FishCard.tsx` | 個別魚カード（スペック表示、エリア情報の表示と+Nバッジ表示、アクセシビリティ対応） |
| `src/features/fishtracker/fish/FishListItem.tsx` | リスト表示用個別魚行コンポーネント（詳細パネル内での `variant="inline"` 対応、アクセシビリティ対応） |
| `src/features/fishtracker/fish/FishDetailView.tsx` | 魚詳細情報表示コンポーネント（アクセシビリティ・ユニークキー対応） |
| `src/features/fishtracker/area/AreaCard.tsx` | 個別エリアカード（基本情報および釣れる魚のタグ一覧＋+Nバッジ表示、アクセシビリティ・ユニークキー対応） |
| `src/features/fishtracker/area/AreaListItem.tsx` | リスト表示用個別エリア行コンポーネント（対象魚の総数バッジ表示、`useMemo`・改行エスケープ最適化、アクセシビリティ対応） |
| `src/features/fishtracker/area/AreaDetailView.tsx` | エリア詳細情報表示コンポーネント（魚チェック・スタック遷移連携、アクセシビリティ・ユニークキー対応） |
| `src/features/fishtracker/bait/BaitCard.tsx` | 個別餌カード（基本情報および釣れる魚のタグ一覧＋+Nバッジ表示、アクセシビリティ対応） |
| `src/features/fishtracker/bait/BaitListItem.tsx` | リスト表示用個別餌行コンポーネント（説明文横並び＋対象魚の総数バッジ表示、`useMemo`・改行エスケープ最適化、アクセシビリティ対応） |
| `src/features/fishtracker/bait/BaitDetailView.tsx` | 餌詳細情報表示コンポーネント（魚チェック・スタック遷移連携、アクセシビリティ対応） |
| `src/styles/components/cardStyles.ts` | カードUI用共通Tailwind CSSクラス定義（`CARD_STYLES`） |
| `src/styles/components/listStyles.ts` | リストUI用共通Tailwind CSSクラス定義（`LIST_STYLES`） |
| `src/styles/components/detailStyles.ts` | 詳細ビュー用共通Tailwind CSSクラス定義（`DETAIL_STYLES`） |
| `src/styles/features/FishTrackerStyle.ts` | 魚チェッカー CSSクラス定義（`FISH_STYLES`） |
| `src/styles/tokens/commonTokens.ts` | アプリ共通 CSSクラス定義（`COMMON_TOKENS`） |
| `src/styles/tokens/layoutTokens.ts` | アプリ共通 CSSクラス定義（`LAYOUT_TOKENS`） |
| `src/data/` | マスターデータおよびリレーション定義（`fishes`, `zones`, `baits`, `locations`, `relations`） |

---

## 5. UI/UX標準化ルール（カード vs リスト）

### **カード表示 (`AreaCard`, `BaitCard`, `FishCard`)**
- カードの垂直高さを適正に保ちつつ、情報網羅性を高める **3段構成** を採用する。
  1. **上段:** 名称表示領域（日本語名・英語名の縦並び）
  2. **中段:** 説明文領域 (`CARD_STYLES.descriptionBox`)
  3. **下段:** 関連データ一覧表示（`Fish`アイコン + 「釣れる魚 (N):」 + タグ最大2件 + 超過分の `+N` バッジ）

### **リスト表示 (`AreaListItem`, `BaitListItem`, `FishListItem`)**
- 垂直方向への高速スキャンと高密度表示を実現する **横並び構成** を採用する。
  - 縦に段数を増やさず（3段目の追加を禁止）、1行（高密度2段）の垂直高さを維持する。
  - **構成:** 左側:名称（縦並び） / 中央:説明文（1行 truncate・右寄せ） / 右端:総数インジケーター（`Fish`アイコン + 件数バッジ）。

### **アクセシビリティ・キーボード操作対応**
- カードおよびリスト要素などのクリック可能領域 (`div`) には、必ず `role="button"`、`tabIndex={0}`、および `onKeyDown`（Enter / Spaceキー判定）を付与する。
- 戻るボタンや閉じるボタンなどのアイコン操作部には、`title` と同時に `aria-label` を明記してスクリーンリーダーへ配慮する。

### **ヘッダーアイコンのカラー定義**
- **魚（Fish）:** シアン (`text-cyan-400`)
- **エリア（MapPin）:** エメラルド / レッド (`text-red-400` 等)
- **エサ（Disc / Utensils）:** アンバー (`text-amber-400`)

---

## 6. 動的OGP & SNSクローラー（SSR/エッジ処理）仕様

### **1. クローラー向け動的OGP挿入（`functions/[[path]].ts`）**
- URLパラメータに `share` が含まれる場合、Cloudflare Workers の `HTMLRewriter` により HTML レスポンス内の各メタタグ（`og:title`, `og:description`, `og:image`, `twitter:title`, `twitter:description`, `twitter:image` 等）を即座に動的書き換えする。

### **2. OGP画像生成（`/api/ogp`）**
- **レスポンス形式要件**: X (Twitter) などの主要SNSプラットフォームは SVG 形式のカード描画に対応していないため、OGP画像エンドポイント `/api/ogp` は必ず **PNG形式 (`image/png`)** のバイナリ画像でレスポンスを返却しなければならない。
- **WASMの利用**: エッジ環境（Cloudflare Workers）で動作する SVG → PNG 変換モジュール（`svg2png-wasm` 等）を用いて動的生成された SVG 構造を PNG にバイナリ変換する。

---

## 7. ユーザープロファイル・応答制約（開発AI向け）

- **応答の原則**: 結論・要点を先に述べ、簡潔かつ直接的に回答すること。
- **締め言葉の禁止**: 回答末尾での感想の質問、感情への同意の要求、過度なまとめや演出、問いかけは一切禁止。結論または成果物の提示のみで簡潔に終了すること。
- **Git運用**: 基本的に `main` から切り出した機能ブランチ（`feature/*`）で開発を進める。

---

## 8. 実装規約・ガイドライン

### **ファイルヘッダーコメントの標準規約（AI指示書型フォーマット）**
今後作成・更新するすべてのコードファイル（TS/TSX/JSX等）の冒頭には、以下の標準化フォーマットに基づくJSDocブロックコメントを必ず明記し、リファクタリング時にも最新状態へ維持・更新してください。

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
- **`[FilePath]`**: プロジェクト内での正確な位置を示します（例: `src/features/fishtracker/FilterBar.tsx`）。
- **`[Role]`**: コンポーネントやモジュールの責務を一言で定義します。
- **`[概要]`**: 主要機能、描画条件、状態管理のルールを箇条書きで平易に記載します。
- **`[依存関係・関連ファイル]`**: スタイル定数、型定義、関連コンポーネントとの結合関係を明記し、不適切な新規インポートを防ぎます。
- **`[編集・改修時の注意事項]`**: **AIに対する強い制約指示（ガードレール）**です。レイアウト破壊を防ぐ制約や、コード改修時に保持すべき重要ルール（`as const`、`type="button"`、sticky吸着制御、ゼロ除算回避等）を明記します。既存の注意事項を理由なく削除・無視することを禁止します。

---

### **開発・コード記述規約**

- **リレーションデータの参照基準**:
  - 魚・エリア・餌の結びつきを表示する際は、単体マスターの埋め込み配列ではなく、必ずマスターリレーションデータ（`FISH_LOCATIONS`, `FISH_BAIT_RELATIONS` 等）を参照して動的に算出すること。
- **カード内要素の溢れ制限デザイン**:
  - カード内に可変長の関連要素（エリア名や魚名）をタグ表示する場合は、原則として上位2件を表示し、超過分は `+N` のバッジ形式でカウント表示してカードの高さを保持すること。
- **UIスタイルの集約**:
  - カード、リスト、詳細表示等、再利用性の高い共通コンポーネントの Tailwind CSS クラス群は `src/styles/*Styles.ts` や `src/styles/tokens/*` に定数（`as const`）として定義して参照する。
- **ボタン要素の定義**:
  - `button` タグを配置する際は、必ず `type="button"`（フォーム送信用の場合は `type="submit"`）を明記すること。
- **テキストデータの改行処理とレンダリングのキー厳格化**:
  - マスターデータ内のテキスト改行は `\n`（または `\\n`）で混在しうるため、表示側（React）では `/\r?\n|\\n/` の正規表現等を用いて安全に分割・置換・レンダリングを行うこと。
  - JSXで配列を `map` 描画する際、テキスト行などのキーには配列インデックス単体（`key={index}`）を避け、文字列の一部やユニークなIDを組み合わせたキー（`key={`${index}-${line.slice(0, 10)}`}`）を使用すること。

---

## AI Development Context & Architecture Guide出力時の注意

- *マークダウン出力時の注意* バッククォートを4連（````）で囲むことで、内部の ```tsx などのコードブロックが意図せず閉じたり、プレーンテキスト表示が崩れたりしないようにエスケープ処理を行ってください。