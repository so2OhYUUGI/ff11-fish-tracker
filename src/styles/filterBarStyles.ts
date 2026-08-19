/**
 * ============================================================================
 * [FilePath] src/styles/filterBarStyles.ts
 * [Role] FilterBarコンポーネント用共通Tailwind CSSクラス定義
 * 
 * [概要]
 * - メインナビゲーション、ステータスフィルター、プログレスバー、検索フォーム、
 *   表示切替ボタン等のスタイルを集約定義
 * ============================================================================
 */

export const FILTER_BAR_STYLES = {
	container: 'bg-slate-800 border-b border-slate-700 py-3 px-4 sm:px-6 lg:px-8',
	inner: 'max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3',

	// ナビゲーション・フィルターグループ
	leftGroup: 'flex flex-wrap items-center gap-2 w-full lg:w-auto',
	tabContainer: 'flex bg-slate-900 p-1 rounded-lg border border-slate-700',
	filterContainer: 'flex bg-slate-900 p-1 rounded-lg border border-slate-700 flex-1 sm:flex-none',

	// タブボタン類
	tabButtonBase: 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
	tabActive: 'bg-blue-600 text-white shadow',
	tabInactive: 'text-slate-400 hover:text-slate-200',

	// ステータスフィルターボタン類
	statusButtonBase: 'flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
	statusAllActive: 'bg-slate-700 text-white shadow',
	statusUncheckedActive: 'bg-amber-600 text-white shadow',
	statusCheckedActive: 'bg-emerald-600 text-white shadow',

	// プログレス表示領域
	progressGroup: 'flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:flex-1 lg:max-w-xs px-2',
	progressTextContainer: 'flex justify-between items-center text-xs font-semibold text-slate-300 whitespace-nowrap gap-2',
	progressSubText: 'text-slate-400 font-normal',
	progressBarTrack: 'w-full bg-slate-700 rounded-full h-2 overflow-hidden',
	progressBarFill: 'bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out',
	progressSpacer: 'hidden lg:block lg:flex-1',

	// 右側コントロール領域（検索 & 表示モード）
	rightGroup: 'flex items-center gap-2 w-full lg:w-auto',
	searchContainer: 'relative flex-1 sm:w-64',
	searchIcon: 'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400',
	searchInput: 'w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500',

	viewModeContainer: 'flex bg-slate-900 p-1 rounded-lg border border-slate-700 shrink-0',
	viewModeButtonBase: 'p-1.5 rounded transition-colors',
	viewModeActive: 'bg-slate-700 text-blue-400',
	viewModeInactive: 'text-slate-400 hover:text-slate-200',
} as const;