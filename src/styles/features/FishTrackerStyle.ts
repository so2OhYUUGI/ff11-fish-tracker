/**
 * ============================================================================
 * [FilePath] src/styles/feature/FishTrackerStyle.ts
 * [Role]   魚チェッカー固有のスタイル定義（バッジ・属性・水質表現・検索バー）
 * 
 * [概要]
 * - 魚データ固有の属性（ハラキリ、恵比寿、太公望）やサイズ・水質バッジのスタイルおよび構成を集約
 * - FilterBar 内の各要素（タブ、フィルター、進捗バー、検索、表示切替）の Tailwind クラスを集約
 * ============================================================================
 */

import type { SizeType, WaterType } from '@/types/fish';
import { COMMON_TOKENS } from '../tokens/commonTokens';

// バッジ共通ベーススタイル
export const BADGE_BASE_STYLE =
	'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border shrink-0';

// スタイル定数の集約定義
export const FISH_STYLES = {
	// バッジ汎用ベース（BADGE_BASE_STYLE に一本化して互換性を維持）
	badgeBase: BADGE_BASE_STYLE,

	// スキル上限バッジ
	badgeSkill: 'bg-slate-800/80 text-slate-300 border-slate-700/80 font-medium font-mono',

	// サイズ区分バッジ
	badgeLarge: 'bg-orange-950/100 text-orange-300 border-orange-800/80',
	badgeSmall: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
	badgeSizeUnknown: 'bg-slate-800/80 text-slate-400 border-slate-700/60',

	// 水質・区分バッジ
	badgeFreshwater: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
	badgeSaltwater: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
	badgeGedou: 'bg-gray-950/80 text-gray-300 border-gray-800/60',
	badgeWaterUnknown: 'bg-slate-800/80 text-slate-400 border-slate-700/60',

	// 魚固有の特殊属性バッジ
	badgeHarakiri: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
	badgeEbisu: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
	badgeTaikobou: 'bg-teal-950/80 text-teal-300 border-teal-800/60',
} as const;

// サイズ表記の統一ラベル＆スタイル設定
export const FISH_SIZE_CONFIG: Record<
	SizeType,
	{ label: string; shortLabel: string; style: string }
> = {
	large: { label: '大型魚', shortLabel: '大型', style: FISH_STYLES.badgeLarge },
	small: { label: '小型魚', shortLabel: '小型', style: FISH_STYLES.badgeSmall },
	unknown: { label: 'サイズ不明', shortLabel: '不明', style: FISH_STYLES.badgeSizeUnknown },
};

// 水質表記の統一ラベル＆スタイル設定
export const FISH_WATER_CONFIG: Record<
	WaterType,
	{ label: string; style: string }
> = {
	freshwater: { label: '淡水', style: FISH_STYLES.badgeFreshwater },
	saltwater: { label: '海水', style: FISH_STYLES.badgeSaltwater },
	gedou: { label: '外道', style: FISH_STYLES.badgeGedou },
	unknown: { label: '不明', style: FISH_STYLES.badgeWaterUnknown },
};

// 特殊フラグバッジの統一ラベル＆スタイル設定
export const FISH_FLAG_CONFIG = {
	harakiri: { label: 'ハラキリ', style: FISH_STYLES.badgeHarakiri },
	ebisu: { label: '恵比寿関連', style: FISH_STYLES.badgeEbisu },
	taikobou: { label: '太公望関連', style: FISH_STYLES.badgeTaikobou },
} as const;



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
	tabIcon: 'w-3.5 h-3.5 shrink-0',

	// ステータスフィルターボタン類
	statusButtonBase: 'flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
	statusAllActive: 'bg-slate-700 text-white shadow',
	statusUncheckedActive: 'bg-amber-600 text-white shadow',
	statusCheckedActive: 'bg-emerald-600 text-white shadow',

	// プログレス表示領域
	progressGroup: 'flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:flex-1 lg:max-w-xs px-2',
	progressTextContainer: 'flex justify-between items-center text-xs font-semibold text-slate-300 whitespace-nowrap gap-2',
	progressSubText: COMMON_TOKENS.text.subText,
	progressBarTrack: 'w-full bg-slate-700 rounded-full h-2 overflow-hidden',
	progressBarFill: 'bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out',
	progressSpacer: 'hidden lg:block lg:flex-1',

	// 右側コントロール領域（検索 & 表示モード）
	rightGroup: 'flex items-center gap-2 w-full lg:w-auto',
	searchContainer: 'relative flex-1 sm:w-64',
	searchIcon: 'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400',
	searchInput: 'w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500',
	searchInputHasValue: 'pr-8',
	searchClearButton:
		'absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none',
	searchClearIcon: 'w-3.5 h-3.5 shrink-0',

	viewModeContainer: 'flex bg-slate-900 p-1 rounded-lg border border-slate-700 shrink-0',
	viewModeButtonBase: 'p-1.5 rounded transition-colors',
	viewModeActive: 'bg-slate-700 text-blue-400',
	viewModeInactive: 'text-slate-400 hover:text-slate-200',
	viewModeIcon: 'w-4 h-4 shrink-0',
} as const;

// 判定・ステータス用スタイル定義（テーブル等のセル内表示用）
export const FISH_STATUS_TEXT_STYLES = {
	// 肯定・成功（可能）
	possible: 'text-emerald-400 font-bold',
	// 否定・不可（不可）
	impossible: 'text-red-400 font-bold',
	// 警告・注意（あり）
	yes: 'text-amber-400 font-bold',
	// 安全・正常（なし）
	no: 'text-sky-400',
	// 未確認・未知（不明）
	unknown: 'text-slate-500',
} as const;