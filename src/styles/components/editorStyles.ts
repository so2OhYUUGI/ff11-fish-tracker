/**
 * ============================================================================
 * [FilePath] src/styles/components/editorStyles.ts
 * [Role] 開発者向けマスターデータエディタ用スタイル定義定数（Tailwind CSS クラス）
 * ============================================================================
 */

export const EDITOR_STYLES = {
	// モーダル背景オーバーレイ
	overlay:
		'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4',

	// モーダル本体コンテナ
	modalContainer:
		'bg-slate-800 rounded-xl border border-slate-700 max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden',

	// ヘッダー領域
	header:
		'p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center flex-shrink-0',
	headerTitle: 'font-bold text-red-400 flex items-center gap-2 text-base',
	closeButton:
		'p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 text-xs',

	// エディタコンテンツ領域（ライト背景領域）
	contentContainer: 'p-4 flex-1 min-h-0 bg-slate-100 text-slate-900',

	// --------------------------------------------------------------------------
	// MasterDataEditor 内のレイアウト・ツールバー・ボタン定義
	// --------------------------------------------------------------------------
	wrapper: 'flex flex-col h-full gap-2.5',
	toolbar: 'flex justify-between items-center shrink-0 gap-2 flex-wrap',
	tabGroup: 'flex gap-1',

	// タブ切替ボタン
	tabButtonBase:
		'px-3 py-1.5 rounded text-xs font-bold transition-colors border-0 cursor-pointer',
	tabButtonActive: 'bg-blue-700 text-white shadow-sm',
	tabButtonInactive: 'bg-slate-200 text-slate-800 hover:bg-slate-300',

	// アクション操作ボタン群
	actionGroup: 'flex items-center gap-2',
	btnBase: 'px-3 py-1.5 rounded text-xs font-bold text-white transition-colors cursor-pointer border-0 shadow-sm',
	btnReset: 'bg-orange-600 hover:bg-orange-500',
	btnSave: 'bg-red-700 hover:bg-red-600',
	btnExport: 'bg-slate-600 hover:bg-slate-500 font-normal',

	// 各編集タブコンテンツ表示領域
	tabPanel: 'flex gap-4 flex-1 min-h-0 overflow-hidden',

	// --------------------------------------------------------------------------
	// RelationEditor（リレーション編集）用スタイル定義
	// --------------------------------------------------------------------------
	relation: {
		container: 'flex flex-col gap-1.5',
		header: 'flex justify-between items-center',
		title: 'font-bold text-xs text-slate-800',
		controls: 'flex items-center gap-2',
		filterGroup: 'flex gap-0.5',
		filterBtnBase: 'px-1.5 py-0.5 text-[10px] rounded border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
		filterBtnActive: 'border-blue-500 bg-blue-50 text-blue-700 font-bold',
		filterBtnInactive: 'border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 font-normal',
		searchInput: 'px-1.5 py-0.5 text-xs w-[140px] border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500',
		listContainer: 'h-[160px] overflow-y-auto border border-slate-300 p-2 bg-slate-50/80 grid grid-cols-2 gap-x-2.5 gap-y-1 rounded',
		itemLabel: 'text-xs flex items-center gap-1 cursor-pointer select-none text-slate-800 hover:text-blue-700',
		unsetLabel: 'text-xs flex items-center gap-1 cursor-pointer select-none text-slate-400 col-span-2 hover:text-slate-600',
		emptyText: 'col-span-2 p-3 text-center text-slate-400 text-xs',
	},

	// --------------------------------------------------------------------------
	// BaitReorderTab（餌並び順編集）用スタイル定義
	// --------------------------------------------------------------------------
	baitReorder: {
		container: 'p-2.5 w-full overflow-y-auto bg-slate-50 rounded',
		title: 'mb-2.5 text-sm font-bold text-slate-800',
		list: 'flex flex-col gap-1.5',
		itemBase: 'px-3 py-2.5 border rounded flex items-center justify-between cursor-grab select-none transition-colors',
		itemDragging: 'bg-slate-200 border-slate-400 shadow-md',
		itemNormal: 'bg-white border-slate-300 hover:border-slate-400',
		itemMetaGroup: 'flex items-center gap-3',
		itemIndex: 'text-slate-400 text-xs w-7 font-bold',
		itemName: 'font-bold text-sm text-slate-800',
		itemId: 'text-xs text-slate-400',
		dragHint: 'text-slate-400 text-xs',
	},

	// --------------------------------------------------------------------------
	// FishEditTab（魚編集）用スタイル定義
	// --------------------------------------------------------------------------
	fishEdit: {
		container: 'flex gap-3.5 h-full w-full',

		// 左パネル (魚一覧)
		sidebar: 'w-64 flex flex-col border border-slate-300 bg-white shrink-0 rounded',
		searchHeader: 'p-2 border-b border-slate-300 bg-slate-50',
		searchInput: 'w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500',
		listContainer: 'flex-1 overflow-y-auto',
		listItemBase: 'p-2 cursor-pointer text-xs border-b border-slate-100 flex items-center justify-between transition-colors',
		listItemActive: 'bg-slate-200 font-medium',
		listItemInactive: 'bg-transparent hover:bg-slate-50',
		badgeBase: 'text-[11px] px-1.5 py-0.5 rounded-full',
		badgeActive: 'text-blue-700 bg-blue-50 font-bold',
		badgeInactive: 'text-slate-400 bg-slate-100 font-normal',
		emptyList: 'p-3 text-center text-slate-400 text-xs',

		// 右パネル (編集フォーム)
		formPanel: 'flex-1 bg-white p-3.5 border border-slate-300 rounded overflow-y-auto',
		emptyFormText: 'text-slate-500 text-xs m-0',
		formGrid: 'grid gap-3.5 text-xs',
		title: 'font-bold text-sm text-slate-800 m-0',
		basicFieldsRow: 'grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px] gap-2.5',
		inputField: 'w-full p-1 mt-0.5 border border-slate-300 rounded text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500',

		// セグメントコントロール (サイズ・水質)
		segmentGroup: 'flex flex-col gap-2.5',
		segmentLabel: 'font-bold mb-1 text-slate-600 text-xs',
		segmentButtonsRow: 'flex gap-1.5',
		segmentBtnBase: 'w-20 py-1 text-[11px] rounded cursor-pointer text-center border transition-all',
		segmentBtnActive: 'border-blue-500 bg-blue-50 text-blue-700 font-bold',
		segmentBtnInactive: 'border-slate-300 bg-slate-50 text-slate-600 font-normal hover:bg-slate-100',

		// 竿テーブル
		rodSectionTitle: 'font-bold mb-1.5 text-slate-800',
		rodTable: 'w-full border-collapse text-xs',
		rodThName: 'p-1.5 text-left bg-slate-50 border-b-2 border-slate-200 font-bold text-slate-700',
		rodThStatus: 'p-1.5 text-center w-20 bg-slate-50 border-b-2 border-slate-200 font-bold text-slate-700',
		rodThNotes: 'p-1.5 text-left bg-slate-50 border-b-2 border-slate-200 font-bold text-slate-700',
		rodTd: 'p-1.5 border-b border-slate-100',
		rodTdCenter: 'p-1.5 border-b border-slate-100 text-center',
		rodSubText: 'text-slate-400 text-[10px]',
		rodStatusBtnBase: 'px-2 py-0.5 text-[11px] rounded cursor-pointer font-bold border min-w-[60px] transition-colors',
		rodNotesInput: 'w-full px-1.5 py-0.5 text-[11px] border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500',

		// ハラキリ領域
		harakiriContainer: 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2.5 border border-slate-200 rounded-md bg-slate-50',
		textareaField: 'w-full h-12 p-1 mt-0.5 border border-slate-300 rounded text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500',
	},
} as const;