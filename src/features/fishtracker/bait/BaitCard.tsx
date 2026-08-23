/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/bait/BaitCard.tsx
 * [Role] 餌データ（個別）のカード表示コンポーネント
 * 
 * [概要]
 * - 餌の基本情報（和名、英名、説明文）のカード形式表示
 * - `AreaCard` と統一されたカードレイアウト（上段:名称 / 中段:説明文 / 下段:対象魚）
 * - 該当の餌で釣れる魚の抽出および上限数制限付きタグ表示（上位表示＋残り件数バッジ）
 * - 全スタイルの参照を `CARD_STYLES` および `COMMON_TOKENS` へ完全移行
 * - キーボード操作時のアクセシビリティ対応を追加
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { Fish } from 'lucide-react';
import type { BaitMaster, FishMaster } from '@/types/fishtracker';
import { FISH_BAIT_RELATIONS, FISHES } from '@/data';
import { CARD_STYLES } from '@/styles/components/cardStyles';

type BaitCardProps = {
	bait: BaitMaster;
	fishes?: FishMaster[];
	isSelected?: boolean;
	onClickDetail: (bait: BaitMaster) => void;
};

export const BaitCard: React.FC<BaitCardProps> = ({
	bait,
	fishes = FISHES,
	isSelected = false,
	onClickDetail,
}) => {
	// 該当する餌 (bait.id) で釣れる魚の一覧を算出（重複排除・メモ化）
	const matchedFishes = useMemo(() => {
		const uniqueFishIds = new Set(
			FISH_BAIT_RELATIONS
				.filter((rel) => rel.baitId === bait.id)
				.map((rel) => rel.fishId)
		);
		return fishes.filter((fish) => uniqueFishIds.has(fish.id));
	}, [bait.id, fishes]);

	const totalFishes = matchedFishes.length;

	// カード表示用：最大2件を表示、溢れた分は +N 表示
	const maxDisplayCount = 2;
	const displayFishes = useMemo(
		() => matchedFishes.slice(0, maxDisplayCount),
		[matchedFishes]
	);
	const remainingCount = totalFishes - maxDisplayCount;

	// 改行コード（\n および \n）で分割した説明文行リスト
	const descriptionLines = useMemo(() => {
		if (!bait.description) return [];
		return bait.description.split(/\r?\n|\\n/);
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
			className={`${CARD_STYLES.base} ${isSelected ? CARD_STYLES.selected : CARD_STYLES.default
				} ${CARD_STYLES.cardWrapper}`}
		>
			<div>
				{/* 1. 名称表示領域（日本語名・英語名の縦並び） */}
				<div className={CARD_STYLES.titleGroup}>
					<h3
						className={`truncate ${CARD_STYLES.titleJa} ${isSelected ? CARD_STYLES.titleJaSelectedBait : CARD_STYLES.titleJaDefault
							}`}
					>
						{bait.ja}
					</h3>
					<span className={`truncate ${CARD_STYLES.titleEnSub}`}>
						{bait.en}
					</span>
				</div>

				{/* 2. 説明文領域 */}
				{descriptionLines.length > 0 && (
					<div className={CARD_STYLES.descriptionBox}>
						{descriptionLines.map((line: string, index: number) => (
							<p key={index}>{line}</p>
						))}
					</div>
				)}

				{/* 3. 釣れる魚の表示領域 */}
				<div className={CARD_STYLES.targetLabelGroup}>
					<div className={CARD_STYLES.targetLabel}>
						<Fish className="w-3.5 h-3.5 text-slate-400 shrink-0" />
						<span>対象の魚 ({totalFishes}):</span>
					</div>

					{totalFishes > 0 ? (
						<div className={CARD_STYLES.tagContainer}>
							{displayFishes.map((fish) => (
								<span
									key={fish.id}
									className={CARD_STYLES.tagItem}
									title={fish.ja}
								>
									{fish.ja}
								</span>
							))}
							{remainingCount > 0 && (
								<span
									className={CARD_STYLES.tagOverflow}
									title={`他 ${remainingCount} 種類`}
								>
									+{remainingCount}
								</span>
							)}
						</div>
					) : (
						<span className={CARD_STYLES.tagEmpty}>情報なし</span>
					)}
				</div>
			</div>
		</div>
	);
};