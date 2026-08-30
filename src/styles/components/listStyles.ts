/**
 * ============================================================================
 * [FilePath] src/styles/components/listStyles.ts
 * [Role]     リスト表示モード用の共通スタイル定義
 * 
 * [概要]
 * - リスト表示（FishListItem, AreaListItem, BaitListItem, TrustListItem）における横並び高密度表示用スタイル
 * - モードテーマ（data-theme="fish" / "trust"）に連動するCSS変数参照に対応
 * - COMMON_TOKENS 側のデフォルトスタイルを維持しつつテーマ変数との互換性を確保
 * - モバイル（小画面）〜PC画面における幅・テキスト省略（truncate）領域のレスポンシブ最適化
 * ============================================================================
 */

import { COMMON_TOKENS } from '../tokens/commonTokens';

export const LIST_STYLES = {
	// 1. 基本リスト行・レイアウト（タップ領域およびレスポンシブパディングの確保）
	base: 'relative rounded-lg border p-2 sm:p-2.5 transition-all duration-150 select-none group min-h-[44px]',
	itemRow: 'flex items-center justify-between gap-2 sm:gap-3 cursor-pointer py-1.5 px-2 sm:py-2 sm:px-3 min-h-[44px]',
	fishRow: 'flex items-center justify-between gap-2 sm:gap-3 cursor-pointer py-1.5 px-2 sm:py-2 sm:px-3 min-h-[44px]',
	dimmed: 'opacity-70',

	// テーマ変数対応（デフォルトはCOMMON_TOKENSの既定値を維持し、CSS側でテーマ変数が適用可能に調整）
	default: 'bg-[var(--theme-checked-bg)] border-[var(--theme-container-border)] hover:border-[var(--theme-accent-border)] hover:bg-[var(--theme-active-item-bg)] shadow-sm',
	selected: 'bg-[var(--theme-container-bg)] border-[var(--theme-accent-border)] shadow-lg ring-1 ring-[var(--theme-accent-border)]',
	checked: `${COMMON_TOKENS.state.checked} bg-[var(--theme-checked-bg)] border-[var(--theme-checked-border)]`,
	empty: COMMON_TOKENS.state.empty,
	selectedCheckedOpacity: 'opacity-90',

	// 1b. インライン用リスト行（詳細パネル等で利用）
	inlineBase: 'w-full text-left p-2.5 sm:p-3 rounded-lg bg-[var(--theme-container-bg)] border border-[var(--theme-container-border)] flex items-center justify-between gap-2 min-h-[40px]',
	inlineInteractive: 'cursor-pointer hover:bg-[var(--theme-active-item-bg)] hover:border-[var(--theme-accent-border)] transition-colors',

	// 2. レイアウトグループ（幅変動に対応した幅調整およびコンテナ）
	leftGroupContainer: 'flex items-center gap-2.5 min-w-0 flex-1',
	badgeGroupContainer: 'flex flex-wrap items-center justify-end gap-1 shrink-0 max-w-[50%]',
	nameGroup: 'flex flex-col min-w-[100px] sm:min-w-[130px] max-w-[140px] sm:max-w-[180px] shrink-0',
	titleGroup: 'flex flex-col min-w-0 flex-1',
	description: `${COMMON_TOKENS.text.subText} truncate text-right flex-1 min-w-0 text-xs`,
	descriptionSub: `${COMMON_TOKENS.text.subText} truncate mt-0.5 text-[11px] sm:text-xs`,
	spacer: 'flex-1 min-w-0',

	// 3. タイトル・テキスト表現（レスポンシブフォント）
	titleJa: `${COMMON_TOKENS.text.titleJa} text-xs sm:text-sm leading-tight`,
	titleJaDefault: 'text-white group-hover:text-[var(--theme-text-accent)]',
	titleJaSelected: COMMON_TOKENS.entity.fish.textActive,
	titleJaSelectedBait: COMMON_TOKENS.entity.bait.textActive,
	titleJaSelectedArea: COMMON_TOKENS.entity.area.textActive,
	titleJaSelectedTrust: 'text-[var(--theme-text-accent)] font-bold',
	titleJaChecked: 'line-through text-slate-500',
	titleEn: COMMON_TOKENS.text.titleEn,
	subText: COMMON_TOKENS.text.subText,

	// インライン用タイトル表現
	titleInlineJa: 'text-xs sm:text-sm font-bold text-slate-200',
	titleInlineJaChecked: 'text-xs sm:text-sm font-bold text-slate-500 line-through',
	titleInlineEn: 'text-[10px] sm:text-xs text-slate-400 font-mono',

	// 4. チェックボックス UI（モバイル用操作領域の維持）
	checkboxBase: 'w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 touch-manipulation',
	checkboxDefault: 'border-slate-600 bg-slate-700/50 hover:border-[var(--theme-accent-border)] text-transparent',
	checkboxChecked: 'bg-emerald-600 border-emerald-500 text-white shadow-sm',

	// 5. インジケーター・バッジ（テーマ対応補正）
	badge: 'shrink-0 flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] rounded font-medium',
	indicatorBase: 'shrink-0 flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 border rounded',
	indicatorActive: 'shrink-0 flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 border rounded bg-[var(--theme-badge-bg)] border-[var(--theme-badge-border)] text-[var(--theme-badge-text)]',
	indicatorEmpty: `shrink-0 flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 border rounded ${COMMON_TOKENS.state.emptyBadge}`,
	indicatorIcon: 'w-3 h-3 sm:w-3.5 sm:h-3.5',
	indicatorIconActive: 'w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--theme-text-accent)]',
	indicatorIconEmpty: 'w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500',

	// 6. 生息エリア数バッジ（個別）
	zoneCountBase: 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium border shrink-0',
	zoneCountSingle: 'bg-amber-950/50 text-amber-300 border-amber-800/40',
	zoneCountMultiple: 'bg-[var(--theme-container-bg)] text-slate-300 border-[var(--theme-container-border)]',
} as const;