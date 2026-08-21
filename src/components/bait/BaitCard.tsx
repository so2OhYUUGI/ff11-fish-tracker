/**
 * ============================================================================
 * [FilePath] src/components/bait/BaitCard.tsx
 * [Role] 餌データ（個別）のカード表示コンポーネント
 * 
 * [概要]
 * - 餌の基本情報（和名、英名、説明文）のカード形式表示
 * - 餌名称の日本語と英語を明示的に改行して視認性と統一感を確保
 * - 選択状態（`isSelected`）に応じたカード枠線・背景のハイライト表示切り替え
 * - 改行コード（\n）を含む説明文の複数行レンダリング対応
 * 
 * [編集・改修時の注意事項]
 * 1. 【スタイルの参照】
 *    Tailwind CSS クラスは `@/styles/cardStyles` の `CARD_STYLES` を定数参照しています。
 * ============================================================================
 */

import React from 'react';
import type { BaitMaster } from '@/types/fish';
import { CARD_STYLES } from '@/styles/cardStyles';

type BaitCardProps = {
	bait: BaitMaster;
	isSelected?: boolean;
	onClickDetail: (bait: BaitMaster) => void;
};

export const BaitCard: React.FC<BaitCardProps> = ({
	bait,
	isSelected = false,
	onClickDetail,
}) => {
	return (
		<div
			className={`${CARD_STYLES.base} ${isSelected ? CARD_STYLES.selected : CARD_STYLES.default
				}`}
			onClick={() => onClickDetail(bait)}
		>
			<div>
				{/* 日本語名と英語名を明確に縦並び（改行）へ変更 */}
				<div className="flex flex-col min-w-0">
					<h3
						className={`truncate ${CARD_STYLES.titleJa} ${isSelected ? 'text-cyan-300' : 'text-slate-100'
							}`}
					>
						{bait.ja}
					</h3>
					<span
						className={`truncate text-xs font-normal mt-0.5 ${isSelected ? 'text-cyan-300/80' : 'text-slate-400'
							} ${CARD_STYLES.titleEn}`}
					>
						{bait.en}
					</span>
				</div>

				{bait.description && (
					<div className={`mt-3 ${CARD_STYLES.boxBlock}`}>
						{bait.description.split('\\n').map((line, index) => (
							<span key={index} className="block">
								{line}
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
};