/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/bait/BaitView.tsx
 * [Role] 餌一覧表示および詳細ビュー切り替え用コンテナコンポーネント（URL/JSネイティブ遷移対応版）
 * ============================================================================
 */

import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { BaitMaster, FishMaster, ViewMode, ZoneMaster } from '@/types/';
import { BaitCard } from './BaitCard';
import { BaitListItem } from './BaitListItem';
import { BaitDetailView } from './BaitDetailView';
import { FishDetailView } from '../fish/FishDetailView';
import { AreaDetailView } from '../area/AreaDetailView';
import { REGIONS, ZONES, FISHES, BAITS, FISH_BAIT_RELATIONS } from '@/data';
import { findBySlug } from '@/utils/slug';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import type { TrackerNavStack } from '../FishTrackerContent';

type BaitViewProps = {
	baits: BaitMaster[];
	allFishes: FishMaster[];
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

export const BaitView = ({
	baits,
	allFishes,
	checkedFishIds,
	viewMode,
	onToggleCheck,
	navStack,
}: BaitViewProps) => {
	const { slug } = useParams<{ type?: string; slug?: string }>();
	const { selectFromList, push, pop, clear, canGoBack } = navStack;

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

	// 餌IDごとの釣れる魚の総数をあらかじめ一元算出
	const fishCountMap = useMemo(() => {
		const map = new Map<number, number>();
		const baitFishMap = new Map<number, Set<number>>();

		FISH_BAIT_RELATIONS.forEach((rel) => {
			if (!baitFishMap.has(rel.baitId)) {
				baitFishMap.set(rel.baitId, new Set());
			}
			baitFishMap.get(rel.baitId)?.add(rel.fishId);
		});

		baitFishMap.forEach((fishSet, baitId) => {
			map.set(baitId, fishSet.size);
		});

		return map;
	}, []);

	const isSelected = currentItem !== null;

	useScrollLock(isSelected);

	if (baits.length === 0) {
		return (
			<div className={LAYOUT_TOKENS.view.emptyContainer}>
				<p className={LAYOUT_TOKENS.view.emptyText}>該当する餌が見つかりませんでした。</p>
			</div>
		);
	}

	const selectedBaitId = currentItem?.type === 'bait' ? currentItem.item.id : null;

	return (
		<div className={LAYOUT_TOKENS.view.mainGrid}>
			{/* 左側：一覧表示領域 */}
			<div className={LAYOUT_TOKENS.view.leftColumn(isSelected)}>
				{viewMode === 'card' ? (
					<div className={LAYOUT_TOKENS.view.cardGrid(isSelected)}>
						{baits.map((bait) => (
							<BaitCard
								key={bait.id}
								bait={bait}
								fishes={allFishes}
								isSelected={selectedBaitId === bait.id}
								onClickDetail={(b) => selectFromList({ type: 'bait', item: b })}
							/>
						))}
					</div>
				) : (
					<div className={LAYOUT_TOKENS.view.flexColGap2}>
						{baits.map((bait) => (
							<BaitListItem
								key={bait.id}
								bait={bait}
								fishCount={fishCountMap.get(bait.id) || 0}
								isSelected={selectedBaitId === bait.id}
								onClickDetail={(b) => selectFromList({ type: 'bait', item: b })}
							/>
						))}
					</div>
				)}
			</div>

			{/* 右側：詳細表示領域（URL/slugに応じて切替） */}
			{isSelected && currentItem && (
				<div className={LAYOUT_TOKENS.sidebar.stickyContainer}>
					{currentItem.type === 'bait' && (
						<BaitDetailView
							bait={currentItem.item}
							allFishes={allFishes}
							checkedFishIds={checkedFishIds}
							onToggleCheck={onToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={canGoBack}
							onClickFishDetail={(fish: FishMaster) => push({ type: 'fish', item: fish })}
						/>
					)}

					{currentItem.type === 'fish' && (
						<FishDetailView
							fish={currentItem.item}
							zones={ZONES}
							isChecked={checkedSet.has(currentItem.item.id)}
							onToggleCheck={onToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={canGoBack}
							onClickAreaDetail={(area: ZoneMaster) => push({ type: 'area', item: area })}
							onClickBaitDetail={(bait: BaitMaster) => push({ type: 'bait', item: bait })}
						/>
					)}

					{currentItem.type === 'area' && (
						<AreaDetailView
							area={currentItem.item}
							allFishes={allFishes}
							regionList={REGIONS}
							checkedFishIds={checkedFishIds}
							onToggleCheck={onToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={canGoBack}
							onClickFishDetail={(fish: FishMaster) => push({ type: 'fish', item: fish })}
						/>
					)}
				</div>
			)}
		</div>
	);
};