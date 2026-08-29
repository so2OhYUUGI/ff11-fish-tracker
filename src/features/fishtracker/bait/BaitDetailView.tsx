/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/bait/BaitDetailView.tsx
 * [Role] 餌詳細情報表示コンポーネント
 * 
 * [概要]
 * - 共通ヘッダーコンポーネント（`DetailHeader`）を利用してヘッダー部分を統一
 * - ヘッダー（餌名・システム属性）を固定し、コンテンツ部分全体を独立スクロール表示
 * - 該当する餌で釣れる魚一覧（釣獲チェック状態、スキル上限、サイズ区分）を表示
 * - 魚タグ・カードクリックによる魚詳細画面（`FishDetailView`）への相互遷移サポート
 * - 説明文（`description`）の表示
 * - 全スタイルの参照を `DETAIL_STYLES` / `DETAIL_TABLE_STYLES` および `COMMON_TOKENS` へ完全移行
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { Utensils, Fish } from 'lucide-react';
import type { BaitMaster, FishMaster } from '@/types/fishtracker';
import { FISH_BAIT_RELATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { DetailHeader } from '@/features/fishtracker/common/DetailHeader';
import { FishListItem } from '@/features/fishtracker/fish/FishListItem';

type BaitDetailViewProps = {
	bait: BaitMaster;
	allFishes: FishMaster[];
	checkedFishIds?: number[];
	onClose: () => void;
	onBack?: () => void;
	canGoBack?: boolean;
	onToggleCheck?: (fishId: number) => void;
	onClickFishDetail?: (fish: FishMaster) => void;
};

export const BaitDetailView: React.FC<BaitDetailViewProps> = ({
	bait,
	allFishes,
	checkedFishIds = [],
	onClose,
	onBack,
	canGoBack = false,
	onToggleCheck,
	onClickFishDetail,
}) => {
	const checkedSet = useMemo(() => new Set(checkedFishIds), [checkedFishIds]);

	// 1. この餌で釣れる魚の抽出とスキル順ソート（メモ化）
	const targetFishes = useMemo(() => {
		const targetFishIds = new Set(
			FISH_BAIT_RELATIONS
				.filter((rel) => rel.baitId === bait.id)
				.map((rel) => rel.fishId)
		);
		const fishes = allFishes.filter((fish) => targetFishIds.has(fish.id));
		return [...fishes].sort((a, b) => (a.maxSkill ?? 0) - (b.maxSkill ?? 0));
	}, [bait.id, allFishes]);

	// 2. 改行コード（\n および \\n）で分割した説明文行リスト
	const descriptionLines = useMemo(() => {
		if (!bait.description) return [];
		return bait.description.split(/\r?\n|\\n/);
	}, [bait.description]);

	return (
		<div className={DETAIL_STYLES.panelBase}>
			{/* 1. 共通固定ヘッダー */}
			<DetailHeader
				titleJa={bait.ja}
				titleEn={bait.en}
				categoryName="餌"
				icon={<Utensils className={`w-5 h-5 shrink-0 ${COMMON_TOKENS.entity.bait.text}`} />}
				canGoBack={canGoBack}
				onBack={onBack}
				onClose={onClose}
			/>

			{/* 2. 一括スクロール可能なコンテンツ領域 */}
			<div className={DETAIL_STYLES.scrollContent}>
				{/* 説明文 */}
				{descriptionLines.length > 0 && (
					<div className={DETAIL_STYLES.descriptionBox}>
						{descriptionLines.map((line, index) => (
							<React.Fragment key={`${index}-${line.slice(0, 10)}`}>
								{index > 0 && <br />}
								{line}
							</React.Fragment>
						))}
					</div>
				)}

				{/* 釣れる魚一覧 */}
				<div>
					<h3 className={`${DETAIL_STYLES.sectionTitle} flex items-center gap-2 mb-3`}>
						<Fish className={`w-4 h-4 shrink-0 ${COMMON_TOKENS.entity.fish.text}`} />
						<span>釣れる魚 ({targetFishes.length} 種)</span>
					</h3>

					{targetFishes.length > 0 ? (
						<div className={DETAIL_STYLES.relatedList}>
							{targetFishes.map((fish) => (
								<FishListItem
									key={`bait-fish-${fish.id}`}
									fish={fish}
									variant="inline"
									isChecked={checkedSet.has(fish.id)}
									onToggleCheck={onToggleCheck}
									onClickDetail={onClickFishDetail}
								/>
							))}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>この餌で釣れる魚のデータがありません</p>
					)}
				</div>
			</div>
		</div>
	);
};