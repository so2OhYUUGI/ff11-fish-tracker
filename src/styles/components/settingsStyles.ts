/**
 * ============================================================================
 * [FilePath] src/styles/components/settingsStyles.ts
 * [Role] 設定モーダル（SettingsModal）および関連タブのスタイル定義
 * ============================================================================
 */

export const SETTINGS_STYLES = {
	overlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4',
	modal: 'bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg h-[500px] max-h-[85vh] overflow-hidden text-white flex flex-col',

	header: {
		container: 'flex items-center justify-between px-6 py-4 border-b border-slate-700 shrink-0',
		title: 'text-lg font-bold',
		closeButton: 'p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors',
	},

	tabNav: {
		container: 'flex border-b border-slate-700 bg-slate-900/40 px-6 shrink-0',
		buttonBase: 'flex items-center gap-2 py-3 px-3 text-sm font-medium border-b-2 transition-colors',
		active: 'border-blue-500 text-blue-400',
		inactive: 'border-transparent text-slate-400 hover:text-slate-200',
	},

	content: 'p-6 overflow-y-auto flex-1',

	footer: {
		container: 'px-6 py-3 bg-slate-800/50 border-t border-slate-700 text-right shrink-0',
		closeButton: 'px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg font-medium transition-colors',
	},

	characterTab: {
		container: 'space-y-4',
		header: 'flex items-center justify-between',
		title: 'text-sm font-semibold text-slate-200',
		subtitle: 'text-xs text-slate-400',
		addButton: 'text-xs flex items-center gap-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 px-2.5 py-1.5 rounded-lg font-medium transition-colors',

		addForm: 'flex gap-2 p-3 bg-slate-900/60 rounded-lg border border-slate-700',
		addInput: 'flex-1 px-3 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500',
		submitButton: 'px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded font-medium transition-colors',
		cancelButton: 'px-2 py-1.5 text-xs text-slate-400 hover:text-white',

		listContainer: 'space-y-2 max-h-64 overflow-y-auto pr-1',
		itemBase: 'flex items-center justify-between p-3 rounded-lg border transition-colors',
		itemActive: 'bg-blue-950/40 border-blue-600/60',
		itemInactive: 'bg-slate-900/40 border-slate-700/60 hover:border-slate-600',

		editWrapper: 'flex items-center gap-2 flex-1 mr-2',
		editInput: 'flex-1 px-2 py-1 text-sm bg-slate-800 border border-blue-500 rounded text-white focus:outline-none',
		saveIconButton: 'p-1 text-emerald-400 hover:bg-slate-800 rounded',
		cancelIconButton: 'p-1 text-slate-400 hover:bg-slate-800 rounded',

		charInfoWrapper: 'flex items-center gap-2.5 min-w-0 flex-1',
		iconActive: 'text-blue-400',
		iconInactive: 'text-slate-400',
		nameButtonBase: 'text-sm font-medium truncate text-left hover:underline',
		nameButtonActive: 'text-blue-300',
		nameButtonInactive: 'text-slate-200',
		activeBadge: 'shrink-0 text-[10px] px-2 py-0.5 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-full font-medium',

		actionWrapper: 'flex items-center gap-1 shrink-0 ml-2',
		editActionButton: 'p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors',
		deleteActionButton: 'p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition-colors',
	},

	dataTab: {
		container: 'space-y-6',
		section: 'space-y-2',
		title: 'text-sm font-semibold text-slate-200',
		description: 'text-xs text-slate-400',
		divider: 'border-slate-700/60',

		// ステータスメッセージ
		statusMessageBase: 'p-3 rounded-lg text-sm flex items-center gap-2',
		statusSuccess: 'bg-emerald-950/80 border border-emerald-600 text-emerald-200',
		statusError: 'bg-rose-950/80 border border-rose-600 text-rose-200',

		// アクションボタン
		exportButton: 'w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors',
		importButton: 'w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors',
	},
} as const;