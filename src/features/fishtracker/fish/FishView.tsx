/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/fish/FishView.tsx
 * [Role] 魚一覧／詳細ビューのレスポンシブレイアウト制御コンポーネント（URL/JSネイティブ遷移対応版）
 * ============================================================================
 */

import { useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FishCard } from './FishCard';
import { FishListItem } from './FishListItem';
import { FishDetailView } from './FishDetailView';
import { AreaDetailView } from '../area/AreaDetailView';
import { BaitDetailView } from '../bait/BaitDetailView';
import type { FishMaster, ViewMode, ZoneMaster, BaitMaster } from '@/types/fishtracker';
import { FISHES, ZONES, BAITS, REGIONS } from '@/data';
import { findBySlug } from '@/utils/slug';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import type { TrackerNavStack } from '../FishTrackerContent';

type FishViewProps = {
	fishes: FishMaster[];
	zones: ZoneMaster[];
	checkedFishIds: number[];
	viewMode: ViewMode;
	onToggleCheck: (fishId: number) => void;
	navStack: TrackerNavStack;
};

type CurrentItem =
	| { type: 'fish'; item: FishMaster }
	| { type: 'area'; item: ZoneMaster }
	| { type: 'bait'; item: BaitMaster }
	| null;

/**
 * モバイル（1024px未満）で詳細画面表示時に背面スクロールをロックするカスタムフック
 */
const useScrollLock = (isLocked: boolean) => {
	useEffect(() => {
		const handleScrollLock = () => {
			const isMobile = window.innerWidth < 1024;
			if (isLocked && isMobile) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		};

		handleScrollLock();
		window.addEventListener('resize', handleScrollLock);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('resize', handleScrollLock);
		};
	}, [isLocked]);
};

export const FishView = ({
	fishes,
	zones,
	checkedFishIds,
	viewMode,
	onToggleCheck,
	navStack,
}: FishViewProps) => {
	const { slug } = useParams<{ type?: string; slug?: string }>();
	const { selectFromList, clear, pop, push } = navStack;

	const currentItem: CurrentItem = useMemo(() => {
		if (!slug) return null;
		const fish = findBySlug(FISHES, slug);
		if (fish) return { type: 'fish', item: fish };

		const area = findBySlug(ZONES, slug);
		if (area) return { type: 'area', item: area };

		const bait = findBySlug(BAITS, slug);
		if (bait) return { type: 'bait', item: bait };

		return null;
	}, [slug]);

	const checkedSet = useMemo(
		() => new Set(checkedFishIds),
		[checkedFishIds]
	);

	const isSelected = currentItem !== null;

	useScrollLock(isSelected);

	const handleSelectFish = useCallback(
		(fish: FishMaster) => {
			selectFromList({ type: 'fish', item: fish });
		},
		[selectFromList]
	);

	if (fishes.length === 0) {
		return (
			<div className={LAYOUT_TOKENS.view.emptyContainer}>
				<p className={LAYOUT_TOKENS.view.emptyText}>該当する魚が見つかりませんでした。</p>
			</div>
		);
	}

	const selectedFishId = currentItem?.type === 'fish' ? currentItem.item.id : null;

	return (
		<div className={LAYOUT_TOKENS.view.mainGrid}>
			{/* 左側：一覧表示領域 */}
			<div className={LAYOUT_TOKENS.view.leftColumn(isSelected)}>
				{viewMode === 'card' ? (
					<div className={LAYOUT_TOKENS.view.cardGrid(isSelected)}>
						{fishes.map((fish) => (
							<FishCard
								key={fish.id}
								fish={fish}
								zones={zones}
								isChecked={checkedSet.has(fish.id)}
								isSelected={selectedFishId === fish.id}
								onToggleCheck={onToggleCheck}
								onClickDetail={handleSelectFish}
							/>
						))}
					</div>
				) : (
					<div className={LAYOUT_TOKENS.view.flexColGap2}>
						{fishes.map((fish) => (
							<FishListItem
								key={fish.id}
								fish={fish}
								zones={zones}
								isChecked={checkedSet.has(fish.id)}
								isSelected={selectedFishId === fish.id}
								onToggleCheck={onToggleCheck}
								onClickDetail={handleSelectFish}
							/>
						))}
					</div>
				)}
			</div>

			{/* 右側：詳細表示領域 */}
			{isSelected && currentItem && (
				<div className={LAYOUT_TOKENS.sidebar.stickyContainer}>
					{currentItem.type === 'fish' && (
						<FishDetailView
							fish={currentItem.item}
							zones={zones}
							isChecked={checkedSet.has(currentItem.item.id)}
							onToggleCheck={onToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={navStack.canGoBack}
							onClickAreaDetail={(area: ZoneMaster) => push({ type: 'area', item: area })}
							onClickBaitDetail={(bait: BaitMaster) => push({ type: 'bait', item: bait })}
						/>
					)}

					{currentItem.type === 'area' && (
						<AreaDetailView
							area={currentItem.item}
							allFishes={FISHES}
							regionList={REGIONS}
							checkedFishIds={checkedFishIds}
							onToggleCheck={onToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={navStack.canGoBack}
							onClickFishDetail={(fish: FishMaster) => push({ type: 'fish', item: fish })}
						/>
					)}

					{currentItem.type === 'bait' && (
						<BaitDetailView
							bait={currentItem.item}
							allFishes={FISHES}
							checkedFishIds={checkedFishIds}
							onToggleCheck={onToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={navStack.canGoBack}
							onClickFishDetail={(fish: FishMaster) => push({ type: 'fish', item: fish })}
						/>
					)}
				</div>
			)}
		</div>
	);
};