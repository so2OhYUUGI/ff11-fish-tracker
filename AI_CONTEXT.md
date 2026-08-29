# AI Development Context & Architecture Guide (共通基盤仕様)

このドキュメントは、本プロジェクト（ff11-fish-tracker）を開発・保守するAIアシスタントのための全体仕様書およびガイドラインです。

---

## 1. プロジェクト概要

- **目的**: FF11（ファイナルファンタジー11）の各種インゲーム要素（釣魚・フェイス取得等）の進捗管理およびデータ参照Webアプリ。
- **ターゲット**: 個人プレイヤー（PC/スマホ双方対応）。
- **データ設計指針**: Windower Resources (items.lua, zones.lua) のデータ仕様・ID体系をベースとし、アプリ独自の補足データおよび LocalStorage によるユーザー進捗を統合。
- **AIチャットスレッド名**: 📝FF11 釣魚チェッカー・フェイス取得チェッカー開発支援
- **機能別個別仕様書**:
  - 釣魚チェッカーの固有仕様およびコンポーネント一覧は [釣魚チェッカー仕様書 (`docs/fish-tracker-spec.md`)](#) を参照。
  - フェイスチェッカーの固有仕様およびコンポーネント一覧は [フェイスチェッカー仕様書 (`docs/face-tracker-spec.md`)](#) を参照。

---

## 2. 技術スタック & 設定

- **ビルドツール**: Vite
- **UIライブラリ**: React (TypeScript)
- **ルーティング**: React Router (`react-router-dom` v6, パスベースルーティング)
- **スタイリング**: Tailwind CSS (v4)
- **アイコン**: lucide-react
- **エッジ/SSR環境**: Cloudflare Workers / Pages Functions (`functions/[[path]].ts`)
- **メタ情報・Head管理**: `react-helmet-async`
- **パスエイリアス**: `@/*` -> `./src/*` (`tsconfig.app.json` および `vite.config.ts` でマッピング)
- **モジュール構文**: `verbatimModuleSyntax` 有効（型インポート時は `import type { ... }` を使用すること）

---

## 3. 共通ファイル・コンポーネント一覧（基盤領域）

| ファイル | 役割 |
|---|---|
| `functions/[[path]].ts` | OGP画像生成（/api/ogp）およびSNSクローラー向けHTMLメタタグの動的書き換え（HTMLRewriter/エッジ処理） |
| `src/App.tsx` | アプリケーションのエントリーポイント。`UserDataProvider` による状態供給、共有URL復元、各種ダイアログ/モーダル状態の保持 |
| `src/contexts/UserDataContext.tsx` | ユーザー進捗データ（キャラ管理・達成状態・LocalStorage永続化・共有データ展開）をアプリ全体に提供する React Context / Providerおよび `useUserDataContext` フック |
| `src/contexts/useUserData.ts` | `UserDataContext` 内で使用される LocalStorage データの永続化およびキャラクター操作ロジック管理用フック |
| `src/constants/character.ts` | キャラクター識別・判定用定数定義（ゲストID、フォールバック値等） |
| `src/routes/AppRouter.tsx` | パスベースルーティング構造の集約定義。MainLayout を軸としたレイアウト・表示切り替えの構築 |
| `src/utils/share.ts` | Web Share APIおよびクリップボードコピー処理ユーティリティ |
| `src/utils/shareEncoding.ts` | 各種進捗データの共有用エンコード/デコード処理 |
| `src/utils/shareDataBuilder.ts` | 共有パラメータからOGP描画に必要なカード表示用データを算出・集計 |
| `src/components/common/SEO.tsx` | SEOメタ情報設定（Head管理） |
| `src/components/common/SeoHead.tsx` | ページ個別ヘッダーメタ定義 |
| `src/components/share/DynamicOgpMeta.tsx` | 共有URLパラメータに基づきクライアント側で動的OGPメタタグを設定するコンポーネント |
| `src/components/common/AdBanner.tsx` | 広告エリア（プレースホルダー / AdSense枠） |
| `src/components/common/ShareDetailButton.tsx` | 詳細画面用共有ボタン |
| `src/components/common/ShareProgressButton.tsx` | 進捗のSNS共有ボタン |
| `src/components/layout/Header.tsx` | アプリタイトル、キャラ切替UI、開発用ツール導線 |
| `src/components/layout/Footer.tsx` | 権利表記・ライセンス注記・著作権表示 |
| `src/components/layout/MainLayout.tsx` | ヘッダー・フッター・広告枠を含む共通レイアウト（`children` または `<Outlet />` の描画に対応） |
| `src/components/settings/SettingsModal.tsx` | 各種設定モーダルダイアログ |
| `src/components/dev/MasterDataEditorModal.tsx` | マスターデータ編集・テスト用モーダル |
| `src/components/LandingPage.tsx` | 未登録ユーザー向けランディングページコンポーネント |
| `src/styles/components/cardStyles.ts` | カードUI用共通Tailwind CSSクラス定義（`CARD_STYLES`） |
| `src/styles/components/listStyles.ts` | リストUI用共通Tailwind CSSクラス定義（`LIST_STYLES`） |
| `src/styles/components/detailStyles.ts` | 詳細ビュー用共通Tailwind CSSクラス定義（`DETAIL_STYLES`） |
| `src/styles/tokens/commonTokens.ts` | アプリ共通 CSSクラス定義（`COMMON_TOKENS`） |
| `src/styles/tokens/layoutTokens.ts` | アプリ共通 CSSクラス定義（`LAYOUT_TOKENS`） |
| `src/index.css` (または `globals.css`) | テーマCSS変数 (`:root`, `[data-theme="..."]`) および全体スタイルインポートの集約定義 |

---

## 4. UI/UX標準化ルール（カード vs リスト）

### **カード表示**
- カードの垂直高さを適正に保ちつつ、情報網羅性を高める **3段構成** を採用する。
  1. **上段:** 名称表示領域（日本語名・英語名の縦並び）
  2. **中段:** 説明文領域 (`CARD_STYLES.descriptionBox`)
  3. **下段:** 関連データ一覧表示（アイコン + 「関連データ (N):」 + タグ最大2件 + 超過分の `+N` バッジ）

### **リスト表示**
- 垂直方向への高速スキャンと高密度表示を実現する **横並び構成** を採用する。
  - 縦に段数を増やさず（3段目の追加を禁止）、1行（高密度2段）の垂直高さを維持する。
  - **構成:** 左側:名称（縦並び） / 中央:説明文（1行 truncate・右寄せ） / 右端:総数インジケーター（アイコン + 件数バッジ）。

### **アクセシビリティ・キーボード操作対応**
- カードおよびリスト要素などのクリック可能領域 (`div`) には、必ず `role="button"`、`tabIndex={0}`、および `onKeyDown`（Enter / Spaceキー判定）を付与する。
- 戻るボタンや閉じるボタンなどのアイコン操作部には、`title` と同時に `aria-label` を明記してスクリーンリーダーへ配慮する。

---

## 5. テーマ切替・CSS変数（スタイルスイッチ）仕様

ルート要素の `data-theme` 属性（`fish` / `trust` 等）の切替に応じて、CSS変数（CSS Custom Properties）によりUI全体の配色スタイルを一括制御します。

### **1. レイアウト構成と背景の分離設計**
- **全画面背景 (`BASE_PAGE`)**: 最外郭の背景色には固定のダークカラー（`bg-slate-900`）を適用し、テーマ切替時もアプリ基盤の一貫した背景色を維持する。
- **メインレイアウト (`mainContainer`)**: 背景色を指定せず透明に保ち、内部のコンテンツやカードコンポーネント側に設定されたテーマ変数を透け込ませる設計とする。
- **スタイルトークンによる参照**: コンポーネント側で直接色コードを記述せず、`LAYOUT_TOKENS` や `CARD_STYLES` を経由して動的CSS変数を参照する。

### **2. 各テーマCSS変数の役割定義**

CSS（`index.css` / `globals.css`）で定義される各テーマ変数の適用範囲と役割は以下の通りです。

| CSS変数名 | 適用領域・役割 |
|---|---|
| `--theme-page-bg` | バック地 |
| `--theme-header-bg` | ヘッダーおよびフッター領域の背景グラデーション（`linear-gradient`） |
| `--theme-header-border` | ヘッダー・フッター周りの境界線色（Border） |
| `--theme-accent-border` | テーマを象徴する主要な強調枠線色、またはアクティブ状態の境界線 |
| `--theme-accent-bg` | アイコン背景や強調ボタン、テキスト選択領域（`selection`）等のアクセント背景色 |
| `--theme-text-accent` | 強調表示テキスト、見出しアイコン、アクティブ状態の文字色 |
| `--theme-badge-bg` | カード・空状態コンテナ・各種バッジ等のコンテンツ背景色 |
| `--theme-badge-text` | バッジ内部テキストやアクティブメニュー要素の強調文字色 |
| `--theme-badge-border` | バッジやカード要素の微細な枠線色 |

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

- **ルーティング・関心事の分離**:
  - `App.tsx` 内に直接 `<Routes>` や `<Route>` を定義せず、ルーティング定義は `src/routes/AppRouter.tsx` へ集約し、閲覧権限（`canViewContainer`）に応じたレイアウト・画面の切り替えを同コンポーネント内で処理して責務を分離すること。
- **カード内要素の溢れ制限デザイン**:
  - カード内に可変長の関連要素をタグ表示する場合は、原則として上位2件を表示し、超過分は `+N` のバッジ形式でカウント表示してカードの高さを保持すること。
- **UIスタイルの集約**:
  - カード、リスト、詳細表示等、再利用性の高い共通コンポーネントの Tailwind CSS クラス群は `src/styles/*Styles.ts` や `src/styles/tokens/*` に定数（`as const`）として定義して参照する。
- **ボタン要素の定義**:
  - `button` タグを配置する際は、必ず `type="button"`（フォーム送信用の場合は `type="submit"`）を明記すること。
- **テキストデータの改行処理とレンダリングのキー厳格化**:
  - マスターデータ内のテキスト改行は `\n`（または `\\n`）で混在しうるため、表示側（React）では `/\r?\n|\\n/` の正規表現等を用いて安全に分割・置換・レンダリングを行うこと。
  - JSXで配列を `map` 描画する際、テキスト行などのキーには配列インデックス単体（`key={index}`）を避け、文字列の一部やユニークなIDを組み合わせたキーを使用すること。
  
---

## AI Development Context & Architecture Guide出力時の注意

- *マークダウン出力時の注意* バッククォートを4連（````）で囲むことで、内部の ```tsx などのコードブロックが意図せず閉じたり、プレーンテキスト表示が崩れたりしないようにエスケープ処理を行ってください。