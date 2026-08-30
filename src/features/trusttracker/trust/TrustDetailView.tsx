/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/trust/TrustDetailView.tsx
 * [Role] フェイス（選択中）の詳細情報表示コンポーネント
 * 
 * [概要]
 * - 選択されたフェイスの基本情報（名称、ジョブ、戦闘タイプ、入手情報）の詳細表示
 * - 共通ヘッダーコンポーネント（`DetailHeader`）を利用して閉じるボタン等を含むヘッダー構造を統一
 * - 修得ステータス（修得済み/未修得）の確認およびトグル操作（ヘッダーアクション経由）
 * - 盟（アイテム）情報およびゲーム内呼び出しマクロ（/ma フェイス名 <me>）のテキストコピー機能
 * - DETAIL_STYLES（panelBase, scrollContent）の適用によるコンテナ幅・スクロール領域の標準化
 * 
 * [依存関係・関連ファイル]
 * - 型定義  : src/types/trusttracker.ts (TrustMaster)
 * - スタイル: src/styles/components/detailStyles.ts, src/styles/features/FishTrackerStyle
 * - 共通    : src/features/fishtracker/common/DetailHeader.tsx
 * ============================================================================
 */

import React, { useState, useCallback } from 'react';
import { CheckSquare, Square, Copy, BookOpen, Shield, Award, Terminal, Sparkles, Users } from 'lucide-react';
import type { TrustMaster } from '@/types/trusttracker';
import { BADGE_BASE_STYLE } from '@/styles/features/FishTrackerStyle';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { DetailHeader } from '@/features/fishtracker/common/DetailHeader';

type Props = {
	trust: TrustMaster | null;
	isChecked?: boolean;
	onToggleCheck?: (trustId: number) => void;
	onClose?: () => void;
	onBack?: () => void;
	canGoBack?: boolean;
};

export const TrustDetailView: React.FC<Props> = ({
	trust,
	isChecked = false,
	onToggleCheck,
	onClose,
	onBack,
	canGoBack = false,
}) => {
	const [copied, setCopied] = useState(false);

	// 呼び出しマクロ文の生成
	const macroText = trust ? `/ma ${trust.ja} <me>` : '';

	// マクロコピー処理
	const handleCopyMacro = useCallback(async () => {
		if (!macroText) return;
		try {
			await navigator.clipboard.writeText(macroText);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy macro text: ', err);
		}
	}, [macroText]);

	const handleToggleCheck = useCallback(() => {
		if (trust && onToggleCheck) {
			onToggleCheck(trust.id);
		}
	}, [trust, onToggleCheck]);

	// 未選択状態のフォールバック表示
	if (!trust) {
		return (
			<div className={DETAIL_STYLES.panelBase}>
				<div className="h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
					<Sparkles className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
					<p className="text-slate-400 font-medium">フェイスを選択してください</p>
					<p className="text-xs text-slate-500 mt-1">
						一覧から選択すると、修得方法や呼び出しマクロ等の詳細情報を確認できます。
					</p>
				</div>
			</div>
		);
	}

	// ヘッダーに配置する固有アクション（修得チェックボタン）
	const headerActions = onToggleCheck ? (
		<button
			type="button"
			onClick={handleToggleCheck}
			className={`${DETAIL_STYLES.checkButtonBase} ${isChecked
					? DETAIL_STYLES.checkButtonChecked
					: DETAIL_STYLES.checkButtonUnchecked
				} shrink-0`}
			aria-label={`${trust.ja}を${isChecked ? '未修得' : '修得済み'}に変更`}
			aria-pressed={isChecked}
		>
			{isChecked ? (
				<>
					<CheckSquare className={DETAIL_STYLES.checkIconChecked} />
					<span className={DETAIL_STYLES.checkButtonText}>修得済み</span>
				</>
			) : (
				<>
					<Square className={DETAIL_STYLES.checkIconUnchecked} />
					<span className={DETAIL_STYLES.checkButtonText}>未修得</span>
				</>
			)}
		</button>
	) : null;

	return (
		<div className={DETAIL_STYLES.panelBase}>
			{/* 1. 共通固定ヘッダー */}
			<DetailHeader
				titleJa={trust.ja}
				titleEn={trust.en}
				categoryName="フェイス"
				icon={<Users className="w-5 h-5 shrink-0 text-amber-400" />}
				canGoBack={canGoBack}
				onBack={onBack}
				onClose={onClose ?? (() => { })}
				actions={headerActions}
			/>

			{/* 2. スクロールコンテンツエリア */}
			<div className={DETAIL_STYLES.scrollContent}>
				{/* 属性バッジ群 */}
				<div className="flex flex-wrap gap-2">
					<span className={`${BADGE_BASE_STYLE} bg-slate-800 text-slate-200 border-slate-700`}>
						<Shield className="w-3 h-3 text-amber-400" />
						{trust.job}
					</span>
					<span className={`${BADGE_BASE_STYLE} bg-slate-800 text-slate-200 border-slate-700`}>
						{trust.combatType}
					</span>
					{trust.isLimited && (
						<span className={`${BADGE_BASE_STYLE} bg-amber-950/80 text-amber-300 border-amber-800/80`}>
							期間限定
						</span>
					)}
				</div>

				{/* 修得条件・入手方法 */}
				<div className="p-3.5 bg-slate-950/50 rounded-lg border border-slate-800/60 space-y-2">
					<div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
						<BookOpen className="w-3.5 h-3.5" />
						<span>修得条件・入手方法</span>
					</div>
					<p className="text-slate-200 leading-relaxed pl-5">{trust.acquireInfo}</p>
				</div>

				{/* 関連アイテム */}
				{trust.item?.ja && (
					<div className="p-3.5 bg-slate-950/50 rounded-lg border border-slate-800/60 space-y-1">
						<div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
							<Award className="w-3.5 h-3.5 text-slate-400" />
							<span>関連アイテム</span>
						</div>
						<p className="text-slate-200 font-medium pl-5">{trust.item.ja}</p>
					</div>
				)}

				{/* 呼び出しマクロ */}
				<div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
							<Terminal className="w-3.5 h-3.5 text-amber-400" />
							<span>呼び出しマクロ</span>
						</div>
						<button
							type="button"
							onClick={handleCopyMacro}
							className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
						>
							<Copy className="w-3.5 h-3.5" />
							<span>{copied ? 'コピーしました' : 'コピー'}</span>
						</button>
					</div>
					<div className="bg-slate-900 p-2.5 rounded border border-slate-800 font-mono text-xs text-amber-200/90 select-all">
						{macroText}
					</div>
				</div>
			</div>
		</div>
	);
};