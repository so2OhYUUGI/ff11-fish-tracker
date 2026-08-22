/**
 * ============================================================================
 * [FilePath] src/styles/components/cardStyles.ts
 * [Role] 全機能共通のカード枠組み用スタイル定義
 * ============================================================================
 */

import { COMMON_TOKENS } from '../tokens/commonTokens';

export const CARD_STYLES = {
	// 基本カード枠・レイアウト
	base: 'relative cursor-pointer rounded-xl border p-4 transition-all duration-200 select-none group',
	cardWrapper: 'flex flex-col justify-between h-full',
	default: COMMON_TOKENS.state.default,
	checked: COMMON_TOKENS.state.checked,
	selected: COMMON_TOKENS.state.selected,
	empty: COMMON_TOKENS.state.empty,

	// タイトル・テキスト表現
	titleGroup: 'flex flex-col min-w-0 mb-2',
	titleJa: `${COMMON_TOKENS.text.titleJa} text-base`,
	titleJaDefault: 'text-white group-hover:text-cyan-400',
	titleJaSelected: COMMON_TOKENS.entity.fish.textActive,
	titleJaSelectedBait: COMMON_TOKENS.entity.bait.textActive,
	titleJaChecked: 'line-through text-slate-400',
	titleEn: COMMON_TOKENS.text.titleEn,
	titleEnSub: `${COMMON_TOKENS.text.titleEn} mt-0.5`,
	description: 'text-sm text-slate-300 mt-2 line-clamp-2',

	// 汎用コンテナボックス
	boxBlock: `${COMMON_TOKENS.box.dark} p-2.5 rounded text-xs leading-relaxed`,
	descriptionBox: `${COMMON_TOKENS.box.dark} p-2.5 rounded text-xs leading-relaxed mt-2 text-slate-300`,
	notesBlock: 'mt-2 text-xs text-slate-400 flex items-start gap-1 bg-slate-900/50 p-2 rounded border border-slate-700/50',

	// 汎用バッジベース
	badgeBase: 'px-2 py-0.5 rounded font-medium text-xs border shrink-0',
	badgeDefault: 'bg-slate-700/80 text-slate-300 border-slate-600',

	// カード内インラインタグ・関連エンティティリスト
	targetLabelGroup: 'mt-3 text-xs flex items-center gap-1.5 flex-wrap',
	targetLabel: 'flex items-center gap-1 text-slate-400 shrink-0 font-medium',
	tagContainer: 'flex items-center gap-1 flex-wrap min-w-0',
	tagItem: 'px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700/60 rounded text-[11px] truncate max-w-[120px]',
	tagOverflow: 'px-1.5 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 rounded text-[11px] font-semibold',
	tagEmpty: 'text-slate-500 italic',

	// セクション・リージョンヘッダー要素
	sectionHeader: {
		container: 'flex items-center gap-2 border-b border-slate-700/80 pb-1.5 px-1',
		titleJa: 'text-sm font-bold text-cyan-400',
		titleEn: 'text-xs text-slate-400 font-mono',
		countBadge: 'text-xs text-slate-500 ml-auto font-mono',
	},
} as const;