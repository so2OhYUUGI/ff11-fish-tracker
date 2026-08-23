/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/bait/BaitDetailView.tsx
 * [Role] 餌の詳細情報表示コンポーネント
 * 
 * [概要]
 * - ヘッダー（餌名・共有）を固定し、コンテンツ部分全体を独立スクロール表示
 * - `@/data` の中間マスタを参照し、その餌で釣れる魚の一覧を抽出・描画
 * - 釣れる魚一覧の各行を統合作成した FishListItem（variant="inline"）へ置き換え
 * - 全スタイルの参照を `DETAIL_STYLES` および `COMMON_TOKENS` へ完全集約
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { ArrowLeft, Utensils, Fish, X } from 'lucide-react';
import type { BaitMaster, FishMaster } from '@/types/fishtracker';
import { FISH_BAIT_RELATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { FishListItem } from '@/features/fishtracker/fish/FishListItem';
import { ShareDetailButton } from '@/components/common/ShareDetailButton';

type BaitDetailViewProps = {
	bait: BaitMaster | null;
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
	const targetFishes = useMemo(() => {
		if (!bait) return [];
		const targetFishIds = new Set(
			FISH_BAIT_RELATIONS
				.filter((rel) => rel.baitId === bait.id)
				.map((rel) => rel.fishId)
		);
		return allFishes.filter((fish) => targetFishIds.has(fish.id));
	}, [bait, allFishes]);

	if (!bait) {
		return (
			<div className={DETAIL_STYLES.emptyDetailContainer}>
				<Utensils className={DETAIL_STYLES.emptyIcon} />
				<p className={DETAIL_STYLES.emptyText}>リストから餌を選択すると詳細が表示されます</p>
			</div>
		);
	}

	return (
		<div className={DETAIL_STYLES.panelBase}>
			{/* 1. 固定ヘッダー領域 */}
			<div className={DETAIL_STYLES.stickyHeader}>
				{/* 左側：戻るボタン ＋ タイトル */}
				<div className={DETAIL_STYLES.stickyHeaderLeft}>
					{canGoBack && onBack && (
						<button
							type="button"
							onClick={onBack}
							className={DETAIL_STYLES.headerBackButton}
							title="前の画面へ戻る"
							aria-label="前の画面へ戻る"
						>
							<ArrowLeft className="w-4 h-4 shrink-0" />
							<span>戻る</span>
						</button>
					)}
					<div className={DETAIL_STYLES.stickyHeaderTitleGroup}>
						<Utensils className={`w-5 h-5 shrink-0 ${COMMON_TOKENS.entity.bait.text}`} />
						<div className="min-w-0 flex-1">
							<h2 className={DETAIL_STYLES.stickyHeaderTitle}>
								{bait.ja}
							</h2>
							<p className={DETAIL_STYLES.stickyHeaderSubTitle}>
								{bait.en}
							</p>
						</div>
					</div>
				</div>

				{/* 右側：共有ボタン ＋ 閉じるボタン */}
				<div className={DETAIL_STYLES.stickyHeaderRight}>
					<ShareDetailButton
						categoryName="エサ"
						nameJa={bait.ja}
						nameEn={bait.en}
					/>
					<button
						type="button"
						onClick={onClose}
						title="詳細を閉じる"
						aria-label="詳細を閉じる"
						className={DETAIL_STYLES.iconCloseButton}
					>
						<X className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* 2. 一括スクロール可能なコンテンツ領域 */}
			<div className={DETAIL_STYLES.scrollContent}>
				{/* 説明文 */}
				{bait.description && (
					<div className={DETAIL_STYLES.descriptionBox}>
						{bait.description.split(/\r?\n|\\n/).map((line, index) => (
							<React.Fragment key={`${index}-${line.slice(0, 10)}`}>
								{index > 0 && <br />}
								{line}
							</React.Fragment>
						))}
					</div>
				)}

				{/* 釣れる魚一覧 */}
				<div>
					<h3 className={`${DETAIL_STYLES.sectionTitle} flex items-center gap-2`}>
						<Fish className={`w-4 h-4 shrink-0 ${COMMON_TOKENS.entity.fish.text}`} />
						<span>対象の魚 ({targetFishes.length} 種)</span>
					</h3>

					{targetFishes.length > 0 ? (
						<div className={DETAIL_STYLES.relatedList}>
							{targetFishes.map((fish) => (
								<FishListItem
									key={fish.id}
									fish={fish}
									variant="inline"
									isChecked={checkedFishIds.includes(fish.id)}
									onToggleCheck={onToggleCheck}
									onClickDetail={onClickFishDetail}
								/>
							))}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>対象の魚データがありません</p>
					)}
				</div>
			</div>
		</div>
	);
};