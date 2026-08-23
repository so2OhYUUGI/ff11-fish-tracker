/**
 * ============================================================================
 * [FilePath] src/styles/components/cardStyles.ts
 * [Role]     全機能共通のカード枠組み用スタイル定義
 * 
 * [概要]
 * - カード表示（FishCard, AreaCard, BaitCard）における標準レイアウト・状態・タグのスタイル
 * - モバイル〜PCまでのレスポンシブパディングおよびアクセシビリティ対応
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レイアウト/構造上の制約】 カードの垂直高さを適正に保つ 3 段構成（名称 / 説明文 / 関連データ）の構造バランスを崩さないこと。
 * 2. 【スタイルの集約】 COMMON_TOKENS などのトークン定義を参照し、カード内の共通スタイルを一元管理すること。
 * 3. 【要素の溢れ制限】 可変長の関連タグ表示時の高さ崩れを防ぐため、レスポンシブな幅制限（truncate max-w-*）を維持すること。
 * ============================================================================
 */

import { COMMON_TOKENS } from '../tokens/commonTokens';

export const CARD_STYLES = {
	// 基本カード枠・レイアウト（レスポンシブパディングとタップ領域の最適化）
	base: 'relative cursor-pointer rounded-xl border p-3 sm:p-4 transition-all duration-200 select-none group min-h-[140px] sm:min-h-[160px]',
	cardWrapper: 'flex flex-col justify-between h-full gap-2',
	default: COMMON_TOKENS.state.default,
	checked: COMMON_TOKENS.state.checked,
	selected: COMMON_TOKENS.state.selected,
	empty: COMMON_TOKENS.state.empty,

	// タイトル・テキスト表現（画面幅に応じたフォントサイズ調整）
	titleGroup: 'flex flex-col min-w-0 mb-1 sm:mb-2',
	titleJa: `${COMMON_TOKENS.text.titleJa} text-sm sm:text-base leading-snug`,
	titleJaDefault: 'text-white group-hover:text-cyan-400',
	titleJaSelected: COMMON_TOKENS.entity.fish.textActive,
	titleJaSelectedBait: COMMON_TOKENS.entity.bait.textActive,
	titleJaSelectedArea: COMMON_TOKENS.entity.area.textActive,
	titleJaChecked: 'line-through text-slate-400',
	titleEn: COMMON_TOKENS.text.titleEn,
	titleEnSub: `${COMMON_TOKENS.text.titleEn} mt-0.5`,
	description: 'text-xs sm:text-sm text-slate-300 mt-1 sm:mt-2 line-clamp-2 leading-relaxed',

	// 汎用コンテナボックス
	boxBlock: `${COMMON_TOKENS.box.dark} p-2 sm:p-2.5 rounded text-xs leading-relaxed`,
	descriptionBox: `${COMMON_TOKENS.box.dark} p-2 sm:p-2.5 rounded text-xs leading-relaxed mt-1.5 sm:mt-2 text-slate-300`,
	notesBlock: 'mt-2 text-xs text-slate-400 flex items-start gap-1 bg-slate-900/50 p-2 rounded border border-slate-700/50 leading-relaxed',

	// カード内インラインタグ・関連エンティティリスト（下段領域の最適化）
	targetLabelGroup: 'mt-2 sm:mt-3 text-xs flex items-center gap-1.5 flex-wrap',
	targetLabel: 'flex items-center gap-1 text-slate-400 shrink-0 font-medium text-[11px] sm:text-xs',
	tagContainer: 'flex items-center gap-1 flex-wrap min-w-0',
	tagItem: 'px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700/60 rounded text-[10px] sm:text-[11px] truncate max-w-[100px] sm:max-w-[120px]',
	tagOverflow: 'px-1.5 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 rounded text-[10px] sm:text-[11px] font-semibold shrink-0',
	tagEmpty: 'text-slate-500 italic text-[11px] sm:text-xs',

	// チェックボタン領域のスタイル（モバイル環境でのタッチターゲット確保）
	checkButton: {
		base: 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 touch-manipulation',
		checked: 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50',
		unchecked: 'bg-slate-700 text-slate-500 border border-slate-600 hover:border-slate-400',
		iconChecked: 'w-4 h-4 sm:w-5 sm:h-5 stroke-[3]',
		iconUnchecked: 'w-4 h-4 sm:w-5 sm:h-5 stroke-[2]',
	},

	// セクション・リージョンヘッダー要素
	sectionHeader: {
		container: 'flex items-center gap-2 border-b border-slate-700/80 pb-1.5 px-1',
		titleJa: 'text-xs sm:text-sm font-bold text-cyan-400',
		titleEn: 'text-[10px] sm:text-xs text-slate-400 font-mono',
		countBadge: 'text-[10px] sm:text-xs text-slate-500 ml-auto font-mono',
	},
} as const;