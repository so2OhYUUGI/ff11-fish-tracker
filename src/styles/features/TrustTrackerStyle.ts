/**
 * ============================================================================
 * [FilePath] src/styles/features/TrustTrackerStyle.ts
 * [Role] フェイス（TrustTracker）機能に関するスタイル定義およびバッジ設定
 * ============================================================================
 */

import type { TrustCombatType, TrustAffiliation } from '@/types/trusttracker';

export const TRUST_STYLES = {
	badgeDefault: 'bg-slate-800/80 text-slate-200 border-slate-700/80 gap-1',
	badgeIcon: 'w-3.5 h-3.5 text-slate-400 shrink-0',
	badgeLimited: 'bg-rose-950/80 text-rose-300 border-rose-800/80 font-medium',
	itemBadge: 'bg-slate-800/80 text-amber-200/90 border-slate-700/80 gap-1 min-w-0 max-w-[120px] sm:max-w-[180px]',
	itemIcon: 'w-3 h-3 shrink-0 text-amber-400',
	combatBadgeBase: 'w-[84px] justify-center shrink-0 text-center',
} as const;

export const TRUST_COMBAT_TYPE_CONFIG: Record<
	TrustCombatType,
	{ label: string; style: string }
> = {
	盾: {
		label: '盾',
		style: 'bg-blue-950/80 text-blue-300 border-blue-800/80',
	},
	前衛: {
		label: '前衛',
		style: 'bg-red-950/80 text-red-300 border-red-800/80',
	},
	後衛: {
		label: '後衛',
		style: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
	},
	回復: {
		label: '回復',
		style: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
	},
	支援: {
		label: '支援',
		style: 'bg-purple-950/80 text-purple-300 border-purple-800/80',
	},
	置物: {
		label: '置物',
		style: 'bg-slate-800/80 text-slate-400 border-slate-700/80',
	},
};

export const TRUST_AFFILIATION_CONFIG: Record<
	TrustAffiliation,
	{ label: string; style: string }
> = {
	サンドリア: {
		label: 'サンドリア',
		style: 'bg-red-950/80 text-red-200 border-red-800/80',
	},
	バストゥーク: {
		label: 'バストゥーク',
		style: 'bg-blue-950/80 text-blue-200 border-blue-800/80',
	},
	ウィンダス: {
		label: 'ウィンダス',
		style: 'bg-emerald-950/80 text-emerald-200 border-emerald-800/80',
	},
	ジュノ: {
		label: 'ジュノ',
		style: 'bg-slate-800/80 text-slate-100 border-slate-600/80',
	},
	プロマシア: {
		label: 'プロマシア',
		style: 'bg-orange-950/80 text-orange-200 border-orange-800/80',
	},
	アトルガン: {
		label: 'アトルガン',
		style: 'bg-purple-950/80 text-purple-200 border-purple-800/80',
	},
	アルタナ: {
		label: 'アルタナ',
		style: 'bg-rose-950/80 text-rose-300 border-rose-800/80',
	},
	アドゥリン: {
		label: 'アドゥリン',
		style: 'bg-teal-950/80 text-teal-200 border-teal-800/80',
	},
	その他: {
		label: 'その他',
		style: 'bg-gray-800/80 text-gray-300 border-gray-700/80',
	},
};