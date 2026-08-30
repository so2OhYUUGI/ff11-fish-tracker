/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/trust/TrustListItem.tsx
 * [Role] フェイスデータ（個別）のリスト表示コンポーネント
 * 
 * [概要]
 * - フェイスの基本情報（名前、アイテム名、戦闘タイプ）のリスト表示
 * - 表示順: 名前 -> アイテム -> タイプの構成に最適化
 * - 戦闘タイプバッジの幅固定化によるレイアウト崩れ・ガタつきの防止
 * - 修得/達成状態（チェック状態）のチェックボックス描画およびトグル操作
 * - 限定フェイス（isLimited: true）のチェックボックス操作無効化
 * - variant Props（'default' | 'inline'）によりメイン一覧用と詳細画面インライン用のスタイル切替に対応
 * 
 * [依存関係・関連ファイル]
 * - 型定義  : src/types/trusttracker.ts
 * - スタイル: src/styles/components/listStyles.ts, src/styles/components/badgeStyles.ts
 * - 共通部品: src/components/common/Badge.tsx
 * ============================================================================
 */

import React, { useCallback } from 'react';
import { Check, Package } from 'lucide-react';
import type { TrustMaster } from '@/types/trusttracker';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { getCombatTypeBadgeStyle } from '@/styles/components/badgeStyles';
import { Badge } from '@/components/common/Badge';

type Props = {
	trust: TrustMaster;
	isChecked?: boolean;
	isSelected?: boolean;
	variant?: 'default' | 'inline';
	onToggleCheck?: (trustId: number) => void;
	onClickDetail?: (trust: TrustMaster) => void;
};

// フェイス固有のレイアウト補助スタイル定数
const TRUST_ITEM_STYLES = {
	itemBadge: 'bg-slate-800/80 text-amber-200/90 border-slate-700/80 gap-1 min-w-0 max-w-[120px] sm:max-w-[180px]',
	itemIcon: 'w-3 h-3 shrink-0 text-amber-400',
	combatBadgeBase: 'w-[84px] justify-center shrink-0 text-center',
} as const;

// コンテナスタイルを取得するヘルパー関数
const getContainerStyle = (
	isInline: boolean,
	isSelected: boolean,
	isChecked: boolean,
	hasClickDetail: boolean
): string => {
	if (isInline) {
		const interactive = hasClickDetail ? LIST_STYLES.inlineInteractive : '';
		const dimmed = isChecked ? LIST_STYLES.dimmed : '';
		return `${LIST_STYLES.inlineBase} ${interactive} ${dimmed}`;
	}

	const defaultStateStyle = isSelected
		? `${LIST_STYLES.selected} ${isChecked ? LIST_STYLES.selectedCheckedOpacity : ''}`
		: isChecked
			? LIST_STYLES.checked
			: LIST_STYLES.default;

	return `${LIST_STYLES.base} ${LIST_STYLES.fishRow} ${defaultStateStyle}`;
};

// タイトルスタイルを取得するヘルパー関数
const getTitleStyle = (isInline: boolean, isSelected: boolean, isChecked: boolean): string => {
	if (isInline) {
		return isChecked ? LIST_STYLES.titleInlineJaChecked : LIST_STYLES.titleInlineJa;
	}
	if (isSelected) return LIST_STYLES.titleJaSelectedTrust;
	if (isChecked) return LIST_STYLES.titleJaChecked;
	return LIST_STYLES.titleJaDefault;
};

export const TrustListItem: React.FC<Props> = ({
	trust,
	isChecked = false,
	isSelected = false,
	variant = 'default',
	onToggleCheck,
	onClickDetail,
}) => {
	const isInline = variant === 'inline';
	const isLimited = !!trust.isLimited;

	const containerStyle = getContainerStyle(isInline, isSelected, isChecked, !!onClickDetail);
	const titleStyle = getTitleStyle(isInline, isSelected, isChecked);
	const combatBadgeStyle = getCombatTypeBadgeStyle(trust.combatType);

	const handleClick = useCallback(() => {
		onClickDetail?.(trust);
	}, [trust, onClickDetail]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.target !== e.currentTarget) return;

			if (onClickDetail && (e.key === 'Enter' || e.key === ' ')) {
				e.preventDefault();
				e.stopPropagation();
				onClickDetail(trust);
			}
		},
		[trust, onClickDetail]
	);

	const handleToggleClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			if (isLimited) return;
			onToggleCheck?.(trust.id);
		},
		[trust.id, isLimited, onToggleCheck]
	);

	const handleToggleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.stopPropagation();
			}
		},
		[]
	);

	return (
		<div
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			role={onClickDetail ? 'button' : undefined}
			tabIndex={onClickDetail ? 0 : undefined}
			aria-label={onClickDetail ? `${trust.ja}の詳細を表示` : undefined}
			className={containerStyle}
		>
			{/* 1. 名前（日本語・英語） */}
			<div className={LIST_STYLES.leftGroupContainer}>
				{onToggleCheck && (
					<button
						type="button"
						disabled={isLimited}
						onClick={handleToggleClick}
						onKeyDown={handleToggleKeyDown}
						className={`${LIST_STYLES.checkboxBase} ${isChecked ? LIST_STYLES.checkboxChecked : LIST_STYLES.checkboxDefault
							} ${isLimited ? 'opacity-50 cursor-not-allowed' : ''}`}
						title={
							isLimited
								? '限定フェイスのため操作できません'
								: isChecked
									? '未修得にする'
									: '修得済みにする'
						}
						aria-label={
							isLimited
								? `${trust.ja}（限定フェイスのため修得操作不可）`
								: `${trust.ja}の修得状態の切り替え（現在: ${isChecked ? '修得済み' : '未修得'
								}）`
						}
						aria-pressed={isChecked}
					>
						{isChecked && <Check className="w-4 h-4 stroke-3" />}
					</button>
				)}

				<div className={LIST_STYLES.titleGroup}>
					<span className={`truncate ${titleStyle}`}>{trust.ja}</span>
					<span className={isInline ? LIST_STYLES.titleInlineEn : LIST_STYLES.titleEn}>
						{trust.en}
					</span>
				</div>
			</div>

			{/* 2. アイテム & 3. タイプ */}
			<div className={LIST_STYLES.badgeGroupContainer}>
				{/* アイテム名 */}
				{trust.item?.ja && (
					<Badge className={TRUST_ITEM_STYLES.itemBadge}>
						<Package className={TRUST_ITEM_STYLES.itemIcon} />
						<span className="truncate">{trust.item.ja}</span>
					</Badge>
				)}

				{/* 戦闘タイプ */}
				<Badge className={`${TRUST_ITEM_STYLES.combatBadgeBase} ${combatBadgeStyle}`}>
					{trust.combatType}
				</Badge>
			</div>
		</div>
	);
};