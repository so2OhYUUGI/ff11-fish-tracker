/**
 * ============================================================================
 * [FilePath] src/styles/cardStyles.ts
 * [Role] カード表示モード用の共通スタイル定義定数（Tailwind CSS クラス）
 * 
 * [概要]
 * - カード表示（`viewMode === 'card'`）時における各要素（外枠, タイトル, テキストボックス, バッジ等）のTailwindクラス定義
 * - リスト表示用の `listStyles.ts` や詳細表示用の `detailStyles.ts` と対になるスタイルモジュール
 * - カードの状態（default, checked, selected）に応じたスタイリングクラスを保持
 * 
 * [編集・改修時の注意事項]
 * 1. 【`listStyles.ts`・`detailStyles.ts` とのトーン合わせ】
 *    背景色（`bg-slate-800`系）やアクセントカラー（`emerald` / `cyan` / `amber`系）の色相指定は、
 *    他スタイリングファイルと統一感を保つように更新してください。
 * 2. 【バッジ類の追加・変更】
 *    魚の属性（ハラキリ、恵比寿、太公望等）を追加する場合は、`badgeBase` と組み合わせて使用する
 *    バッジ専用スタイル（`badgeXxx`）を追加定義してください。
 * 3. 【クラスの適用】
 *    `cn` ユーティリティと併用して適用することを推奨します。
 * ============================================================================
 */

export const CARD_STYLES = {
	// 基本カード枠
	base: 'relative cursor-pointer rounded-xl border p-4 transition-all duration-200 select-none group',
	default: 'bg-slate-800 border-slate-700 hover:border-slate-500 shadow-md',
	checked: 'bg-slate-800/60 border-emerald-500/50 shadow-sm opacity-80 hover:opacity-100',
	selected: 'bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg',

	// タイトル・テキスト
	titleJa: 'font-bold text-base transition-colors',
	titleJaDefault: 'text-white group-hover:text-cyan-400',
	titleJaChecked: 'line-through text-slate-400',
	titleEn: 'text-xs text-slate-400 font-mono',
	description: 'text-sm text-slate-300 mt-2 line-clamp-2',

	// コンテナボックス
	boxBlock: 'bg-slate-900/60 p-2.5 rounded border border-slate-700/50 text-xs text-slate-300 leading-relaxed',
	notesBlock: 'mt-2 text-xs text-slate-400 flex items-start gap-1 bg-slate-900/50 p-2 rounded border border-slate-700/50',

	// バッジ類
	badgeBase: 'px-2 py-0.5 rounded font-medium text-xs',
	badgeDefault: 'bg-slate-700 text-slate-300',
	badgeLarge: 'bg-amber-950/80 text-amber-300 border border-amber-800',
	badgeSmall: 'bg-blue-950/80 text-blue-300 border border-blue-800',
	badgeHarakiri: 'bg-red-950/80 text-red-300 border border-red-800',
	badgeEbisu: 'bg-purple-950/80 text-purple-300 border border-purple-800',
	badgeTaikobou: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800',
} as const;