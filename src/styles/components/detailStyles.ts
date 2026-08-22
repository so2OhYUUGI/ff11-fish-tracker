/**
 * ============================================================================
 * [FilePath] src/styles/components/detailStyles.ts
 * [Role] 詳細表示（モーダル / 詳細パネル）用の共通スタイル定義定数（Tailwind CSS クラス）
 * ============================================================================
 */

export const DETAIL_STYLES = {
  // コンテナ
  container:
    'bg-slate-800 border border-slate-700 rounded-xl p-5 md:p-6 flex flex-col gap-6 h-full relative',
  panelBase: 'flex flex-col h-full min-h-0 overflow-hidden',
  scrollContent: 'flex-1 min-h-0 overflow-y-auto p-4 space-y-6',

  // 未選択（データ無し）表示領域
  emptyDetailContainer:
    'h-full min-h-[300px] flex flex-col items-center justify-center p-8 bg-slate-800/50 border border-slate-700/60 rounded-xl text-slate-400',
  emptyIcon: 'w-12 h-12 mb-3 text-slate-600',
  emptyText: 'text-sm font-medium text-slate-400',

  // ヘッダー領域
  header: 'flex items-center justify-between border-b border-slate-700 pb-4',
  headerLeft: 'flex items-center gap-3',
  headerRight: 'flex items-center gap-2',
  titleJa: 'text-xl font-bold text-slate-100',
  titleEn: 'text-xs text-slate-400 font-mono',

  // 詳細パネル用固定ヘッダー
  stickyHeader:
    'flex-shrink-0 z-10 bg-slate-900 shadow-md border-b border-slate-800 p-3 flex items-center justify-between gap-2 min-w-0',
  stickyHeaderLeft: 'flex items-center gap-2 min-w-0 flex-1',
  stickyHeaderTitleGroup: 'flex items-center gap-2 min-w-0 flex-1',
  stickyHeaderTitle: 'text-base font-bold text-slate-100 truncate leading-tight',
  stickyHeaderSubTitle: 'text-xs text-slate-400 font-mono truncate',
  stickyHeaderRight: 'flex items-center shrink-0',

  // ボタン類
  backButton:
    'lg:hidden flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 bg-slate-700/60 px-3 py-1.5 rounded-lg border border-slate-600 transition-colors',
  closeButton:
    'flex items-center justify-center p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors shrink-0',
  iconCloseButton:
    'p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors shrink-0',
  headerBackButton:
    'flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 shrink-0 transition-colors',

  checkButtonBase:
    'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors',
  checkButtonChecked:
    'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80',
  checkButtonUnchecked:
    'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700',

  // セクション・コンテンツ
  sectionTitle:
    'text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2',
  tagList: 'flex flex-wrap gap-2',
  tagItem:
    'bg-slate-900/80 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-md',
  tagItemInteractive:
    'hover:border-cyan-500 hover:text-cyan-300 transition-colors cursor-pointer',
  descriptionBox:
    'bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/50 text-sm text-slate-300 leading-relaxed',

  // 特記事項領域
  notesBlock:
    'flex items-start gap-2 bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/50',
  notesIcon: 'w-4 h-4 text-slate-400 shrink-0 mt-0.5',
  notesText: 'text-sm text-slate-300 leading-relaxed',

  // リージョン表示情報
  regionInfo: 'flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50',
  regionLabel: 'text-slate-400',
  regionNameJa: 'font-medium text-slate-200',
  regionNameEn: 'text-slate-500 font-mono ml-1',

  // 関連情報アイテム・リスト行
  relatedList: 'space-y-2',
  relatedRow:
    'w-full text-left p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 flex flex-wrap items-center justify-between gap-2',
  relatedRowInteractive: 'cursor-pointer hover:bg-slate-800 transition-colors',
  relatedRowTitleGroup: 'flex flex-col min-w-[140px]',
  relatedRowTitle: 'text-sm font-bold text-slate-200',
  relatedRowSubTitle: 'text-xs text-slate-400 font-mono',
  relatedRowBadgeGroup: 'flex items-center gap-1.5 flex-wrap shrink-0',
} as const;

// 詳細表示用データテーブル構造スタイル
export const DETAIL_TABLE_STYLES = {
  wrapper: 'border border-slate-700 rounded-lg overflow-hidden',
  table: 'w-full text-xs text-left text-slate-300',
  thead: 'bg-slate-800 text-slate-400 border-b border-slate-700',
  th: 'p-2',
  thCenter: 'p-2 text-center w-20',
  tbody: 'divide-y divide-slate-700/50',
  tr: 'hover:bg-slate-800/40',
  tdName: 'p-2 font-medium text-slate-200',
  subText: 'text-slate-500 text-[10px] ml-1',
  tdCenter: 'p-2 text-center',
  tdNotes: 'p-2 text-slate-400',
} as const;