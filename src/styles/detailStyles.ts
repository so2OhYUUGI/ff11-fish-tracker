/**
 * ============================================================================
 * [FilePath] src/styles/detailStyles.ts
 * [Role] 詳細表示（モーダル / 詳細パネル）用の共通スタイル定義定数（Tailwind CSS クラス）
 * 
 * [概要]
 * - 魚・餌などの詳細情報画面における全要素（コンテナ、ヘッダー、各種操作ボタン、説明枠、タグなど）のTailwindクラス定義
 * - モバイル表示（戻るボタン）とデスクトップ表示（閉じるボタン）の表示切替スタイルを保持
 * - チェック操作ボタンのトグル状態（checked / unchecked）に応じたカラーリングを管理
 * 
 * [編集・改修時の注意事項]
 * 1. 【レスポンシブ動作】
 *    `backButton`（`lg:hidden`）と `closeButton`（`hidden lg:flex`）で
 *    画面サイズごとのUI切替を行っています。ブレイクポイントを変更する場合は両方の整合性を維持してください。
 * 2. 【カード・リストスタイルとの統一性】
 *    `titleJa` や `checkButton` 周りの配色（`emerald` / `cyan` / `slate`系）は、
 *    `cardStyles.ts` および `listStyles.ts` と同じデザインシステムを維持してください。
 * 3. 【クラスの適用】
 *    `cn` ユーティリティと併用して適用することを推奨します。
 * ============================================================================
 */

export const DETAIL_STYLES = {
	// コンテナ
	container:
		'bg-slate-800 border border-slate-700 rounded-xl p-5 md:p-6 flex flex-col gap-6 h-full relative',

	// ヘッダー領域
	header: 'flex items-center justify-between border-b border-slate-700 pb-4',
	headerLeft: 'flex items-center gap-3',
	headerRight: 'flex items-center gap-2',
	titleJa: 'text-xl font-bold text-slate-100',
	titleEn: 'text-xs text-slate-400 font-mono',

	// ボタン類
	backButton:
		'lg:hidden flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 bg-slate-700/60 px-3 py-1.5 rounded-lg border border-slate-600 transition-colors',
	closeButton:
		'hidden lg:flex items-center justify-center p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded-lg transition-colors',
	checkButtonBase:
		'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors',
	checkButtonChecked:
		'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80',
	checkButtonUnchecked:
		'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700',

	// セクション・コンテンツ
	sectionTitle:
		'text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5',
	tagList: 'flex flex-wrap gap-2',
	tagItem:
		'bg-slate-900/80 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-md',
	emptyText: 'text-xs text-slate-500',
	descriptionBox:
		'bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/50 text-sm text-slate-300 leading-relaxed',
} as const;