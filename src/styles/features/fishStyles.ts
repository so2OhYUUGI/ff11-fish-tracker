/**
 * ============================================================================
 * [FilePath] src/styles/features/fishStyles.ts
 * [Role] 魚チェッカー固有のスタイル定義（バッジ・属性・水質表現）
 * 
 * [概要]
 * - 魚データ固有の属性（ハラキリ、恵比寿、太公望）やサイズ・水質バッジのスタイルおよび構成を集約
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
	badgeLarge: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
	badgeSmall: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
	badgeSizeUnknown: 'bg-slate-800/80 text-slate-400 border-slate-700/60',

	// 水質・区分バッジ
	badgeFreshwater: COMMON_TOKENS.entity.area.badge,
	badgeSaltwater: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
	badgeGedou: COMMON_TOKENS.entity.bait.badge,
	badgeWaterUnknown: 'bg-slate-800/80 text-slate-400 border-slate-700/60',

	// 魚固有の特殊属性バッジ
	badgeHarakiri: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
	badgeEbisu: COMMON_TOKENS.entity.bait.badge,
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
	unknown: { label: '区分不明', style: FISH_STYLES.badgeWaterUnknown },
};

// 特殊フラグバッジの統一ラベル＆スタイル設定
export const FISH_FLAG_CONFIG = {
	harakiri: { label: 'ハラキリ', style: FISH_STYLES.badgeHarakiri },
	ebisu: { label: '恵比寿関連', style: FISH_STYLES.badgeEbisu },
	taikobou: { label: '太公望関連', style: FISH_STYLES.badgeTaikobou },
} as const;