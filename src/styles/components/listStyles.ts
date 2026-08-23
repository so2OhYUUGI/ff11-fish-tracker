/**
 * ============================================================================
 * [FilePath] src/styles/components/listStyles.ts
 * [Role]     リスト表示モード用の共通スタイル定義
 * 
 * [概要]
 * - リスト表示（FishListItem, AreaListItem, BaitListItem）における横並び高密度表示用スタイル
 * - モバイル（小画面）〜PC画面における幅・テキスト省略（truncate）領域のレスポンシブ最適化
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レイアウト/構造上の制約】 高速スキャンを実現するため、3段目の追加を避け「1行（高密度2段）」の垂直高さを維持すること。
 * 2. 【スタイルの集約】 COMMON_TOKENS 等のトークン定義を参照し、一貫したスタイル構造を維持すること。
 * 3. 【レスポンシブ幅制御】 小画面時の幅圧迫を防ぐため、nameGroup や description の柔軟な伸縮幅（min-w, max-w, shrink-0）を維持すること。
 * ============================================================================
 */

import { COMMON_TOKENS } from '../tokens/commonTokens';

export const LIST_STYLES = {
	// 1. 基本リスト行・レイアウト（タップ領域およびレスポンシブパディングの確保）
	base: 'relative rounded-lg border p-2 sm:p-2.5 transition-all duration-150 select-none group min-h-[44px]',
	itemRow: 'flex items-center justify-between gap-2 sm:gap-3 cursor-pointer py-1.5 px-2 sm:py-2 sm:px-3 min-h-[44px]',
	fishRow: 'flex items-center justify-between gap-2 sm:gap-3 cursor-pointer py-1.5 px-2 sm:py-2 sm:px-3 min-h-[44px]',
	dimmed: 'opacity-70',
	default: 'bg-slate-800/60 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800 shadow-sm',
	selected: COMMON_TOKENS.state.selected,
	checked: COMMON_TOKENS.state.checked,
	empty: COMMON_TOKENS.state.empty,

	// 1b. インライン用リスト行（詳細パネル等で利用）
	inlineBase: 'w-full text-left p-2.5 sm:p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between gap-2 min-h-[40px]',
	inlineInteractive: 'cursor-pointer hover:bg-slate-800 transition-colors',

	// 2. レイアウトグループ（幅変動に対応した幅幅調整）
	nameGroup: 'flex flex-col min-w-[100px] sm:min-w-[130px] max-w-[140px] sm:max-w-[180px] shrink-0',
	titleGroup: 'flex flex-col min-w-0',
	description: `${COMMON_TOKENS.text.subText} truncate text-right flex-1 min-w-0 text-xs`,
	descriptionSub: `${COMMON_TOKENS.text.subText} truncate mt-0.5 text-[11px] sm:text-xs`,
	spacer: 'flex-1 min-w-0',

	// 3. タイトル・テキスト表現（レスポンシブフォント）
	titleJa: `${COMMON_TOKENS.text.titleJa} text-xs sm:text-sm leading-tight`,
	titleJaDefault: 'text-white group-hover:text-cyan-400',
	titleJaSelected: COMMON_TOKENS.entity.fish.textActive,
	titleJaSelectedBait: COMMON_TOKENS.entity.bait.textActive,
	titleJaSelectedArea: COMMON_TOKENS.entity.area.textActive,
	titleJaChecked: 'line-through text-slate-500',
	titleEn: COMMON_TOKENS.text.titleEn,
	subText: COMMON_TOKENS.text.subText,

	// インライン用タイトル表現
	titleInlineJa: 'text-xs sm:text-sm font-bold text-slate-200',
	titleInlineJaChecked: 'text-xs sm:text-sm font-bold text-slate-500 line-through',
	titleInlineEn: 'text-[10px] sm:text-xs text-slate-400 font-mono',

	// 4. チェックボックス UI（モバイル用操作領域の維持）
	checkboxBase: 'w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 touch-manipulation',
	checkboxDefault: 'border-slate-600 bg-slate-700/50 hover:border-slate-500 text-transparent',
	checkboxChecked: 'bg-emerald-600 border-emerald-500 text-white shadow-sm',

	// 5. インジケーター・バッジ（サイズ感の補正）
	badge: 'shrink-0 flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-slate-800/80 border border-slate-700/60 rounded text-slate-300 font-medium',
	indicatorBase: 'shrink-0 flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 border rounded',
	indicatorActive: 'shrink-0 flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 border rounded bg-slate-800/80 border-slate-700/60 text-slate-300',
	indicatorEmpty: `shrink-0 flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 border rounded ${COMMON_TOKENS.state.emptyBadge}`,
	indicatorIcon: 'w-3 h-3 sm:w-3.5 sm:h-3.5',
	indicatorIconActive: 'w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400',
	indicatorIconEmpty: 'w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500',

	// 6. 生息エリア数バッジ（個別）
	zoneCountBase: 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium border shrink-0',
	zoneCountSingle: 'bg-amber-950/50 text-amber-300 border-amber-800/40',
	zoneCountMultiple: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
} as const;