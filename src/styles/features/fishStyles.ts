/**
 * ============================================================================
 * [FilePath] src/styles/features/fishStyles.ts
 * [Role] 魚チェッカー固有のスタイル定義（バッジ・属性・水質表現）
 * 
 * [概要]
 * - 魚データ固有の属性（ハラキリ、恵比寿、太公望）やサイズ・水質バッジのスタイルを集約
 * ============================================================================
 */

import { COMMON_TOKENS } from '../tokens/commonTokens';

export const FISH_STYLES = {
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