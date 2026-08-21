/**
 * ============================================================================
 * [FilePath] src/components/bait/BaitListItem.tsx
 * [Role] 餌データ（個別）のリスト表示コンポーネント
 * 
 * [概要]
 * - 餌の基本情報（和名、英名、簡略説明文）のリスト形式（高密度レイアウト）表示
 * - 餌名称（縦並び）と説明文（右側横並び）のレイアウト配置
 * - 選択中（アクティブ）状態に応じたスタイリング切り替え
 * 
 * [編集・改修時の注意事項]
 * 1. 【スタイルの参照】
 *    Tailwind CSS クラスは `@/styles/listStyles` の `LIST_STYLES` を定数参照しています。
 * ============================================================================
 */

import React from 'react';
import type { BaitMaster } from '@/types/fish';
import { LIST_STYLES } from '@/styles/listStyles';

type Props = {
	bait: BaitMaster;
	isSelected?: boolean;
	onClickDetail: (bait: BaitMaster) => void;
};

export const BaitListItem: React.FC<Props> = ({
	bait,
	isSelected,
	onClickDetail,
}) => {
	return (
		<div
			onClick={() => onClickDetail(bait)}
			className={`${LIST_STYLES.base} ${isSelected ? LIST_STYLES.selected : LIST_STYLES.default
				} flex items-center justify-between gap-4 cursor-pointer py-2 px-3`}
		>
			{/* 左側：名称表示領域（縦並び） */}
			<div className="flex flex-col min-w-[140px] shrink-0">
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

			{/* 右側：簡略説明文（横並び・右寄せ） */}
			{bait.description ? (
				<div className={`${LIST_STYLES.subText} truncate text-right flex-1 min-w-0`}>
					{bait.description.replace(/\\n/g, ' ')}
				</div>
			) : (
				<div className="flex-1" />
			)}
		</div>
	);
};