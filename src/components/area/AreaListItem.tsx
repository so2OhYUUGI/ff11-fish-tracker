/**
 * ============================================================================
 * [FilePath] src/components/area/AreaListItem.tsx
 * [Role] エリアデータのリスト表示コンポーネント
 * 
 * [概要]
 * - エリアの基本情報（和名、英名、簡略説明文）のリスト形式（高密度レイアウト）表示
 * - 選択中（アクティブ）状態に応じたスタイリング切り替え
 * 
 * [編集・改修時の注意事項]
 * 1. 【スタイルの参照】
 *    Tailwind CSS クラスは `@/styles/listStyles` の `LIST_STYLES` を定数参照しています。
 * ============================================================================
 */

import React from 'react';
import type { AreaMaster } from '@/types/fish';
import { LIST_STYLES } from '@/styles/listStyles';

type Props = {
	area: AreaMaster;
	isSelected?: boolean;
	onClickDetail: (area: AreaMaster) => void;
};

export const AreaListItem: React.FC<Props> = ({ area, isSelected, onClickDetail }) => {
	return (
		<div
			onClick={() => onClickDetail(area)}
			className={`${LIST_STYLES.base} ${isSelected ? LIST_STYLES.selected : LIST_STYLES.default
				}`}
		>
			<div className="flex items-center gap-3 min-w-0 flex-1">
				<div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-3">
					<div className="flex items-center gap-2">
						<span
							className={`${LIST_STYLES.titleJa} ${isSelected ? 'text-cyan-300' : LIST_STYLES.titleJaDefault
								}`}
						>
							{area.ja}
						</span>
						<span className={LIST_STYLES.titleEn}>({area.en})</span>
					</div>
				</div>
			</div>

			{area.description && (
				<div className={LIST_STYLES.subText}>
					{area.description.split('\\n').map((line, index) => (
						<React.Fragment key={index}>{line}</React.Fragment>
					))}
				</div>
			)}
		</div>
	);
};