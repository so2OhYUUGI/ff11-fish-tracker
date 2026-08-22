/**
 * ============================================================================
 * [FilePath] src/styles/tokens/commonTokens.ts
 * [Role] デザインシステム全体の基本トークン（カラー、状態、共通テキストスタイル）
 * 
 * [概要]
 * - エンティティ（魚、エリア、エサ）固有のテーマカラー
 * - コンポーネントの状態（通常、選択中、チェック済み、データ無し）の統一スタイル
 * - フォーム要素・ボタン等の汎用入力スタイル定義
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
    default: 'bg-slate-800 border-slate-700 hover:border-slate-500 shadow-md',
    selected: 'bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg',
    checked: 'bg-slate-800/60 border-emerald-500/50 shadow-sm opacity-80 hover:opacity-100',
    empty: 'opacity-70',
    emptyIcon: 'text-slate-500',
    emptyBadge: 'bg-slate-900/40 border-slate-800/80 text-slate-500',
  },

  // タイトル・テキストの基本階層
  text: {
    titleMain: 'text-2xl font-bold tracking-tight text-white',
    titleJa: 'font-bold transition-colors',
    titleEn: 'text-xs text-slate-400 font-mono font-normal',
    subText: 'text-xs text-slate-400',
    label: 'block text-xs font-medium text-slate-300',
  },

  // コンテナ・ボックスの共通背景・枠線
  box: {
    dark: 'bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-300',
    darker: 'bg-slate-900/80 border border-slate-700 rounded-md text-slate-200',
  },

  // フォームUI共通スタイル
  form: {
    input: 'w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
    primaryButton: 'w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg shadow-md transition-colors',
  },
} as const;