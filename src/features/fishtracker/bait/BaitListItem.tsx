/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/bait/BaitListItem.tsx
 * [Role] 餌データ（個別）のリスト表示コンポーネント
 * 
 * [概要]
 * - 餌の基本情報（和名、英名、簡略説明文）のリスト形式（高密度レイアウト）表示
 * - 餌名称（縦並び）、説明文（中央横並び）、釣れる魚の総数バッジ（右端）を配置
 * - 全スタイルの参照を `LIST_STYLES` / `COMMON_TOKENS` へ完全移行
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { Fish } from 'lucide-react';
import type { BaitMaster, FishMaster } from '@/types/fishtracker';
import { FISH_BAIT_RELATIONS, FISHES } from '@/data';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';

type Props = {
	bait: BaitMaster;
	fishes?: FishMaster[]; // 釣れる魚の算出用データ（未指定時は FISHES を参照）
	isSelected?: boolean;
	onClickDetail: (bait: BaitMaster) => void;
};

export const BaitListItem: React.FC<Props> = ({
	bait,
	fishes = FISHES,
	isSelected,
	onClickDetail,
}) => {
	// 該当する餌 (bait.id) で釣れる魚の総数を算出（重複を除外して最適化）
	const totalFishes = useMemo(() => {
		const uniqueFishIds = new Set(
			FISH_BAIT_RELATIONS
				.filter((rel) => rel.baitId === bait.id)
				.map((rel) => rel.fishId)
		);
		return fishes.filter((fish) => uniqueFishIds.has(fish.id)).length;
	}, [bait.id, fishes]);

	// 説明文の改行エスケープ（\n または \\n をスペース1つに置換）
	const formattedDescription = useMemo(() => {
		if (!bait.description) return null;
		return bait.description.replace(/\r?\n|\\n/g, ' ');
	}, [bait.description]);

	return (
		<div
			onClick={() => onClickDetail(bait)}
			className={`${LIST_STYLES.base} ${LIST_STYLES.itemRow} ${isSelected ? LIST_STYLES.selected : LIST_STYLES.default
				}`}
		>
			{/* 1. 左側：名称表示領域（縦並び・幅固定寄り） */}
			<div className={LIST_STYLES.nameGroup}>
				<span
					className={`truncate ${LIST_STYLES.titleJa} ${isSelected ? LIST_STYLES.titleJaSelectedBait : LIST_STYLES.titleJaDefault
						}`}
				>
					{bait.ja}
				</span>
				<span className={`truncate ${LIST_STYLES.titleEn}`}>
					{bait.en}
				</span>
			</div>

			{/* 2. 中央：簡略説明文（1行・右寄せでデッドスペースを埋める） */}
			{formattedDescription ? (
				<div className={LIST_STYLES.description}>
					{formattedDescription}
				</div>
			) : (
				<div className={LIST_STYLES.spacer} />
			)}

			{/* 3. 右端：釣れる魚の総数インジケーター */}
			<div className={LIST_STYLES.badge}>
				<Fish className={`w-3.5 h-3.5 ${COMMON_TOKENS.entity.fish.text}`} />
				<span>{totalFishes}</span>
			</div>
		</div>
	);
};