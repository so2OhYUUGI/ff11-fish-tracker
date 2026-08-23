/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/area/AreaView.tsx
 * [Role] エリア一覧表示および詳細ビュー切り替え用コンテナコンポーネント
 * 
 * [概要]
 * - エリア（ZoneMaster）を所属リージョン（RegionMaster）ごとにグループ化して表示
 * - 各リージョン内において、釣れる魚が0件のエリアを末尾にソート表示
 * - 事前計算した `fishCountMap` を `groupedAreas` および各カード/リストへ共有し走査処理を最適化
 * - `useNavigationStack`（`navStack`）の最前面データ（`current`）に基づき、詳細パネルの切り替え・スタック遷移を描画
 * - 選択状態（`current !== null`）に応じた2カラム（一覧＋詳細）レスポンシブレイアウトの制御
 * - 表示モード（`viewMode`: 'card' | 'list'）に基づく `AreaCard` / `AreaListItem` の切替描画
 * - 詳細ビュー内の魚達成チェック操作を判定・実行可能に拡張
 * - 全レイアウト・スタイルの参照を `LAYOUT_TOKENS` および `CARD_STYLES` へ集約
 * - スタック選択状態（`current`）に応じたSEOメタデータ（`<SEO />`）の動的書き換え
 * ============================================================================
 */

import { useMemo } from 'react';
import { SEO } from '@/components/SEO';
import type { ZoneMaster, FishMaster, ViewMode, RegionMaster } from '@/types/fishtracker';
import type { useNavigationStack, NavItem } from '@/hooks/useNavigationStack';
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
	navStack: ReturnType<typeof useNavigationStack> & {
		selectFromList?: (item: NavItem) => void;
	};
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
	const { current, selectFromList, push, replace, pop, clear, canGoBack } = navStack;

	// 一覧選択時のハンドラ（selectFromList が無ければ replace を使用）
	const handleSelectFromList = selectFromList ?? replace;

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

	// 詳細表示中のスタックデータに応じたSEO情報動的算出
	const detailSeo = useMemo(() => {
		if (!current) return null;

		if (current.type === 'area') {
			const area = current.item;
			return {
				title: `${area.ja} (${area.en}) の釣魚データ`,
				description: `FF11の「${area.ja}」で釣れる魚の一覧および各種攻略情報。`,
			};
		}

		if (current.type === 'fish') {
			const fish = current.item;
			const isHarakiri =
				(fish.harakiriItems && fish.harakiriItems.length > 0) ||
				Boolean(fish.harakiriTitle);

			const sizeLabel =
				fish.sizeType === 'large'
					? '大型魚'
					: fish.sizeType === 'small'
						? '小型魚'
						: '不明';

			return {
				title: `${fish.ja} (${fish.en}) - 限界スキル ${fish.maxSkill}`,
				description: `FF11の「${fish.ja}」の釣りデータ。限界スキル: ${fish.maxSkill} / サイズ: ${sizeLabel} / ハラキリ: ${isHarakiri ? '対象' : '対象外'
					}`,
			};
		}

		if (current.type === 'bait') {
			const bait = current.item;
			return {
				title: `${bait.ja} (${bait.en}) の釣魚データ`,
				description: `FF11の釣りエサ「${bait.ja}」で釣れる対象魚の一覧データ。`,
			};
		}

		return null;
	}, [current]);

	const isSelected = current !== null;

	// 現在選択中のエリア（スタックの最前面がエリアの場合）
	const selectedAreaId = current?.type === 'area' ? current.item.id : null;

	return (
		<>
			{/* 詳細表示中の場合は詳細用のSEOメタデータで上書き */}
			{detailSeo && (
				<SEO title={detailSeo.title} description={detailSeo.description} />
			)}

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
												fishes={allFishes}
												isSelected={selectedAreaId === area.id}
												onClickDetail={(a) => handleSelectFromList({ type: 'area', item: a })}
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
												fishCount={fishCountMap.get(area.id) || 0}
												isSelected={selectedAreaId === area.id}
												onClickDetail={(a) => handleSelectFromList({ type: 'area', item: a })}
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
		</>
	);
};