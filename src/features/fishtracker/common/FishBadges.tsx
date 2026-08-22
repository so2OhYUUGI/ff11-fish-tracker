import React from 'react';
import type { SizeType, WaterType } from '@/types/fish';
import {
	BADGE_BASE_STYLE,
	FISH_SIZE_CONFIG,
	FISH_WATER_CONFIG,
	FISH_FLAG_CONFIG,
} from '@/styles/features/fishStyles';

// サイズバッジ
export const SizeBadge: React.FC<{ sizeType: SizeType; useShortLabel?: boolean }> = ({
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

// 水質バッジ
export const WaterBadge: React.FC<{ waterType: WaterType }> = ({ waterType }) => {
	const config = FISH_WATER_CONFIG[waterType] ?? FISH_WATER_CONFIG.unknown;
	return (
		<span className={`${BADGE_BASE_STYLE} ${config.style}`}>
			{config.label}
		</span>
	);
};

// フラグバッジ（ハラキリ/恵比寿/太公望）
export const FlagBadge: React.FC<{ type: 'harakiri' | 'ebisu' | 'taikobou' }> = ({
	type,
}) => {
	const config = FISH_FLAG_CONFIG[type];
	return (
		<span className={`${BADGE_BASE_STYLE} ${config.style}`}>
			{config.label}
		</span>
	);
};