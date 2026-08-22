/**
 * ============================================================================
 * [FilePath] src/styles/tokens/layoutTokens.ts
 * [Role] 画面全体・ヘッダー・ビュー構造（カード/リスト/詳細パネル）用レイアウトトークン
 * ============================================================================
 */

export const LAYOUT_TOKENS = {
	// アプリ・ページ全体のベースレイアウト
	page: {
		appWrapper: 'min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans',
		base: 'min-h-screen bg-slate-900 text-slate-100 font-sans',
		centered: 'min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-12',
		mainContainer: 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6',
	},

	// ヘッダー領域
	header: {
		stickyWrapper: 'sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md',
		container: 'bg-slate-800 text-white shadow-md border-b border-slate-700',
		inner: 'max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8',
		iconBg: 'p-2 bg-blue-600 rounded-lg',
		// 収束ボタン（select や control.button と高さを完全一致させる）
		collapsedMenuButton: 'bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center gap-2 transition-colors shadow-sm',
		collapsedButtonText: 'max-w-[120px] truncate',
		collapsedChevron: (isOpen: boolean) => `w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`,
		dropdownContainer: 'absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 divide-y divide-slate-800',
		sectionHeader: 'px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase',
		dropdownItemActive: 'w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors bg-blue-600/20 text-blue-300 font-medium',
		dropdownItemInactive: 'w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors text-slate-300 hover:bg-slate-800 hover:text-white',
		dropdownActionItem: 'w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors',
	},

	// コントロール要素
	control: {
		select: 'bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none',
		button: 'p-1.5 text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 text-xs px-2.5 py-1.5 font-medium',
		devButton: 'flex items-center gap-1 bg-red-900/50 hover:bg-red-800/60 border border-red-700 text-red-200 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors',
	},

	// 追従型の詳細表示パネル（サイドバー）
	sidebar: {
		stickyContainer: 'lg:col-span-5 lg:sticky lg:top-[160px] w-full max-h-[calc(100vh-180px)] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl',
	},

	// ビュー・一覧・グリッド構造
	view: {
		mainGrid: 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start',
		emptyContainer: 'text-center py-12 bg-slate-800/30 rounded-xl border border-slate-800',
		emptyText: 'text-slate-400 text-sm',
		groupListContainer: 'flex flex-col gap-6',
		sectionGroup: 'flex flex-col gap-2',
		listContainer: 'flex flex-col gap-2',
		leftColumn: (isSelected: boolean) =>
			`${isSelected ? 'lg:col-span-7' : 'lg:col-span-12'} ${isSelected ? 'hidden lg:block' : 'block'}`,
		cardGrid: (isSelected: boolean) =>
			`grid grid-cols-1 gap-3 ${isSelected
				? 'sm:grid-cols-2 md:grid-cols-3'
				: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
			}`,
	},
} as const;