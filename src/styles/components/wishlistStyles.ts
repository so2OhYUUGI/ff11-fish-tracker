/**
 * ============================================================================
 * [FilePath] src/styles/components/wishlistStyles.ts
 * [Role]     ウィッシュリスト（Wishlist）機能専用のレイアウト・コンポーネントスタイル定義
 * 
 * [概要]
 * - ウィッシュリスト（Wishlist）閲覧・全キャラ一括修得管理ビュー用のスタイル定義
 * - モードテーマ（data-theme="trust" / "fish"）のCSS変数に連動
 * - 既存の LIST_STYLES, DETAIL_STYLES と整合性を維持しつつ冗長な宣言を統一
 * ============================================================================
 */

export const WISHLIST_STYLES = {
	// ヘッダーカード
	headerCard:
		'bg-[var(--theme-container-bg)] border border-[var(--theme-container-border)] rounded-xl p-4 md:p-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md backdrop-blur-sm',
	headerTitleGroup: 'flex items-center gap-3',
	headerTitle: 'text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2.5',
	headerSubTitle: 'text-xs font-normal text-slate-400',
	headerIconWrapper:
		'p-2 rounded-lg bg-[var(--theme-inner-bg)] border border-[var(--theme-container-border)] text-[var(--theme-text-accent)]',

	// アクションボタン群
	actionsGroup: 'flex items-center gap-2',
	addButton:
		'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--theme-text-accent)] bg-[var(--theme-inner-bg)] hover:bg-[var(--theme-active-item-bg)] border border-[var(--theme-accent-border)] transition-all shadow-sm',
	actionButton:
		'p-2 rounded-lg text-slate-300 hover:text-slate-100 bg-[var(--theme-inner-bg)] hover:bg-[var(--theme-active-item-bg)] border border-[var(--theme-container-border)] transition-colors',
	deleteIconButton:
		'p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/50 transition-colors',

	// テーブルコンテナ・レイアウト
	tableCard:
		'bg-[var(--theme-container-bg)] border border-[var(--theme-container-border)] rounded-xl overflow-hidden shadow-md backdrop-blur-sm',
	tableWrapper: 'overflow-x-auto',
	table: 'w-full text-left border-collapse min-w-[600px]',
	thead:
		'border-b border-[var(--theme-container-border)] bg-[var(--theme-inner-bg)] text-xs font-semibold text-slate-400',
	thTrust: 'p-3 min-w-[260px]',
	thChar: 'p-3 text-center w-28 min-w-[112px]',
	thAction: 'p-3 text-center w-12 min-w-[48px]',
	tbody: 'divide-y divide-[var(--theme-container-border)]/60 text-sm',

	// 行ステート
	trNormal: 'hover:bg-[var(--theme-active-item-bg)] transition-colors',
	trCompleted: 'bg-emerald-950/20 hover:bg-emerald-950/30 transition-colors',

	// セル構成要素
	trustCellContainer: 'p-3',
	trustCellWrapper: 'flex items-center gap-2.5',
	badgeWrapper: 'w-[5.25rem] shrink-0 flex justify-center',
	trustInfoGroup: 'min-w-0 flex-1',
	trustTitle: 'font-bold text-slate-100 truncate flex items-center gap-1.5',
	trustCompletedIcon: 'w-4 h-4 text-emerald-400 shrink-0',
	acquireInfo: 'text-xs text-slate-400 truncate max-w-xs',
	acquireLabel: 'text-slate-500 mr-1',
	charHeaderContainer: 'flex items-center justify-center gap-1.5 truncate',
	charHeaderIcon: 'w-3.5 h-3.5 text-slate-500 shrink-0',
	centerCell: 'p-3 text-center',
	removeButton: 'text-slate-500 hover:text-rose-400 transition-colors p-1',

	// トグルボタン
	checkButtonChecked:
		'inline-flex items-center justify-center p-1.5 rounded-lg border transition-all bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
	checkButtonUnchecked:
		'inline-flex items-center justify-center p-1.5 rounded-lg border transition-all bg-[var(--theme-inner-bg)] text-slate-500 border-[var(--theme-container-border)] hover:text-slate-300 hover:bg-[var(--theme-active-item-bg)]',

	// モーダル関連（既存DETAIL_STYLESやLIST_STYLESとの共通部分を活用）
	modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm',
	modalCard:
		'bg-[var(--theme-container-bg)] border border-[var(--theme-container-border)] rounded-xl p-5 w-full max-w-md shadow-2xl',
	modalTitle: 'text-base font-bold text-slate-100 mb-3 flex items-center gap-2',
	modalActionsGroup: 'flex justify-end gap-2 mt-4',
	modalCancelBtn:
		'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-[var(--theme-active-item-bg)] transition-colors',
	modalSaveBtn:
		'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 shadow-sm transition-colors',
	createBtn:
		'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 shadow-sm mt-3 transition-colors',

	// コピーモーダル専用スタイル
	copyModalContent: 'space-y-4 my-4',
	copyFlowCard:
		'flex flex-col gap-3 p-3 bg-[var(--theme-inner-bg)] border border-[var(--theme-container-border)] rounded-lg text-xs',
	copyFlowLabel: 'text-slate-400 block mb-0.5',
	copyFlowLabelBold: 'text-slate-400 block mb-1 font-semibold',
	copyFlowValue: 'font-bold text-slate-100',
	copyArrowWrapper: 'flex justify-center text-slate-500',
	copyArrowIcon: 'w-4 h-4 rotate-90 sm:rotate-0',
	copyWarningText: 'text-xs text-amber-400/90 bg-amber-500/10 p-2.5 rounded border border-amber-500/20',
} as const;