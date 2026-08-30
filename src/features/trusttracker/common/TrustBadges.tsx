/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/common/TrustBadges.tsx
 * [Role] フェイスの属性（戦闘タイプ、所属、ジョブ、限定、関連アイテム）を表示する共通バッジ群
 * 
 * [概要]
 * - `TrustTrackerStyle.ts` に定義された設定オブジェクトを参照してバッジを描画
 * - 未定義の値が渡された場合もフォールバック表示により画面崩れを防止
 * - 共通の `Badge` コンポーネントを内部で使用
 * ============================================================================
 */

import React from 'react';
import { Shield, MapPin, Package } from 'lucide-react';
import type { TrustCombatType, TrustAffiliation } from '@/types/trusttracker';
import { Badge } from '@/components/common/Badge';
import {
	TRUST_STYLES,
	TRUST_COMBAT_TYPE_CONFIG,
	TRUST_AFFILIATION_CONFIG,
} from '@/styles/features/TrustTrackerStyle';

type CombatTypeBadgeProps = {
	/** 戦闘タイプ */
	combatType: TrustCombatType;
	/** 一覧用に固定幅を適用するかどうか */
	isFixedWidth?: boolean;
};

/**
 * 戦闘タイプバッジ
 */
export const CombatTypeBadge: React.FC<CombatTypeBadgeProps> = ({
	combatType,
	isFixedWidth = false,
}) => {
	const config = TRUST_COMBAT_TYPE_CONFIG[combatType] ?? {
		label: combatType,
		style: 'bg-slate-800 text-slate-300 border-slate-700',
	};
	const fixedWidthClass = isFixedWidth ? TRUST_STYLES.combatBadgeBase : '';

	return (
		<Badge className={`${fixedWidthClass} ${config.style}`}>
			{config.label}
		</Badge>
	);
};

type AffiliationBadgeProps = {
	/** 所属 */
	affiliation: TrustAffiliation;
};

/**
 * 所属区分バッジ
 */
export const AffiliationBadge: React.FC<AffiliationBadgeProps> = ({ affiliation }) => {
	const config = TRUST_AFFILIATION_CONFIG[affiliation] ?? {
		label: affiliation,
		style: 'bg-gray-800/80 text-gray-300 border-gray-700/80',
	};

	return (
		<Badge className={config.style}>
			<MapPin className={TRUST_STYLES.badgeIcon} />
			{config.label}
		</Badge>
	);
};

type JobBadgeProps = {
	/** ジョブ名 */
	job: string;
};

/**
 * ジョブ表示バッジ
 */
export const JobBadge: React.FC<JobBadgeProps> = ({ job }) => {
	return (
		<Badge className={TRUST_STYLES.badgeDefault}>
			<Shield className={TRUST_STYLES.badgeIcon} />
			{job}
		</Badge>
	);
};

/**
 * 期間限定フェイス用バッジ
 */
export const LimitedBadge: React.FC = () => {
	return (
		<Badge className={TRUST_STYLES.badgeLimited}>
			期間限定
		</Badge>
	);
};

type TrustItemBadgeProps = {
	/** アイテム名 */
	itemName: string;
};

/**
 * 関連アイテム（盟など）用バッジ
 */
export const TrustItemBadge: React.FC<TrustItemBadgeProps> = ({ itemName }) => {
	return (
		<Badge className={TRUST_STYLES.itemBadge}>
			<Package className={TRUST_STYLES.itemIcon} />
			<span className="truncate">{itemName}</span>
		</Badge>
	);
};