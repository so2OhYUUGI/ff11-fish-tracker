/**
 * ============================================================================
 * [FilePath] src/components/bait/BaitListItem.tsx
 * [Role] 餌データ（個別）のリスト表示コンポーネント
 * 
 * [概要]
 * - 餌の基本情報（和名、英名、簡略説明文）のリスト形式（高密度レイアウト）表示
 * - 餌名称（縦並び）、説明文（中央横並び）、釣れる魚の総数バッジ（右端）を配置
 * - 1行あたりの高さを均一に保ちつつ、情報量とスキャン性を両立
 * - 選択中（アクティブ）状態に応じたスタイリング切り替え
 * 
 * [編集・改修時の注意事項]
 * 1. 【スタイルの参照】
 *    Tailwind CSS クラスは `@/styles/listStyles` の `LIST_STYLES` を定数参照しています。
 * ============================================================================
 */

import React from 'react';
import { Fish } from 'lucide-react';
import type { BaitMaster, FishMaster } from '@/types/fish';
import { FISH_BAIT_RELATIONS, FISHES } from '@/data';
import { LIST_STYLES } from '@/styles/listStyles';

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
	// 該当する餌 (bait.id) で釣れる魚の総数を算出
	const targetFishIds = FISH_BAIT_RELATIONS
		.filter((rel) => rel.baitId === bait.id)
		.map((rel) => rel.fishId);
	const uniqueFishIds = Array.from(new Set(targetFishIds));
	const totalFishes = fishes.filter((fish) => uniqueFishIds.includes(fish.id)).length;

	return (
		<div
			onClick={() => onClickDetail(bait)}
			className={`${LIST_STYLES.base} ${isSelected ? LIST_STYLES.selected : LIST_STYLES.default
				} flex items-center justify-between gap-3 cursor-pointer py-2 px-3`}
		>
			{/* 1. 左側：名称表示領域（縦並び・幅固定寄り） */}
			<div className="flex flex-col min-w-[130px] max-w-[180px] shrink-0">
				<span
					className={`truncate ${LIST_STYLES.titleJa} ${isSelected ? 'text-cyan-300' : LIST_STYLES.titleJaDefault
						}`}
				>
					{bait.ja}
				</span>
				<span className="truncate text-xs text-slate-400 font-mono font-normal">
					{bait.en}
				</span>
			</div>

			{/* 2. 中央：簡略説明文（1行・右寄せでデッドスペースを埋める） */}
			{bait.description ? (
				<div className={`${LIST_STYLES.subText} truncate text-right flex-1 min-w-0`}>
					{bait.description.replace(/\\n/g, ' ')}
				</div>
			) : (
				<div className="flex-1 min-w-0" />
			)}

			{/* 3. 右端：釣れる魚の総数インジケーター */}
			<div className="shrink-0 flex items-center gap-1 text-xs px-2 py-1 bg-slate-800/80 border border-slate-700/60 rounded text-slate-300">
				<Fish className="w-3.5 h-3.5 text-slate-400" />
				<span className="font-medium">{totalFishes}</span>
			</div>
		</div>
	);
};