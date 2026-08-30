/**
 * ============================================================================
 * [FilePath] src/styles/components/detailStyles.ts
 * [Role]     詳細表示（モーダル / 詳細パネル）用の共通スタイル定義定数（Tailwind CSS クラス）
 * 
 * [概要]
 * - 魚・エリア・餌・フェイスの詳細表示パネルおよびモーダル用スタイル
 * - モードテーマ（data-theme="fish" / "trust"）に連動するCSS変数参照に対応
 * - モバイル〜PC環境での高さ制限（スクロール制御）、ヘッダーのレイアウト固定、テーブル表示の最適化
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レイアウト/構造上の制約】 追従サイドバーおよびモーダル内で縦スクロールを正常に機能させるため、panelBase および scrollContent の min-h-0 / overflow 制御を壊さないこと。
 * 2. 【スタイルの集約】 定義の崩れを防ぐため、オブジェクト末尾の `as const` を維持すること。
 * 3. 【アクセシビリティ・タッチ領域】 戻る・閉じる・チェック操作ボタンのタップ領域（min-h-[36px]以上）を考慮すること。
 * ============================================================================
 */

export const DETAIL_STYLES = {
  container:
    'w-full bg-[var(--theme-container-bg)] border border-[var(--theme-container-border)] rounded-xl md:p-6 flex flex-col gap-4 sm:gap-6 h-full relative overscroll-contain',
  panelBase: 'w-full flex flex-col h-full min-h-0 overflow-hidden overscroll-contain',
  scrollContent: 'flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6 touch-pan-y overscroll-contain [-webkit-overflow-scrolling:touch]',

  // 未選択（データ無し）表示領域
  emptyDetailContainer:
    'w-full h-full min-h-[250px] sm:min-h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 bg-[var(--theme-container-bg)]/50 border border-[var(--theme-container-border)]/60 rounded-xl text-slate-400 text-center',
  emptyIcon: 'w-10 h-10 sm:w-12 sm:h-12 mb-2.5 sm:mb-3 text-slate-600',
  emptyText: 'text-xs sm:text-sm font-medium text-slate-400 leading-relaxed',

  // ヘッダー領域
  header: 'flex items-center justify-between border-b border-[var(--theme-container-border)] pb-3 sm:pb-4 gap-2',
  headerLeft: 'flex items-center gap-2 sm:gap-3 min-w-0 flex-1',
  headerRight: 'flex items-center gap-1.5 sm:gap-2 shrink-0',
  titleJa: 'text-lg sm:text-xl font-bold text-slate-100 truncate',
  titleEn: 'text-[10px] sm:text-xs text-slate-400 font-mono truncate',

  // 詳細パネル用固定ヘッダー
  stickyHeader:
    'flex-shrink-0 z-10 bg-[var(--theme-inner-bg)] shadow-md border-b border-[var(--theme-container-border)] p-2.5 sm:p-3 flex items-center justify-between gap-2 min-w-0',
  stickyHeaderLeft: 'flex items-center gap-2 min-w-0 flex-1',
  stickyHeaderTitleGroup: 'flex items-center gap-2 min-w-0 flex-1',
  stickyHeaderTitle: 'text-sm sm:text-base font-bold text-slate-100 truncate leading-tight',
  stickyHeaderSubTitle: 'text-[10px] sm:text-xs text-slate-400 font-mono truncate',
  stickyHeaderRight: 'flex items-center shrink-0 gap-1.5',

  // ボタン類（タッチ操作に配慮したサイズ設定）
  backButton:
    'lg:hidden flex items-center gap-1 text-xs text-[var(--theme-text-accent)] hover:brightness-125 bg-[var(--theme-inner-bg)] px-2.5 sm:px-3 py-1.5 rounded-lg border border-[var(--theme-container-border)] transition-colors min-h-[36px]',
  closeButton:
    'flex items-center justify-center p-1.5 text-slate-400 hover:text-slate-100 hover:bg-[var(--theme-active-item-bg)] rounded-lg transition-colors shrink-0 min-w-[36px] min-h-[36px]',
  iconCloseButton:
    'p-1.5 text-slate-400 hover:text-slate-100 hover:bg-[var(--theme-active-item-bg)] rounded-lg transition-colors shrink-0 min-w-[36px] min-h-[36px]',
  headerBackButton:
    'flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-[var(--theme-inner-bg)] hover:bg-[var(--theme-active-item-bg)] rounded border border-[var(--theme-container-border)] shrink-0 transition-colors min-h-[36px]',

  checkButtonBase:
    'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors min-h-[36px]',
  checkButtonChecked:
    'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80',
  checkButtonUnchecked:
    'bg-[var(--theme-inner-bg)] border-[var(--theme-container-border)] text-slate-300 hover:bg-[var(--theme-active-item-bg)]',
  checkIconChecked: 'w-4 h-4 text-emerald-400 shrink-0',
  checkIconUnchecked: 'w-4 h-4 text-slate-400 shrink-0',
  checkButtonText: 'hidden sm:inline',

  // バッジ・ハラキリレイアウト
  badgeGroup: 'flex flex-wrap items-center gap-2',
  harakiriGroup: 'space-y-2',
  harakiriItemRow: 'flex flex-wrap items-center gap-2',
  harakiriTitleRow: 'flex items-center gap-2 text-xs',
  harakiriLabel: 'text-xs text-slate-400',

  // セクション・コンテンツ
  sectionTitle:
    'text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 sm:mb-2.5 flex items-center gap-2',
  tagList: 'flex flex-wrap gap-1.5 sm:gap-2',
  tagItem:
    'bg-[var(--theme-inner-bg)] border border-[var(--theme-container-border)] text-slate-200 text-xs px-2 sm:px-2.5 py-1 rounded-md',
  tagItemInteractive:
    'hover:border-[var(--theme-accent-border)] hover:text-[var(--theme-text-accent)] transition-colors cursor-pointer',
  descriptionBox:
    'bg-[var(--theme-inner-bg)]/80 p-3 sm:p-3.5 rounded-lg border border-[var(--theme-container-border)] text-xs sm:text-sm text-slate-300 leading-relaxed',

  // 特記事項領域
  notesBlock:
    'flex items-start gap-2 bg-[var(--theme-inner-bg)]/80 p-3 sm:p-3.5 rounded-lg border border-[var(--theme-container-border)]',
  notesIcon: 'w-4 h-4 text-slate-400 shrink-0 mt-0.5',
  notesText: 'text-xs sm:text-sm text-slate-300 leading-relaxed',

  // リージョン表示情報
  regionInfo: 'flex items-center gap-2 text-xs text-slate-300 bg-[var(--theme-inner-bg)]/60 p-2 sm:p-2.5 rounded-lg border border-[var(--theme-container-border)]',
  regionLabel: 'text-slate-400 text-xs',
  regionNameJa: 'font-medium text-slate-200 text-xs sm:text-sm',
  regionNameEn: 'text-slate-500 font-mono ml-1 text-[10px] sm:text-xs',

  // 関連情報アイテム・リスト行
  relatedList: 'space-y-1.5 sm:space-y-2',
  relatedRow:
    'w-full text-left p-2.5 sm:p-3 rounded-lg bg-[var(--theme-inner-bg)] border border-[var(--theme-container-border)] flex flex-wrap items-center justify-between gap-2 min-h-[44px]',
  relatedRowInteractive: 'cursor-pointer hover:bg-[var(--theme-active-item-bg)] hover:border-[var(--theme-accent-border)] transition-colors',
  relatedRowTitleGroup: 'flex flex-col min-w-[120px] sm:min-w-[140px]',
  relatedRowTitle: 'text-xs sm:text-sm font-bold text-slate-200',
  relatedRowSubTitle: 'text-[10px] sm:text-xs text-slate-400 font-mono',
  relatedRowBadgeGroup: 'flex items-center gap-1 sm:gap-1.5 flex-wrap shrink-0',
} as const;

// 詳細表示用データテーブル構造スタイル（モバイル横スクロール・余白最適化）
export const DETAIL_TABLE_STYLES = {
  wrapper: 'border border-[var(--theme-container-border)] rounded-lg overflow-x-auto',
  table: 'w-full text-xs text-left text-slate-300 min-w-[300px]',
  thead: 'bg-[var(--theme-inner-bg)] text-slate-400 border-b border-[var(--theme-container-border)]',
  th: 'p-1.5 sm:p-2 font-medium',
  thCenter: 'p-1.5 sm:p-2 text-center w-16 sm:w-20 font-medium',
  tbody: 'divide-y divide-[var(--theme-container-border)]/50',
  tr: 'hover:bg-[var(--theme-active-item-bg)]/50 transition-colors',
  tdName: 'p-1.5 sm:p-2 font-medium text-slate-200',
  subText: 'text-slate-500 text-[10px] ml-1',
  tdCenter: 'p-1.5 sm:p-2 text-center',
  tdNotes: 'p-1.5 sm:p-2 text-slate-400 text-[11px] sm:text-xs',
} as const;