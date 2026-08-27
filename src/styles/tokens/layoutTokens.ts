/**
 * ============================================================================
 * [FilePath] src/styles/tokens/layoutTokens.ts
 * [Role]     画面全体・ヘッダー・ビュー構造（カード/リスト/詳細パネル）用レイアウトトークン
 * 
 * [概要]
 * - アプリ全体のベース構造、ヘッダー、サイドバー（追従詳細パネル）、ビューのレスポンシブレイアウト定義
 * - モーダル・ダイアログのオーバーレイおよびダイアログ枠のレスポンシブ構造定義
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レスポンシブ制約】 sticky領域（ヘッダー・サイドバー）は、ビューポートの高さおよび幅に依存するためTop値や高さ計算式を厳格に維持すること。
 * 2. 【2カラム / 1カラム切替】 leftColumnおよびcardGridは詳細表示フラグ（isSelected）に応じた動的レイアウトを行うため、ブレイクポイント指定（lg:col-span-*等）を崩さないこと。
 * 3. 【型安全性の維持】 関数型のプロパティ定義のシグネチャを変更しないこと。
 * ============================================================================
 */

export const LAYOUT_TOKENS = {
  page: {
    appWrapper: 'min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-white',
    base: 'min-h-screen bg-slate-900 text-slate-100 font-sans',
    centered: 'min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-8 sm:py-12',
    mainContainer: 'flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6',
    mainLayoutContainer: 'p-0',
  },

  header: {
    stickyWrapper: 'sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md transition-all',
    stickyFilterBar: 'sticky top-[80px] z-30 bg-slate-900/95 backdrop-blur-md pb-0 p-0 transition-all',
    container: 'bg-slate-800 text-white shadow-md border-b border-slate-700',
    inner: 'max-w-7xl mx-auto px-3 py-3 sm:px-6 sm:py-4 lg:px-8',
    iconBg: 'p-1.5 sm:p-2 bg-blue-600 rounded-lg shrink-0 flex items-center justify-center',
    collapsedMenuButton: 'bg-slate-700 border border-slate-600 text-white text-xs sm:text-sm rounded-lg px-2.5 sm:px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center gap-1.5 sm:gap-2 transition-colors shadow-sm min-h-[36px]',
    collapsedButtonText: 'max-w-[100px] sm:max-w-[120px] truncate',
    collapsedChevron: (isOpen: boolean) => `w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`,
    dropdownContainer: 'absolute right-0 mt-2 w-60 sm:w-68 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800/80 backdrop-blur-xl',
    sectionHeader: 'px-3.5 py-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-slate-950/40',
    dropdownItemActive: 'w-full text-left px-3.5 py-3 text-xs sm:text-sm flex items-center justify-between transition-all bg-cyan-950/50 text-cyan-300 font-semibold border-l-4 border-cyan-400 shadow-inner',
    dropdownItemInactive: 'w-full text-left px-3.5 py-3 text-xs sm:text-sm flex items-center justify-between transition-all text-slate-300 hover:bg-slate-800/80 hover:text-white border-l-4 border-transparent',
    dropdownActionItem: 'w-full text-left px-3.5 py-2.5 text-xs sm:text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2.5 transition-colors',
  },

  control: {
    select: 'bg-slate-700 border border-slate-600 text-white text-xs sm:text-sm rounded-lg px-2.5 sm:px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[36px]',
    button: 'p-1.5 text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 text-xs px-2.5 py-1.5 font-medium min-h-[36px]',
    devButton: 'flex items-center gap-1 bg-red-900/50 hover:bg-red-800/60 border border-red-700 text-red-200 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors min-h-[36px]',
  },

  sidebar: {
    stickyContainer: 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-10 sm:px-20 bg-black/75 backdrop-blur-sm lg:static lg:inset-auto lg:z-auto lg:col-span-5 lg:sticky lg:top-[160px] lg:max-h-[calc(100vh-180px)] lg:w-full lg:flex lg:flex-col lg:bg-slate-900 lg:border lg:border-slate-800 lg:rounded-xl lg:p-0 lg:backdrop-blur-none overflow-hidden shadow-xl',
  },

  view: {
    mainGrid: 'grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start',
    emptyContainer: 'text-center py-8 sm:py-12 px-4 bg-slate-800/30 rounded-xl border border-slate-800/80',
    emptyText: 'text-slate-400 text-xs sm:text-sm leading-relaxed',
    groupListContainer: 'flex flex-col gap-4 sm:gap-6',
    sectionGroup: 'flex flex-col gap-2',
    listContainer: 'flex flex-col gap-2',
    leftColumn: (isSelected: boolean) =>
      `${isSelected ? 'lg:col-span-7' : 'lg:col-span-12'} block`,
    cardGrid: (isSelected: boolean) =>
      `grid grid-cols-1 gap-2.5 sm:gap-3 ${isSelected
        ? 'sm:grid-cols-2 md:grid-cols-3'
        : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      }`,
  },

  modal: {
    overlay: 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150',
    contentWrapper: 'w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl shadow-2xl relative',
    closeButton: 'absolute top-3 right-3 sm:top-4 sm:right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition z-10 min-w-[32px] min-h-[32px] flex items-center justify-center',
  },
  modalShare: {
    overlay: 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150',
    contentWrapper: 'w-full max-w-2xl max-h-[85vh] my-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative',
    header: 'flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50 shrink-0',
    body: 'p-6 space-y-6 overflow-y-auto flex-1',
    footer: 'px-6 py-3 bg-slate-950/50 border-t border-slate-800 flex justify-end shrink-0',
    closeButton: 'p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors',
  },
} as const;