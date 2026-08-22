/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/common/FishBadges.tsx
 * [Role] 魚の属性（サイズ、水質、フラグ情報）を表示する共通バッジ群
 * 
 * [概要]
 * - `fishStyles.ts` に定義された設定オブジェクト（ラベル・スタイルトークン）を参照してバッジを描画
 * - 未定義の値が渡された場合もフォールバック表示により画面崩れを防止
 * ============================================================================
 */

import React from 'react';
import type { SizeType, WaterType } from '@/types/fish';
import {
	BADGE_BASE_STYLE,
	FISH_SIZE_CONFIG,
	FISH_WATER_CONFIG,
	FISH_FLAG_CONFIG,
} from '@/styles/features/FishTrackerStyle';

type SizeBadgeProps = {
	/** サイズ区分 */
	sizeType: SizeType;
	/** 一覧リストなどで表示を簡略化（例: "小型" -> "小"）するかどうか */
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
		<span className={`${BADGE_BASE_STYLE} ${config.style}`}>
			{useShortLabel ? config.shortLabel : config.label}
		</span>
	);
};

type WaterBadgeProps = {
	/** 水質区分（淡水 / 海水 / 汽水） */
	waterType: WaterType;
};

/**
 * 魚の生息水質区分バッジ
 */
export const WaterBadge: React.FC<WaterBadgeProps> = ({ waterType }) => {
	const config = FISH_WATER_CONFIG[waterType] ?? FISH_WATER_CONFIG.unknown;
	return (
		<span className={`${BADGE_BASE_STYLE} ${config.style}`}>
			{config.label}
		</span>
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
		<span className={`${BADGE_BASE_STYLE} ${config.style}`}>
			{config.label}
		</span>
	);
};