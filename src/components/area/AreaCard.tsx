/**
 * ============================================================================
 * [FilePath] src/components/area/AreaCard.tsx
 * [Role] エリアデータのカード表示コンポーネント
 * 
 * [概要]
 * - エリアの基本情報（和名、英名、説明文など）をカード形式で表示
 * - 選択中（アクティブ）状態に応じたスタイリング切り替え
 * 
 * [編集・改修時の注意事項]
 * 1. 【スタイルの参照】
 *    Tailwind CSS クラスは `@/styles/cardStyles` の `CARD_STYLES` を定数参照しています。
 * ============================================================================
 */

import React from 'react';
import type { ZoneMaster } from '@/types/fish'; // AreaMaster から変更
import { CARD_STYLES } from '@/styles/cardStyles';

type Props = {
	area: ZoneMaster;
	isSelected?: boolean;
	onClickDetail: (area: ZoneMaster) => void;
};

export const AreaCard: React.FC<Props> = ({ area, isSelected, onClickDetail }) => {
	return (
		<div
			onClick={() => onClickDetail(area)}
			className={`${CARD_STYLES.base} ${isSelected ? CARD_STYLES.selected : CARD_STYLES.default
				} cursor-pointer p-4 flex flex-col justify-between`}
		>
			<div>
				<div className="flex items-center justify-between gap-2 mb-2">
					<h3
						className={`${CARD_STYLES.titleJa} ${isSelected ? 'text-cyan-300' : CARD_STYLES.titleJaDefault
							}`}
					>
						{area.ja}
					</h3>
					<span className="text-xs text-slate-400 font-mono">({area.en})</span>
				</div>

				{area.description && (
					<div className={`${CARD_STYLES.boxBlock} mt-2 text-slate-300`}>
						{area.description.split('\\n').map((line: string, index: number) => (
							<p key={index}>{line}</p>
						))}
					</div>
				)}
			</div>
		</div>
	);
};