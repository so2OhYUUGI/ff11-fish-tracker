/**
 * ============================================================================
 * [FilePath] src/styles/listStyles.ts
 * [Role] リスト表示モード用の共通スタイル定義定数（Tailwind CSS クラス）
 * 
 * [概要]
 * - リスト表示（`viewMode === 'list'`）時における各要素（行枠, チェックボックス, タイトル, バッジ等）のTailwindクラス定義
 * - カード表示用の `cardStyles.ts` と対になるスタイルモジュール
 * - 各種インタラクション状態（default, checked, selected）に対応するクラスを保持
 * 
 * [編集・改修時の注意事項]
 * 1. 【`cardStyles.ts` とのトーン合わせ】
 *    背景色（`bg-slate-800`系）やアクセントカラー（`emerald` / `cyan` / `amber`系）の色相指定は、
 *    カード表示（`cardStyles.ts`）と統一感を保つように更新してください。
 * 2. 【レスポンシブ表示】
 *    リスト表示は高密度レイアウトのため、一部要素（`titleEn`, `subText` 等）に
 *    `hidden sm:inline` や `hidden md:block` などの画面幅に応じた非表示制御が含まれています。
 * 3. 【クラスの適用】
 *    `cn` ユーティリティと併用して適用することを推奨します。
 * ============================================================================
 */

export const LIST_STYLES = {
	// コンテナ枠
	base: 'flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all duration-150 group',
	default: 'bg-slate-800 border-slate-700 hover:border-slate-500',
	checked: 'bg-slate-800/40 border-emerald-500/40 opacity-75',
	// 追加: 選択中（アクティブ）スタイル
	selected: 'bg-slate-700/80 border-cyan-500 shadow-md ring-1 ring-cyan-500/50',

	// チェックインジケーター
	checkboxBase: 'w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors',
	checkboxChecked: 'bg-emerald-600 text-white',
	checkboxDefault: 'bg-slate-700 text-slate-500 border border-slate-600',

	// タイトル・テキスト
	titleJa: 'font-bold text-sm truncate transition-colors',
	titleJaDefault: 'text-white group-hover:text-cyan-400',
	titleJaChecked: 'line-through text-slate-400',
	titleEn: 'text-xs text-slate-400 font-mono hidden sm:inline',

	// バッジ類
	badgeBase: 'text-[10px] px-1.5 py-0.5 rounded font-medium',
	badgeDefault: 'bg-slate-700 text-slate-300',
	badgeLarge: 'bg-amber-950/80 text-amber-300',
	badgeSmall: 'bg-blue-950/80 text-blue-300',
	badgeHarakiri: 'bg-red-950/80 text-red-300',
	badgeEbisu: 'bg-purple-950/80 text-purple-300',
	badgeTaikobou: 'bg-emerald-950/80 text-emerald-300',

	// エリア表示・補助文言
	subText: 'hidden md:block text-xs text-slate-400 max-w-[200px] truncate text-right',
} as const;