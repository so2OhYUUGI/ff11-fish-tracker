/**
 * ============================================================================
 * [FilePath] src/styles/features/FishTrackerStyle.ts
 * [Role]   魚チェッカー固有のスタイル定義（バッジ・属性・水質表現・検索バー）
 * 
 * [概要]
 * - 魚データ固有の属性（ハラキリ、恵比寿、太公望）やサイズ・水質バッジのスタイルおよび構成を集約
 * - FilterBar 内の各要素（タブ、フィルター、進捗バー、検索、表示切替）の Tailwind クラスを集約
 * - テーマ変数（var(--theme-*)）を参照した動的なモードスタイル（fish / trust）の適用に対応
 * ============================================================================
 */

import type { SizeType, WaterType } from '@/types/fishtracker';
import { COMMON_TOKENS } from '../tokens/commonTokens';

export const BADGE_BASE_STYLE =
  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border shrink-0';

export const FISH_STYLES = {
  badgeBase: BADGE_BASE_STYLE,
  badgeSkill: 'bg-slate-800/80 text-slate-300 border-slate-700/80 font-medium font-mono',
  badgeLarge: 'bg-orange-950/100 text-orange-300 border-orange-800/80',
  badgeSmall: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
  badgeSizeUnknown: 'bg-slate-800/80 text-slate-400 border-slate-700/60',
  badgeFreshwater: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
  badgeSaltwater: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
  badgeGedou: 'bg-gray-950/80 text-gray-300 border-gray-800/60',
  badgeWaterUnknown: 'bg-slate-800/80 text-slate-400 border-slate-700/60',
  badgeHarakiri: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
  badgeEbisu: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
  badgeTaikobou: 'bg-teal-950/80 text-teal-300 border-teal-800/60',
} as const;

export const FISH_SIZE_CONFIG: Record<
  SizeType,
  { label: string; shortLabel: string; style: string }
> = {
  large: { label: '大型魚', shortLabel: '大型', style: FISH_STYLES.badgeLarge },
  small: { label: '小型魚', shortLabel: '小型', style: FISH_STYLES.badgeSmall },
  unknown: { label: 'サイズ不明', shortLabel: '不明', style: FISH_STYLES.badgeSizeUnknown },
};

export const FISH_WATER_CONFIG: Record<
  WaterType,
  { label: string; style: string }
> = {
  freshwater: { label: '淡水', style: FISH_STYLES.badgeFreshwater },
  saltwater: { label: '海水', style: FISH_STYLES.badgeSaltwater },
  gedou: { label: '外道', style: FISH_STYLES.badgeGedou },
  unknown: { label: '不明', style: FISH_STYLES.badgeWaterUnknown },
};

export const FISH_FLAG_CONFIG = {
  harakiri: { label: 'ハラキリ', style: FISH_STYLES.badgeHarakiri },
  ebisu: { label: '恵比寿関連', style: FISH_STYLES.badgeEbisu },
  taikobou: { label: '太公望関連', style: FISH_STYLES.badgeTaikobou },
} as const;

export const FILTER_BAR_STYLES = {
  container: 'bg-[var(--theme-container-bg)] border-b border-[var(--theme-container-border)] py-2 sm:py-3 px-3 sm:px-6 lg:px-8 transition-colors duration-200',
  inner: 'max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2.5 sm:gap-3',

  leftGroup: 'flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 sm:pb-0 shrink-0',
  tabContainer: 'flex bg-[var(--theme-inner-bg)] p-1 rounded-lg border border-[var(--theme-container-border)] shrink-0 transition-colors duration-200',
  filterContainer: 'flex bg-[var(--theme-inner-bg)] p-1 rounded-lg border border-[var(--theme-container-border)] flex-1 sm:flex-none shrink-0 transition-colors duration-200',

  // タブボタン
  tabButtonBase: 'flex items-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-medium rounded-md transition-all duration-200 min-h-[36px] sm:min-h-0 shrink-0',
  tabActive: 'bg-[var(--theme-accent-bg)] !text-white font-semibold shadow-md',
  tabInactive: 'text-stone-400 hover:text-stone-200 hover:bg-[var(--theme-container-bg)]',
  tabIcon: 'w-3.5 h-3.5 shrink-0',

  // ステータスフィルターボタン
  statusButtonBase: 'flex-1 sm:flex-none px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-medium rounded-md transition-colors text-center min-h-[36px] sm:min-h-0 shrink-0',
  statusInactive: 'text-stone-400 hover:text-stone-200 hover:bg-[var(--theme-container-bg)]',
  statusAllActive: 'bg-[var(--theme-active-item-bg)] !text-white font-semibold shadow-md',
  statusUncheckedActive: 'bg-amber-600 !text-white font-semibold shadow-md',
  statusCheckedActive: 'bg-emerald-600 !text-white font-semibold shadow-md',

  // プログレス表示
  progressGroup: 'flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full lg:flex-1 lg:max-w-xs px-1 sm:px-2',
  progressTextContainer: 'flex justify-between items-center text-xs font-semibold text-stone-300 whitespace-nowrap gap-2',
  progressSubText: COMMON_TOKENS.text.subText,
  progressBarTrack: 'w-full bg-[var(--theme-inner-bg)] rounded-full h-2 overflow-hidden border border-[var(--theme-container-border)]',
  progressBarFill: 'bg-[var(--theme-accent-bg)] h-2 rounded-full transition-all duration-300 ease-out',
  progressSpacer: 'hidden lg:block lg:flex-1',

  // 検索入力エリア
  rightGroup: 'flex items-center gap-2 w-full lg:w-auto',
  searchContainer: 'relative flex-1 sm:w-64 min-w-[140px]',
  searchIcon: 'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none',
  searchInput: 'w-full bg-[var(--theme-inner-bg)] border border-[var(--theme-container-border)] text-white text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent-border)] placeholder-stone-500 transition-colors duration-200',
  searchInputHasValue: 'pr-8',
  searchClearButton: 'absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-stone-200 focus:outline-none',
  searchClearIcon: 'w-3.5 h-3.5 shrink-0',

  // 表示モード切り替え
  viewModeContainer: 'flex bg-[var(--theme-inner-bg)] p-1 rounded-lg border border-[var(--theme-container-border)] shrink-0 transition-colors duration-200',
  viewModeButtonBase: 'p-2 sm:p-1.5 rounded transition-colors',
  viewModeActive: 'bg-[var(--theme-active-item-bg)] !text-[var(--theme-text-accent)] shadow-md',
  viewModeInactive: 'text-stone-400 hover:text-stone-200 hover:bg-[var(--theme-container-bg)]',
  viewModeIcon: 'w-4 h-4 shrink-0',
} as const;

export const FISH_STATUS_TEXT_STYLES = {
  possible: 'text-emerald-400 font-bold',
  impossible: 'text-red-400 font-bold',
  yes: 'text-amber-400 font-bold',
  no: 'text-sky-400',
  unknown: 'text-slate-500',
} as const;