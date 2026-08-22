/**
 * ============================================================================
 * [FilePath] src/styles/index.ts (または DESIGN_SYSTEM_GUIDE.md)
 * [Role] デザインシステム・CSSクラス（Tailwind）管理の統一指針書兼インデックス
 * 
 * ============================================================================
 * 1. 概要・設計思想
 * ============================================================================
 * 当プロジェクトでは、UIの一貫性維持とJSX内の視認性向上（ハードコード排除）のため、
 * スタイル定義を以下の3階層に分離して管理します。
 * 
 *  [ Layer 1: Tokens ]
 *    ├─ layoutTokens.ts   : 画面全体構成、基本グリッド、ヘッダー、サイドバー等の外枠構造
 *    └─ commonTokens.ts   : アプリ共通カラー、ステート（Default/Selected/Checked）、基本UI要素
 * 
 *  [ Layer 2: Feature Styles ]
 *    └─ features/fishStyles.ts : ドメイン固有（魚サイズ、水質、ハラキリ等）の装飾
 * 
 *  [ Layer 3: Component Styles ]
 *    ├─ cardStyles.ts      : グリッドカード用枠組み・タイポグラフィ
 *    ├─ listStyles.ts      : テーブル/リスト行用高密度スタイル
 *    ├─ filterBarStyles.ts : 検索・ナビゲーションバー用
 *    └─ detailStyles.ts    : 詳細パネル / モーダル用
 * 
 * ============================================================================
 * 2. 現状検出された「ハードコード残存箇所」リスト（要修正箇所）
 * ============================================================================
 * 以下の要素が JSX 内に直接記述されており、スタイルトークン / スタイル定数へ
 * 統合する必要があります。
 * 
 * ----------------------------------------------------------------------------
 * A. FishDetailView.tsx （詳細パネルコンポーネント）
 * ----------------------------------------------------------------------------
 * [1] ヘッダー操作ボタン
 *     - 閉じるボタン (<X>):
 *       `p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors shrink-0`
 *       => `DETAIL_STYLES.closeButton` を割り当てる（またはヘッダー用closeButtonを整備）
 * 
 * [2] コンテンツ領域のスクロールコンテナ
 *     - `flex-1 min-h-0 overflow-y-auto p-4 space-y-6`
 *       => `DETAIL_STYLES.contentBody` を新設して統合
 * 
 * [3] ハラキリ / 属性バッジ・テキスト
 *     - アイテムバッジ: `px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium`
 *     - 獲得称号バッジ: `px-2.5 py-1 rounded bg-amber-950/40 text-amber-300 border border-amber-800/60 font-medium`
 *     => `DETAIL_STYLES.harakiriItem` / `harakiriTitle` を新設
 * 
 * [4] 竿相性テーブル（Rod Relation Table）
 *     - ラッパー枠: `border border-slate-700 rounded-lg overflow-hidden`
 *     - テーブルヘッダー (thead): `bg-slate-800 text-slate-400 border-b border-slate-700`
 *     - 各セル/ステータス色 (possible / impossible / yes / no) の直接カラー指定
 *     => `DETAIL_STYLES.table.*` に一括統合する
 * 
 * ============================================================================
 * 3. 実装・リファクタリング規約（Checklist）
 * ============================================================================
 * 1. [ ] JSX内に `bg-slate-*`, `border-slate-*`, `text-cyan-*` などの生のTailwindクラスを書かない。
 * 2. [ ] 共通の構造は `DETAIL_STYLES`, `CARD_STYLES`, `LIST_STYLES` から参照する。
 * 3. [ ] トークンを変更した場合、プロジェクト全体で変更が反映される構成を維持する。
 */