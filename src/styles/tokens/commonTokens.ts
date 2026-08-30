/**
 * ============================================================================
 * [FilePath] src/styles/tokens/commonTokens.ts
 * [Role]     デザインシステム全体の基本トークン（カラー、状態、共通テキストスタイル）
 * 
 * [概要]
 * - CSSテーマ変数（var(--theme-*)）に準拠し、データテーマ（fish/trust）切替に対応
 * - コンポーネントの状態（通常、選択中、チェック済み、データ無し）の統一スタイル
 * - フォーム要素・ボタン等の汎用入力スタイル定義
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【テーマ連動】 静的な色指定（slate-900/cyan-400等）は極力避け、CSS変数(--theme-*)を使用すること。
 * 2. 【レスポンシブ制約】 モバイルファースト設計に基づき、sm/mdブレイクポイントで適切なフォント・余白を保証すること。
 * 3. 【スタイルの集約】 定義の不意な破損を防ぐため、オブジェクト末尾の `as const` を維持すること。
 * 4. 【アクセシビリティ】 タップ領域（min-h, py）が小画面でも窮屈にならないよう配慮すること。
 * ============================================================================
 */

export const COMMON_TOKENS = {
  // アプリ全体の基本カラー・テキスト階層（テーマ変数準拠）
  color: {
    primary: 'text-[var(--theme-text-accent)]',
    primaryBg: 'bg-[var(--theme-accent-bg)]',
    primaryHover: 'hover:opacity-90',
    textMain: 'text-slate-100',
    textMuted: 'text-slate-400',
  },

  // 機能モード別テーマカラー（テーマ変数への参照および補足要素）
  mode: {
    fish: {
      text: 'text-blue-400',
      textActive: 'text-blue-300',
      bg: 'bg-blue-600',
      bgHover: 'hover:bg-blue-500',
      border: 'border-blue-500',
      borderMuted: 'border-blue-800/60',
      badge: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
      iconBg: 'bg-blue-950/80 border-blue-700/50 text-blue-400',
      ring: 'focus:ring-blue-500 ring-blue-500/50',
    },
    trust: {
      text: 'text-amber-400',
      textActive: 'text-amber-300',
      bg: 'bg-amber-600',
      bgHover: 'hover:bg-amber-500',
      border: 'border-amber-500',
      borderMuted: 'border-amber-800/60',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      iconBg: 'bg-amber-950/80 border-amber-700/50 text-amber-400',
      ring: 'focus:ring-amber-500 ring-amber-500/50',
    },
  },

  // エンティティ別アクセントカラー
  entity: {
    fish: {
      text: 'text-blue-400',
      textActive: 'text-blue-300',
      badge: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
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

  // コンポーネント共通の状態スタイル（テーマ変数で連動）
  state: {
    default: 'bg-[var(--theme-container-bg)] border-[var(--theme-container-border)] hover:border-[var(--theme-accent-border)]/50 shadow-md transition-colors',
    selected: 'bg-[var(--theme-active-item-bg)] border-[var(--theme-accent-border)] ring-1 ring-[var(--theme-accent-border)]/50 shadow-lg transition-colors',
    //checked: 'bg-slate-800/60 border-emerald-500/50 text-emerald-200 shadow-sm opacity-80 hover:opacity-100 transition-opacity',
    checked: 'bg-[var(--theme-checked-bg)]/.6 border-[var(--theme-checked-border)] shadow-sm opacity-80 hover:opacity-100 transition-opacity',
    empty: 'opacity-70',
    emptyIcon: 'text-slate-500',
    emptyBadge: 'bg-[var(--theme-inner-bg)] border-[var(--theme-inner-border)] text-slate-500',
  },

  // タイトル・テキストの基本階層（レスポンシブ調整）
  text: {
    titleMain: 'text-xl sm:text-2xl font-bold tracking-tight text-slate-100',
    titleJa: 'font-bold transition-colors text-sm sm:text-base text-slate-100',
    titleEn: 'text-[10px] sm:text-xs text-slate-400 font-mono font-normal',
    subText: 'text-xs sm:text-sm text-slate-400',
    label: 'block text-xs sm:text-sm font-medium text-slate-300',
  },

  // コンテナ・ボックスの共通背景・枠線（テーマ変数準拠）
  box: {
    dark: 'bg-[var(--theme-container-bg)] border border-[var(--theme-container-border)] rounded-lg text-slate-300 p-3 sm:p-4 transition-colors',
    darker: 'bg-[var(--theme-inner-bg)] border border-[var(--theme-inner-border)] rounded-md text-slate-200 p-2.5 sm:p-3 transition-colors',
  },

  // 汎用レイアウト階層
  layout: {
    stackCompact: 'space-y-1.5',
    stackStandard: 'space-y-4',
    stackLoose: 'space-y-5',
    headerGroup: 'text-center space-y-2 pt-2',
    featureGroup: 'space-y-2.5 text-xs p-3.5 rounded-xl',
  },

  // フォームUI共通スタイル（テーマ連動フォーカス枠）
  form: {
    input: 'w-full bg-[var(--theme-inner-bg)] border border-[var(--theme-container-border)] text-white placeholder-slate-400 text-sm rounded-lg px-3.5 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-border)] transition-colors min-h-[42px]',
    primaryButton: 'w-full py-2.5 sm:py-3 bg-[var(--theme-accent-bg)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg shadow-md transition-all min-h-[42px] flex items-center justify-center',
  },

  // ボタン系スタイル定義
  button: {
    shareIcon: 'p-2 sm:p-2.5 rounded-lg bg-[var(--theme-container-bg)] border border-[var(--theme-container-border)] text-slate-300 hover:text-white hover:border-[var(--theme-accent-border)] transition-colors flex items-center justify-center shrink-0 min-w-[40px] min-h-[40px]',
    disabledShare: 'opacity-50 cursor-not-allowed',
  },

  // アラート・通知メッセージUI（テーマアクセント色活用）
  alert: {
    warningBox: 'flex items-start gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-left bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] shadow-inner',
    warningText: 'text-[var(--theme-badge-text)] text-xs sm:text-sm leading-relaxed font-medium',
    warningIcon: 'text-[var(--theme-text-accent)] text-sm sm:text-base leading-none shrink-0 mt-0.5',
    infoPanel: 'p-3 sm:p-4 bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] rounded-xl text-xs sm:text-sm text-[var(--theme-badge-text)] space-y-2',
    infoPanelTitle: 'font-bold text-xs sm:text-sm text-[var(--theme-text-accent)]',
    infoPanelText: 'leading-relaxed text-xs sm:text-sm',
    actionButton: 'w-full py-2.5 sm:py-2 px-3 bg-[var(--theme-accent-bg)] hover:opacity-90 text-white font-medium rounded-lg transition text-center text-xs sm:text-sm min-h-[40px] flex items-center justify-center',
  },

  // リンク・テキストボタン系
  actionText: {
    cancelLink: 'text-xs sm:text-sm text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors p-1 inline-block',
  },
} as const;