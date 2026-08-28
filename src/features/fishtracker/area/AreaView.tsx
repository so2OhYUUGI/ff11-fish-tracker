/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/area/AreaView.tsx
 * [Role] エリア一覧表示および詳細ビュー切り替え用コンテナコンポーネント（URL/JSネイティブ遷移対応版）
 * ============================================================================
 */

import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { ZoneMaster, FishMaster, ViewMode, RegionMaster } from '@/types/fishtracker';
import { REGIONS, ZONES, FISHES, BAITS, FISH_LOCATIONS } from '@/data/';
import { findBySlug } from '@/utils/slug';
import { AreaCard } from './AreaCard';
import { AreaListItem } from './AreaListItem';
import { AreaDetailView } from './AreaDetailView';
import { FishDetailView } from '../fish/FishDetailView';
import { BaitDetailView } from '../bait/BaitDetailView';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import { CARD_STYLES } from '@/styles/components/cardStyles';
import type { TrackerNavStack } from '../FishTrackerContent';

type Props = {
	areas: ZoneMaster[];
	allFishes: FishMaster[];
	checkedFishIds: number[];
	viewMode: ViewMode;
	onToggleCheck: (fishId: number) => void;
	navStack: TrackerNavStack;
};

type RegionGroup = {
	region: RegionMaster;
	areas: ZoneMaster[];
};

export const AreaView = ({
	areas,
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

	// エリアIDごとの釣れる魚の総数をあらかじめ一元算出
	const fishCountMap = useMemo(() => {
		const map = new Map<number, number>();
		areas.forEach((area) => {
			const targetFishIds = FISH_LOCATIONS
				.filter((loc) => loc.zoneId === area.id)
				.map((loc) => loc.fishId);
			const uniqueFishCount = new Set(targetFishIds).size;
			map.set(area.id, uniqueFishCount);
		});
		return map;
	}, [areas]);

	// リージョンごとにエリアをグループ化＆各リージョン内で魚0件エリアを末尾にソート
	const groupedAreas = useMemo(() => {
		const groups: RegionGroup[] = [];

		REGIONS.forEach((region) => {
			const regionAreas = areas.filter(
				(a) => a.regionId !== undefined && String(a.regionId) === String(region.id)
			);

			if (regionAreas.length > 0) {
				// リージョン内で「魚がいるエリア(>0)」を前に、「0件のエリア」を後ろへソート
				const sortedRegionAreas = [...regionAreas].sort((a, b) => {
					const countA = fishCountMap.get(a.id) || 0;
					const countB = fishCountMap.get(b.id) || 0;

					const hasFishA = countA > 0 ? 1 : 0;
					const hasFishB = countB > 0 ? 1 : 0;

					if (hasFishA !== hasFishB) {
						return hasFishB - hasFishA; // 魚あり(1)を優先
					}

					return 0; // 同条件同士は元の並びを維持
				});

				groups.push({
					region,
					areas: sortedRegionAreas,
				});
			}
		});

		return groups;
	}, [areas, fishCountMap]);

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

	// 現在選択中のエリア
	const selectedAreaId = currentItem?.type === 'area' ? currentItem.item.id : null;

	return (
		<div className={LAYOUT_TOKENS.view.mainGrid}>
			{/* 左側：一覧表示領域 */}
			<div className={LAYOUT_TOKENS.view.leftColumn(isSelected)}>
				<div className={LAYOUT_TOKENS.view.flexColGap6}>
					{groupedAreas.map((group) => (
						<div key={group.region.id} className={LAYOUT_TOKENS.view.flexColGap2}>
							{/* リージョン見出し */}
							<div className={CARD_STYLES.sectionHeader.container}>
								<span className={CARD_STYLES.sectionHeader.titleJa}>
									{group.region.ja}
								</span>
								<span className={CARD_STYLES.sectionHeader.titleEn}>
									({group.region.en})
								</span>
								<span className={CARD_STYLES.sectionHeader.countBadge}>
									{group.areas.length} 件
								</span>
							</div>

							{/* カード表示モード */}
							{viewMode === 'card' ? (
								<div className={LAYOUT_TOKENS.view.cardGrid(isSelected)}>
									{group.areas.map((area) => (
										<AreaCard
											key={area.id}
											area={area}
											fishes={allFishes}
											isSelected={selectedAreaId === area.id}
											onClickDetail={(a) => selectFromList({ type: 'area', item: a })}
										/>
									))}
								</div>
							) : (
								/* リスト表示モード */
								<div className={LAYOUT_TOKENS.view.flexColGap2}>
									{group.areas.map((area) => (
										<AreaListItem
											key={area.id}
											area={area}
											fishCount={fishCountMap.get(area.id) || 0}
											isSelected={selectedAreaId === area.id}
											onClickDetail={(a) => selectFromList({ type: 'area', item: a })}
										/>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* 右側：詳細表示領域（URL/slugに応じて切替） */}
			{isSelected && currentItem && (
				<div className={LAYOUT_TOKENS.sidebar.stickyContainer}>
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
				</div>
			)}
		</div>
	);
};