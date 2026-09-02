/**
 * ============================================================================
 * [FilePath] src/styles/components/badgeStyles.ts
 * [Role]     アプリケーション共通のバッジスタイル定義
 * 
 * [概要]
 * - コンポーネントおよび各機能（魚・フェイス等）で共通利用するバッジのベーススタイルとカラー定義
 * - 特定機能に依存しない共通デザイン判定ロジックを集約
 * ============================================================================
 */

export const BADGE_BASE_STYLE =
	'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border shrink-0';

/** 戦闘タイプに応じたバッジスタイルのマッピング */
export const COMBAT_TYPE_BADGE_STYLES: Record<string, string> = {
	近接物理: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
	遠隔物理: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
	魔法攻撃: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
	回復: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
	支援: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
	盾: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
	default: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
} as const;

/**
 * 戦闘タイプ文字列に応じたスタイルクラスを取得
 */
export const getCombatTypeBadgeStyle = (combatType: string): string => {
	return COMBAT_TYPE_BADGE_STYLES[combatType] ?? COMBAT_TYPE_BADGE_STYLES.default;
};