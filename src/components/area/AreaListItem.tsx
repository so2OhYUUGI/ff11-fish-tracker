/**
 * ============================================================================
 * [FilePath] src/components/area/AreaListItem.tsx
 * [Role] エリアデータのリスト表示コンポーネント
 * 
 * [概要]
 * - エリアの基本情報（和名、英名、簡略説明文）のリスト形式（高密度レイアウト）表示
 * - エリア名称の日本語・英語表記を縦並びへ統一
 * - 釣れる魚の総数バッジを追加し、一覧でのスキャン性と比較容易性を向上
 * - 選択中（アクティブ）状態に応じたスタイリング切り替え
 * 
 * [編集・改修時の注意事項]
 * 1. 【スタイルの参照】
 *    Tailwind CSS クラスは `@/styles/listStyles` の `LIST_STYLES` を定数参照しています。
 * ============================================================================
 */

import React from 'react';
import { Fish } from 'lucide-react';
import type { ZoneMaster, FishMaster } from '@/types/fish';
import { FISH_LOCATIONS, FISHES } from '@/data';
import { LIST_STYLES } from '@/styles/listStyles';

type Props = {
	area: ZoneMaster;
	fishes?: FishMaster[]; // 釣れる魚の算出用データ（未指定時は FISHES を参照）
	isSelected?: boolean;
	onClickDetail: (area: ZoneMaster) => void;
};

export const AreaListItem: React.FC<Props> = ({
	area,
	fishes = FISHES,
	isSelected,
	onClickDetail,
}) => {
	// 該当エリア (area.id) で釣れる魚の総数を算出
	const targetFishIds = FISH_LOCATIONS
		.filter((loc) => loc.zoneId === area.id)
		.map((loc) => loc.fishId);
	const uniqueFishIds = Array.from(new Set(targetFishIds));
	const totalFishes = fishes.filter((fish) => uniqueFishIds.includes(fish.id)).length;

	return (
		<div
			onClick={() => onClickDetail(area)}
			className={`${LIST_STYLES.base} ${isSelected ? LIST_STYLES.selected : LIST_STYLES.default
				} flex items-center justify-between gap-3 cursor-pointer py-2 px-3`}
		>
			<div className="flex-1 min-w-0">
				{/* 名称表示領域：カード側と合わせて縦並び（改行）へ改修 */}
				<div className="flex flex-col min-w-0">
					<span
						className={`truncate ${LIST_STYLES.titleJa} ${isSelected ? 'text-cyan-300' : LIST_STYLES.titleJaDefault
							}`}
					>
						{area.ja}
					</span>
					<span className="truncate text-xs text-slate-400 font-mono font-normal">
						{area.en}
					</span>
				</div>

				{/* 簡略説明文（1行表示で高密度を維持） */}
				{area.description && (
					<div className={`${LIST_STYLES.subText} truncate mt-0.5`}>
						{area.description.replace(/\\n/g, ' ')}
					</div>
				)}
			</div>

			{/* UX向上要素：釣れる魚の総数インジケーター */}
			<div className="shrink-0 flex items-center gap-1 text-xs px-2 py-1 bg-slate-800/80 border border-slate-700/60 rounded text-slate-300">
				<Fish className="w-3.5 h-3.5 text-slate-400" />
				<span className="font-medium">{totalFishes}</span>
			</div>
		</div>
	);
};