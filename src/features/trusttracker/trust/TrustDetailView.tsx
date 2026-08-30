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
 * - DETAIL_STYLES の適用によるコンテナ幅・スクロール領域・各カード要素の標準化
 * 
 * [依存関係・関連ファイル]
 * - 型定義  : src/types/trusttracker.ts (TrustMaster)
 * - スタイル: src/styles/components/detailStyles.ts, src/styles/components/badgeStyles.ts
 * - 共通部品: src/components/common/Badge.tsx, src/features/fishtracker/common/DetailHeader.tsx
 * ============================================================================
 */

import React, { useState, useCallback } from 'react';
import { CheckSquare, Square, Copy, BookOpen, Shield, Award, Terminal, Sparkles, Users } from 'lucide-react';
import type { TrustMaster } from '@/types/trusttracker';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { getCombatTypeBadgeStyle } from '@/styles/components/badgeStyles';
import { Badge } from '@/components/common/Badge';
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
	const macroText = trust ? `/ma ${trust.ja} <me> <wait 6>` : '';

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
				<div className={DETAIL_STYLES.emptyDetailWrapper}>
					<Sparkles className={DETAIL_STYLES.emptyDetailPulseIcon} />
					<p className={DETAIL_STYLES.emptyDetailTitle}>フェイスを選択してください</p>
					<p className={DETAIL_STYLES.emptyDetailSubText}>
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
				icon={<Users className={DETAIL_STYLES.headerCategoryIcon} />}
				canGoBack={canGoBack}
				onBack={onBack}
				onClose={onClose ?? (() => { })}
				actions={headerActions}
			/>

			{/* 2. スクロールコンテンツエリア */}
			<div className={DETAIL_STYLES.scrollContent}>
				{/* 属性バッジ群 */}
				<div className={DETAIL_STYLES.badgeGroup}>
					<Badge className={DETAIL_STYLES.badgeDefault}>
						<Shield className={DETAIL_STYLES.badgeIcon} />
						{trust.job}
					</Badge>
					<Badge className={getCombatTypeBadgeStyle(trust.combatType)}>
						{trust.combatType}
					</Badge>
					{trust.isLimited && (
						<Badge className={DETAIL_STYLES.badgeLimited}>
							期間限定
						</Badge>
					)}
				</div>

				{/* 修得条件・入手方法 */}
				<div className={DETAIL_STYLES.sectionCard}>
					<div className={DETAIL_STYLES.sectionTitleAccent}>
						<BookOpen className={DETAIL_STYLES.sectionIcon} />
						<span>修得条件・入手方法</span>
					</div>
					<p className={DETAIL_STYLES.sectionContentText}>{trust.acquireInfo}</p>
				</div>

				{/* 関連アイテム */}
				{trust.item?.ja && (
					<div className={DETAIL_STYLES.sectionCard}>
						<div className={DETAIL_STYLES.sectionTitleMuted}>
							<Award className={DETAIL_STYLES.sectionIconMuted} />
							<span>関連アイテム</span>
						</div>
						<p className={DETAIL_STYLES.sectionContentHighlight}>{trust.item.ja}</p>
					</div>
				)}

				{/* 呼び出しマクロ */}
				<div className={DETAIL_STYLES.sectionCard}>
					<div className={DETAIL_STYLES.sectionCardHeader}>
						<div className={DETAIL_STYLES.sectionTitleMuted}>
							<Terminal className={DETAIL_STYLES.sectionIconAccent} />
							<span>呼び出しマクロ</span>
						</div>
						<button
							type="button"
							onClick={handleCopyMacro}
							className={DETAIL_STYLES.copyButton}
						>
							<Copy className={DETAIL_STYLES.sectionIcon} />
							<span>{copied ? 'コピーしました' : 'コピー'}</span>
						</button>
					</div>
					<div className={DETAIL_STYLES.codeBox}>
						{macroText}
					</div>
				</div>
			</div>
		</div>
	);
};