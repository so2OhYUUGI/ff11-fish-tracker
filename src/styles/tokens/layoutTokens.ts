/**
 * ============================================================================
 * [FilePath] src/styles/tokens/layoutTokens.ts
 * [Role]     画面全体・ヘッダー・フッター・ビュー構造（カード/リスト/詳細パネル）用レイアウトトークン
 * ============================================================================
 */

// 共通ベーススタイルの抽出
const BASE_PAGE = 'min-h-screen bg-slate-900 text-slate-100 font-sans';
const BASE_MODAL_OVERLAY = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150';
const BASE_DROPDOWN_ITEM = 'w-full text-left px-3.5 py-2.5 text-xs sm:text-sm flex items-center transition-all';
const BASE_CLOSE_BUTTON = 'rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition';

export const LAYOUT_TOKENS = {
  page: {
    appWrapper: `${BASE_PAGE} flex flex-col selection:bg-blue-500/30 selection:text-white`,
    base: BASE_PAGE,
    centered: `${BASE_PAGE} flex flex-col justify-center items-center px-4 py-8 sm:py-12`,
    fullScreenCentered: `${BASE_PAGE} flex flex-col justify-center items-center min-h-screen w-full py-12 px-4 overflow-y-auto`,
    mainContainer: 'flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6',
    mainLayoutContainer: 'p-0',
  },

  header: {
    stickyWrapper: 'sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md transition-all',
    stickyFilterBar: 'sticky top-[80px] z-30 bg-slate-900/95 backdrop-blur-md pb-0 p-0 transition-all',
    container: 'bg-slate-800 text-white shadow-md border-b border-slate-700',
    inner: 'max-w-7xl mx-auto px-3 py-3 sm:px-6 sm:py-4 lg:px-8',
    rowWrapper: 'flex items-center justify-between gap-4',
    titleWrapper: 'flex items-center gap-3',
    titleText: 'text-xl font-bold tracking-tight',
    iconBg: 'p-1.5 sm:p-2 bg-blue-600 rounded-lg shrink-0 flex items-center justify-center',

    // パターンA (デスクトップ)
    desktopNav: 'hidden sm:flex flex-wrap items-center gap-3',
    selectGroup: 'flex items-center gap-2',
    selectOption: 'bg-slate-900 text-slate-100',

    // パターンB (モバイル)
    mobileNav: 'relative flex sm:hidden',
    collapsedMenuButton: (isShared?: boolean) =>
      `bg-slate-700 border text-white text-xs sm:text-sm rounded-lg px-2.5 sm:px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center gap-1.5 sm:gap-2 transition-all shadow-sm min-h-[36px] ${isShared
        ? 'border-amber-400 bg-amber-950/60 text-amber-300 font-semibold ring-2 ring-amber-500/50'
        : 'border-slate-600'
      }`,
    collapsedButtonText: 'max-w-[100px] sm:max-w-[120px] truncate',
    collapsedChevron: (isOpen: boolean) => `w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`,

    // ドロップダウン要素
    dropdownContainer: 'absolute right-0 mt-2 w-60 sm:w-68 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl',
    dropdownSection: 'py-1',
    dropdownDividerSection: 'py-1 border-t border-slate-800',
    dropdownShareButtonWrapper: 'px-3 py-1.5',
    sectionHeader: 'px-3.5 py-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-slate-950/40',
    dropdownItemActive: (isShared?: boolean) =>
      `${BASE_DROPDOWN_ITEM} py-3 justify-between font-semibold border-l-4 shadow-inner ${isShared
        ? 'bg-amber-950/60 text-amber-300 border-amber-400'
        : 'bg-blue-950/50 text-blue-300 border-blue-400'
      }`,
    dropdownItemInactive: `${BASE_DROPDOWN_ITEM} py-3 justify-between text-slate-300 hover:bg-slate-800/80 hover:text-white border-l-4 border-transparent`,
    dropdownItemContent: 'flex items-center gap-1.5 truncate',
    dropdownActionItem: `${BASE_DROPDOWN_ITEM} text-slate-300 hover:bg-slate-800/80 hover:text-white gap-2.5`,
    sharedBadge: 'text-[10px] px-1.5 py-0.5 bg-amber-950 text-amber-400 border border-amber-500/80 rounded font-medium',

    // 汎用アイコン定義
    icon: {
      sm: 'w-3.5 h-3.5 shrink-0',
      md: 'w-4 h-4 shrink-0',
      lg: 'w-6 h-6 shrink-0',
      muted: 'text-slate-400',
      shared: 'text-amber-400',
      dev: 'text-red-400',
      active: (isShared?: boolean) => (isShared ? 'text-amber-400' : 'text-blue-400'),
    },
  },

  footer: {
    container: 'bg-slate-900 border-t border-slate-800 mt-auto py-6',
    rowWrapper: 'flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left',
    titleGroup: 'flex items-center justify-center sm:justify-start gap-2 mb-1',
    badge: 'text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono',
    copyright: 'whitespace-nowrap',
  },
  
  control: {
    select: (isShared?: boolean) =>
      `text-white text-xs sm:text-sm rounded-lg px-2.5 sm:px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[36px] transition-all ${isShared
        ? 'bg-amber-950/60 border-2 border-amber-400 text-amber-300 font-semibold ring-2 ring-amber-500/40'
        : 'bg-slate-700 border border-slate-600'
      }`,
    button: 'text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 text-xs px-2.5 py-1.5 font-medium min-h-[36px]',
    devButton: 'flex items-center gap-1 bg-red-900/50 hover:bg-red-800/60 border border-red-700 text-red-200 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors min-h-[36px]',
  },

  sidebar: {
    stickyContainer: 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-10 sm:px-20 bg-black/75 backdrop-blur-sm lg:static lg:inset-auto lg:z-auto lg:col-span-5 lg:sticky lg:top-[160px] lg:max-h-[calc(100vh-180px)] lg:w-full lg:flex lg:flex-col lg:bg-slate-900 lg:border lg:border-slate-800 lg:rounded-xl lg:p-0 lg:backdrop-blur-none overflow-hidden shadow-xl',
  },

  view: {
    mainGrid: 'grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start',
    emptyContainer: 'text-center py-8 sm:py-12 px-4 bg-slate-800/30 rounded-xl border border-slate-800/80',
    emptyText: 'text-slate-400 text-xs sm:text-sm leading-relaxed',
    flexColGap2: 'flex flex-col gap-2',
    flexColGap6: 'flex flex-col gap-4 sm:gap-6',
    leftColumn: (isSelected: boolean) => `${isSelected ? 'lg:col-span-7' : 'lg:col-span-12'} block`,
    cardGrid: (isSelected: boolean) =>
      `grid grid-cols-1 gap-2.5 sm:gap-3 ${isSelected
        ? 'sm:grid-cols-2 md:grid-cols-3'
        : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      }`,
  },

  modal: {
    overlay: BASE_MODAL_OVERLAY,
    contentWrapper: 'w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl shadow-2xl relative',
    closeButton: `absolute top-3 right-3 sm:top-4 sm:right-4 p-1 ${BASE_CLOSE_BUTTON} z-10 min-w-[32px] min-h-[32px] flex items-center justify-center`,
  },
  modalShare: {
    overlay: `${BASE_MODAL_OVERLAY} overflow-y-auto`,
    contentWrapper: 'w-full max-w-2xl max-h-[85vh] my-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative',
    header: 'flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50 shrink-0',
    body: 'p-6 space-y-6 overflow-y-auto flex-1',
    footer: 'px-6 py-3 bg-slate-950/50 border-t border-slate-800 flex justify-end shrink-0',
    closeButton: `p-1.5 ${BASE_CLOSE_BUTTON}`,
  },
} as const;