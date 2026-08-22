/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/area/AreaView.tsx
 * [Role] エリア一覧表示および詳細ビュー切り替え用コンテナコンポーネント
 * 
 * [概要]
 * - エリア（ZoneMaster）を所属リージョン（RegionMaster）ごとにグループ化して表示
 * - 各リージョン内において、釣れる魚が0件のエリアを末尾にソート表示
 * - `useNavigationStack`（`navStack`）の最前面データ（`current`）に基づき、詳細パネルの切り替え・スタック遷移を描画
 * - 選択状態（`current !== null`）に応じた2カラム（一覧＋詳細）レスポンシブレイアウトの制御
 * - 表示モード（`viewMode`: 'card' | 'list'）に基づく `AreaCard` / `AreaListItem` の切替描画
 * - 詳細ビュー内の魚達成チェック操作を判定・実行可能に拡張
 * - 全レイアウト・スタイルの参照を `LAYOUT_TOKENS` および `CARD_STYLES` へ集約
 * ============================================================================
 */

import { useMemo } from 'react';
import type { ZoneMaster, FishMaster, ViewMode, RegionMaster } from '@/types/fishtracker';
import type { useNavigationStack } from '@/hooks/useNavigationStack';
import { REGIONS, ZONES, FISH_LOCATIONS } from '@/data/';
import { AreaCard } from './AreaCard';
import { AreaListItem } from './AreaListItem';
import { AreaDetailView } from './AreaDetailView';
import { FishDetailView } from '../fish/FishDetailView';
import { BaitDetailView } from '../bait/BaitDetailView';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import { CARD_STYLES } from '@/styles/components/cardStyles';

type Props = {
	areas: ZoneMaster[];
	allFishes: FishMaster[];
	checkedFishIds: number[];
	viewMode: ViewMode;
	onToggleCheck: (fishId: number) => void;
	navStack: ReturnType<typeof useNavigationStack>;
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
	const { current, push, replace, pop, clear, canGoBack } = navStack;

	// チェック操作ハンドラ
	const handleToggleCheck = (fishId: number) => {
		onToggleCheck(fishId);
	};

	// リージョンごとにエリアをグループ化＆各リージョン内で魚0件エリアを末尾にソート
	const groupedAreas = useMemo(() => {
		const groups: RegionGroup[] = [];

		// エリアIDごとの釣れる魚の総数をあらかじめ算出
		const fishCountMap = new Map<number, number>();
		areas.forEach((area) => {
			const targetFishIds = FISH_LOCATIONS
				.filter((loc) => loc.zoneId === area.id)
				.map((loc) => loc.fishId);
			const uniqueFishCount = new Set(targetFishIds).size;
			fishCountMap.set(area.id, uniqueFishCount);
		});

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
	}, [areas]);

	const isSelected = current !== null;

	// 現在選択中のエリア（スタックの最前面がエリアの場合）
	const selectedAreaId = current?.type === 'area' ? current.item.id : null;

	return (
		<div className={LAYOUT_TOKENS.view.mainGrid}>
			{/* 左側：一覧表示領域 */}
			<div className={LAYOUT_TOKENS.view.leftColumn(isSelected)}>
				<div className={LAYOUT_TOKENS.view.groupListContainer}>
					{groupedAreas.map((group) => (
						<div key={group.region.id} className={LAYOUT_TOKENS.view.sectionGroup}>
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
											isSelected={selectedAreaId === area.id}
											onClickDetail={(a) => replace({ type: 'area', item: a })}
										/>
									))}
								</div>
							) : (
								/* リスト表示モード */
								<div className={LAYOUT_TOKENS.view.listContainer}>
									{group.areas.map((area) => (
										<AreaListItem
											key={area.id}
											area={area}
											isSelected={selectedAreaId === area.id}
											onClickDetail={(a) => replace({ type: 'area', item: a })}
										/>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* 右側：詳細表示領域 */}
			{isSelected && (
				<div className={LAYOUT_TOKENS.sidebar.stickyContainer}>
					{current.type === 'area' && (
						<AreaDetailView
							area={current.item}
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

					{current.type === 'fish' && (
						<FishDetailView
							fish={current.item}
							zones={ZONES}
							isChecked={checkedFishIds.includes(current.item.id)}
							onToggleCheck={handleToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={canGoBack}
							onClickAreaDetail={(area) => push({ type: 'area', item: area })}
							onClickBaitDetail={(bait) => push({ type: 'bait', item: bait })}
						/>
					)}

					{current.type === 'bait' && (
						<BaitDetailView
							bait={current.item}
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