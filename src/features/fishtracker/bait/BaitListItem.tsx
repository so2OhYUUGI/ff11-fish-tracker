/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/bait/BaitListItem.tsx
 * [Role] 餌データ（個別）のリスト表示コンポーネント
 * 
 * [概要]
 * - 餌の基本情報（和名、英名、簡略説明文）のリスト形式（高密度レイアウト）表示
 * - 餌名称（縦並び）、説明文（中央横並び）、釣れる魚の総数バッジ（右端）を配置
 * - 親から受け取った `fishCount`（釣れる魚の件数）をバッジ描画
 * - 全スタイルの参照を `LIST_STYLES` / `COMMON_TOKENS` へ完全移行
 * - アクセシビリティ（キーボード操作対応）の強化
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { Fish } from 'lucide-react';
import type { BaitMaster } from '@/types/fishtracker';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';

type Props = {
	bait: BaitMaster;
	fishCount?: number;
	isSelected?: boolean;
	onClickDetail: (bait: BaitMaster) => void;
};

export const BaitListItem: React.FC<Props> = ({
	bait,
	fishCount = 0,
	isSelected,
	onClickDetail,
}) => {
	// 説明文の改行エスケープ（\n または \\n をスペース1つに置換）
	const formattedDescription = useMemo(() => {
		if (!bait.description) return null;
		return bait.description.replace(/\r?\n|\\n/g, ' ');
	}, [bait.description]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClickDetail(bait);
		}
	};

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={() => onClickDetail(bait)}
			onKeyDown={handleKeyDown}
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
				<span>{fishCount}</span>
			</div>
		</div>
	);
};