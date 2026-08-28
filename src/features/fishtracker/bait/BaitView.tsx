/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/bait/BaitView.tsx
 * [Role] 餌一覧表示および詳細ビュー切り替え用コンテナコンポーネント（URL/JSネイティブ遷移対応版）
 * ============================================================================
 */

import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { BaitMaster, FishMaster, ViewMode } from '@/types/fishtracker';
import { BaitCard } from './BaitCard';
import { BaitListItem } from './BaitListItem';
import { BaitDetailView } from './BaitDetailView';
import { FishDetailView } from '../fish/FishDetailView';
import { AreaDetailView } from '../area/AreaDetailView';
import { REGIONS, ZONES, FISHES, BAITS, FISH_BAIT_RELATIONS } from '@/data';
import { findBySlug } from '@/utils/slug';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import type { TrackerNavStack } from '../FishTrackerContent';

type Props = {
	baits: BaitMaster[];
	allFishes: FishMaster[];
	checkedFishIds: number[];
	viewMode: ViewMode;
	onToggleCheck: (fishId: number) => void;
	navStack: TrackerNavStack;
};

export const BaitView = ({
	baits,
	allFishes,
	checkedFishIds,
	viewMode,
	onToggleCheck,
	navStack,
}: Props) => {
	const { slug } = useParams<{ type?: string; slug?: string }>();
	const { selectFromList, push, pop, clear, canGoBack } = navStack;

	const currentItem = useMemo(() => {
		if (!slug) return null;
		const fish = findBySlug(FISHES, slug);
		if (fish) return { type: 'fish' as const, item: fish };

		const area = findBySlug(ZONES, slug);
		if (area) return { type: 'area' as const, item: area };

		const bait = findBySlug(BAITS, slug);
		if (bait) return { type: 'bait' as const, item: bait };

		return null;
	}, [slug]);

	// チェック操作ハンドラ
	const handleToggleCheck = (fishId: number) => {
		onToggleCheck(fishId);
	};

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

	// 選択中のアイテムが存在するかどうか
	const isSelected = currentItem !== null;

	// lg (1024px) 未満のモバイル表示時、詳細オープン中は body スクロールをロック
	useEffect(() => {
		const isMobile = window.innerWidth < 1024;

		if (isSelected && isMobile) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [isSelected]);

	if (baits.length === 0) {
		return (
			<div className={LAYOUT_TOKENS.view.emptyContainer}>
				<p className={LAYOUT_TOKENS.view.emptyText}>該当する餌が見つかりませんでした。</p>
			</div>
		);
	}

	// 現在選択中の餌
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
							onToggleCheck={handleToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={canGoBack}
							onClickFishDetail={(fish) => push({ type: 'fish', item: fish })}
						/>
					)}

					{currentItem.type === 'fish' && (
						<FishDetailView
							fish={currentItem.item}
							zones={ZONES}
							isChecked={checkedFishIds.includes(currentItem.item.id)}
							onToggleCheck={handleToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={canGoBack}
							onClickAreaDetail={(area) => push({ type: 'area', item: area })}
							onClickBaitDetail={(bait) => push({ type: 'bait', item: bait })}
						/>
					)}

					{currentItem.type === 'area' && (
						<AreaDetailView
							area={currentItem.item}
							allFishes={allFishes}
							regionList={REGIONS}
							checkedFishIds={checkedFishIds}
							onToggleCheck={handleToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={canGoBack}
							onClickFishDetail={(fish) => push({ type: 'fish', item: fish })}
						/>
					)}
				</div>
			)}
		</div>
	);
};