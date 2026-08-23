/**
 * ============================================================================
 * [FilePath] src/styles/tokens/commonTokens.ts
 * [Role]     デザインシステム全体の基本トークン（カラー、状態、共通テキストスタイル）
 * 
 * [概要]
 * - エンティティ（魚、エリア、エサ）固有のテーマカラー
 * - コンポーネントの状態（通常、選択中、チェック済み、データ無し）の統一スタイル
 * - フォーム要素・ボタン等の汎用入力スタイル定義
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レスポンシブ制約】 モバイルファースト設計に基づき、sm/mdブレイクポイントで適切なフォント・余白を保証すること。
 * 2. 【スタイルの集約】 定義の不意な破損を防ぐため、オブジェクト末尾の `as const` を維持すること。
 * 3. 【アクセシビリティ】 タップ領域（min-h, py）が小画面でも窮屈にならないよう配慮すること。
 * ============================================================================
 */

export const COMMON_TOKENS = {
  // アプリ全体の基本カラー・テキスト階層
  color: {
    primary: 'text-blue-400',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-500',
    textMain: 'text-white',
    textMuted: 'text-slate-400',
  },

  // エンティティ別アクセントカラー
  entity: {
    fish: {
      text: 'text-cyan-400',
      textActive: 'text-cyan-300',
      badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
    },
    area: {
      text: 'text-red-400',
      textActive: 'text-red-300',
      badge: 'bg-red-950/80 text-red-300 border-red-800/60',
    },
    bait: {
      text: 'text-amber-400',
      textActive: 'text-amber-300',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    },
  },

  // コンポーネント共通の状態スタイル
  state: {
    default: 'bg-slate-800 border-slate-700 hover:border-slate-500 shadow-md transition-colors',
    selected: 'bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg transition-colors',
    checked: 'bg-slate-800/60 border-emerald-500/50 shadow-sm opacity-80 hover:opacity-100 transition-opacity',
    empty: 'opacity-70',
    emptyIcon: 'text-slate-500',
    emptyBadge: 'bg-slate-900/40 border-slate-800/80 text-slate-500',
  },

  // タイトル・テキストの基本階層（レスポンシブ調整）
  text: {
    titleMain: 'text-xl sm:text-2xl font-bold tracking-tight text-white',
    titleJa: 'font-bold transition-colors text-sm sm:text-base',
    titleEn: 'text-[10px] sm:text-xs text-slate-400 font-mono font-normal',
    subText: 'text-xs sm:text-sm text-slate-400',
    label: 'block text-xs sm:text-sm font-medium text-slate-300',
  },

  // コンテナ・ボックスの共通背景・枠線（レスポンシブパディング考慮）
  box: {
    dark: 'bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-300 p-3 sm:p-4',
    darker: 'bg-slate-900/80 border border-slate-700 rounded-md text-slate-200 p-2.5 sm:p-3',
  },

  // フォームUI共通スタイル（タッチターゲット・レスポンシブ調整）
  form: {
    input: 'w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-lg px-3.5 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[42px]',
    primaryButton: 'w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg shadow-md transition-colors min-h-[42px] flex items-center justify-center',
  },

  // 共有ボタン用スタイル定義（レスポンシブ調整）
  button: {
    shareIcon: 'p-2 sm:p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center shrink-0 min-w-[40px] min-h-[40px]',
    shareProgress: 'flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 transition-colors text-xs sm:text-sm font-medium min-h-[36px]',
  },

  // アラート・通知メッセージUI
  alert: {
    warningBox: 'flex items-start gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-left bg-amber-500/15 border border-amber-500/30 shadow-inner',
    warningText: 'text-amber-200 text-xs sm:text-sm leading-relaxed font-medium',
    warningIcon: 'text-amber-400 text-sm sm:text-base leading-none shrink-0 mt-0.5',
    infoPanel: 'p-3 sm:p-4 bg-amber-950/50 border border-amber-600/50 rounded-xl text-xs sm:text-sm text-amber-200 space-y-2',
    infoPanelTitle: 'font-bold text-xs sm:text-sm',
    infoPanelText: 'leading-relaxed text-xs sm:text-sm',
    actionButton: 'w-full py-2.5 sm:py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition text-center text-xs sm:text-sm min-h-[40px] flex items-center justify-center',
  },

  // リンク・テキストボタン系
  actionText: {
    cancelLink: 'text-xs sm:text-sm text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors p-1 inline-block',
  },
} as const;