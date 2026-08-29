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
 * - variant Props（'default' | 'inline'）によりメイン一覧用と詳細画面インライン用のスタイル切替に対応
 * ============================================================================
 */

import React, { useCallback } from 'react';
import { Check, Package } from 'lucide-react';
import type { TrustMaster } from '@/types/trusttracker';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { BADGE_BASE_STYLE } from '@/styles/features/FishTrackerStyle';

type Props = {
	trust: TrustMaster;
	isChecked?: boolean;
	isSelected?: boolean;
	variant?: 'default' | 'inline';
	onToggleCheck?: (trustId: number) => void;
	onClickDetail?: (trust: TrustMaster) => void;
};

// 戦闘タイプに応じたバッジスタイルの取得
const getCombatTypeBadgeStyle = (combatType: TrustMaster['combatType']): string => {
	switch (combatType) {
		case '近接物理':
		case '遠距離物理':
			return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
		case '魔法攻撃':
			return 'bg-purple-950/80 text-purple-300 border-purple-800/60';
		case '回復':
		case '支援':
			return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
		case '盾':
			return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
		default:
			return 'bg-slate-800/80 text-slate-300 border-slate-700/60';
	}
};

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
			onToggleCheck?.(trust.id);
		},
		[trust.id, onToggleCheck]
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
						onClick={handleToggleClick}
						className={`${LIST_STYLES.checkboxBase} ${isChecked ? LIST_STYLES.checkboxChecked : LIST_STYLES.checkboxDefault
							}`}
						title={isChecked ? '未修得にする' : '修得済みにする'}
						aria-label={`${trust.ja}の修得状態の切り替え（現在: ${isChecked ? '修得済み' : '未修得'
							}）`}
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
					<span
						className={`${BADGE_BASE_STYLE} bg-slate-800/80 text-amber-200/90 border-slate-700/80 gap-1 min-w-0 max-w-[120px] sm:max-w-[180px]`}
						title={`使用アイテム: ${trust.item.ja}`}
					>
						<Package className="w-3 h-3 shrink-0 text-amber-400" />
						<span className="truncate">{trust.item.ja}</span>
					</span>
				)}

				{/* 戦闘タイプ（最大文字数「遠距離物理」「魔法攻撃」に合わせた幅固定化：84px） */}
				<span
					className={`${BADGE_BASE_STYLE} ${combatBadgeStyle} w-[84px] justify-center shrink-0 text-center`}
				>
					{trust.combatType}
				</span>
			</div>
		</div>
	);
};