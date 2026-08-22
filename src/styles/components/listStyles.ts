/**
 * ============================================================================
 * [FilePath] src/styles/components/listStyles.ts
 * [Role] リスト表示モード用の共通スタイル定義
 * ============================================================================
 */

import { COMMON_TOKENS } from '../tokens/commonTokens';

export const LIST_STYLES = {
	// 1. 基本リスト行・レイアウト
	base: 'relative rounded-lg border p-2.5 transition-all duration-150 select-none group',
	itemRow: 'flex items-center justify-between gap-3 cursor-pointer py-2 px-3',
	fishRow: 'flex items-center justify-between gap-3 cursor-pointer py-2 px-3',
	dimmed: 'opacity-70',
	default: 'bg-slate-800/60 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800 shadow-sm',
	selected: COMMON_TOKENS.state.selected,
	checked: COMMON_TOKENS.state.checked,
	empty: COMMON_TOKENS.state.empty,

	// 1b. インライン用リスト行（詳細パネル等で利用）
	inlineBase: 'w-full text-left p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between gap-2',
	inlineInteractive: 'cursor-pointer hover:bg-slate-800 transition-colors',

	// 2. レイアウトグループ
	nameGroup: 'flex flex-col min-w-[130px] max-w-[180px] shrink-0',
	titleGroup: 'flex flex-col min-w-0',
	description: `${COMMON_TOKENS.text.subText} truncate text-right flex-1 min-w-0`,
	descriptionSub: `${COMMON_TOKENS.text.subText} truncate mt-0.5`,
	spacer: 'flex-1 min-w-0',

	// 3. タイトル・テキスト表現
	titleJa: `${COMMON_TOKENS.text.titleJa} text-sm`,
	titleJaDefault: 'text-white group-hover:text-cyan-400',
	titleJaSelected: COMMON_TOKENS.entity.fish.textActive,
	titleJaSelectedBait: COMMON_TOKENS.entity.bait.textActive,
	titleJaSelectedArea: COMMON_TOKENS.entity.area.textActive,
	titleJaChecked: 'line-through text-slate-500',
	titleEn: COMMON_TOKENS.text.titleEn,
	subText: COMMON_TOKENS.text.subText,

	// インライン用タイトル表現
	titleInlineJa: 'text-sm font-bold text-slate-200',
	titleInlineJaChecked: 'text-sm font-bold text-slate-500 line-through',
	titleInlineEn: 'text-xs text-slate-400 font-mono',

	// 4. チェックボックス UI
	checkboxBase: 'w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0',
	checkboxDefault: 'border-slate-600 bg-slate-700/50 hover:border-slate-500 text-transparent',
	checkboxChecked: 'bg-emerald-600 border-emerald-500 text-white shadow-sm',

	// 5. インジケーター・バッジ
	badge: 'shrink-0 flex items-center gap-1 text-xs px-2 py-1 bg-slate-800/80 border border-slate-700/60 rounded text-slate-300 font-medium',
	indicatorBase: 'shrink-0 flex items-center gap-1 text-xs px-2 py-1 border rounded',
	indicatorActive: 'shrink-0 flex items-center gap-1 text-xs px-2 py-1 border rounded bg-slate-800/80 border-slate-700/60 text-slate-300',
	indicatorEmpty: `shrink-0 flex items-center gap-1 text-xs px-2 py-1 border rounded ${COMMON_TOKENS.state.emptyBadge}`,
	indicatorIcon: 'w-3.5 h-3.5',
	indicatorIconActive: 'w-3.5 h-3.5 text-cyan-400',
	indicatorIconEmpty: 'w-3.5 h-3.5 text-slate-500',

	// 6. 生息エリア数バッジ（個別）
	zoneCountBase: 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border shrink-0',
	zoneCountSingle: 'bg-amber-950/50 text-amber-300 border-amber-800/40',
	zoneCountMultiple: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
} as const;