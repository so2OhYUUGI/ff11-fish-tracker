/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/common/FishBadges.tsx
 * [Role] 魚の属性（サイズ、水質、スキル、ハラキリ、各種フラグ、判定ステータス）を表示する共通バッジ群
 * 
 * [概要]
 * - `FishTrackerStyle.ts` に定義された設定オブジェクトを参照してバッジを描画
 * - 未定義の値が渡された場合もフォールバック表示により画面崩れを防止
 * - 共通の `Badge` コンポーネントを内部で使用
 * ============================================================================
 */

import React from 'react';
import type { SizeType, WaterType } from '@/types/fishtracker';
import { Badge } from '@/components/common/Badge';
import {
	FISH_STYLES,
	FISH_SIZE_CONFIG,
	FISH_WATER_CONFIG,
	FISH_FLAG_CONFIG,
	FISH_STATUS_TEXT_STYLES,
} from '@/styles/features/FishTrackerStyle';

type SizeBadgeProps = {
	/** サイズ区分 */
	sizeType: SizeType;
	/** 一覧リストなどで表示を簡略化（例: "小型魚" -> "小型"）するかどうか */
	useShortLabel?: boolean;
};

/**
 * 魚のサイズ区分（小型 / 大型）バッジ
 */
export const SizeBadge: React.FC<SizeBadgeProps> = ({
	sizeType,
	useShortLabel = false,
}) => {
	const config = FISH_SIZE_CONFIG[sizeType] ?? FISH_SIZE_CONFIG.unknown;
	return (
		<Badge className={config.style}>
			{useShortLabel ? config.shortLabel : config.label}
		</Badge>
	);
};

type WaterBadgeProps = {
	/** 水質区分（淡水 / 海水 / 外道） */
	waterType: WaterType;
};

/**
 * 魚の生息水質区分バッジ
 */
export const WaterBadge: React.FC<WaterBadgeProps> = ({ waterType }) => {
	const config = FISH_WATER_CONFIG[waterType] ?? FISH_WATER_CONFIG.unknown;
	return (
		<Badge className={config.style}>
			{config.label}
		</Badge>
	);
};

type FlagType = 'harakiri' | 'ebisu' | 'taikobou';

type FlagBadgeProps = {
	/** フラグ種別（ハラキリ対象 / 恵比寿竿対象 / 太公望竿対象） */
	type: FlagType;
};

/**
 * 特定条件・対象フラグ用バッジ
 */
export const FlagBadge: React.FC<FlagBadgeProps> = ({ type }) => {
	const config = FISH_FLAG_CONFIG[type] ?? {
		label: type,
		style: 'bg-slate-800 text-slate-300 border-slate-700',
	};
	return (
		<Badge className={config.style}>
			{config.label}
		</Badge>
	);
};

type SkillBadgeProps = {
	/** 上限スキル値 */
	maxSkill: number;
	/** 一覧リストなどで表示を簡略化（例: "上限スキル: 100" -> "上限: 100"）するかどうか */
	useShortLabel?: boolean;
};

/**
 * 上限スキル値表示バッジ
 */
export const SkillBadge: React.FC<SkillBadgeProps> = ({
	maxSkill,
	useShortLabel = false,
}) => {
	return (
		<Badge className={FISH_STYLES.badgeSkill}>
			{useShortLabel ? `上限: ${maxSkill}` : `上限スキル: ${maxSkill}`}
		</Badge>
	);
};

type HarakiriItemBadgeProps = {
	/** ハラキリで獲得できるアイテム名 */
	itemName: string;
};

/**
 * ハラキリ獲得アイテム用バッジ
 */
export const HarakiriItemBadge: React.FC<HarakiriItemBadgeProps> = ({ itemName }) => {
	return (
		<Badge className="bg-slate-800 text-slate-200 border-slate-700">
			{itemName}
		</Badge>
	);
};

type HarakiriTitleBadgeProps = {
	/** ハラキリで獲得できる称号 */
	titleName: string;
};

/**
 * ハラキリ獲得称号用バッジ
 */
export const HarakiriTitleBadge: React.FC<HarakiriTitleBadgeProps> = ({ titleName }) => {
	return (
		<Badge className="bg-amber-950/40 text-amber-300 border-amber-800/60">
			{titleName}
		</Badge>
	);
};

type CatchabilityType = 'possible' | 'impossible' | 'unknown';
type BreakType = 'yes' | 'no' | 'unknown';

type RodStatusTextProps = {
	/** 判定種別 ('possible' | 'impossible' | 'yes' | 'no' | 'unknown') */
	type: CatchabilityType | BreakType;
	/** 表示ラベル */
	label: string;
};

/**
 * 竿の相性・判定ステータス用テキスト表示
 */
export const RodStatusText: React.FC<RodStatusTextProps> = ({ type, label }) => {
	const styleClass = FISH_STATUS_TEXT_STYLES[type] ?? FISH_STATUS_TEXT_STYLES.unknown;
	return <span className={styleClass}>{label}</span>;
};