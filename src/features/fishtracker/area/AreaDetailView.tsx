/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/area/AreaDetailView.tsx
 * [Role] 選択されたエリアの詳細情報および釣れる魚一覧の表示コンポーネント
 * 
 * [概要]
 * - 共通ヘッダーコンポーネント（`DetailHeader`）を利用してヘッダー部分を統一
 * - ヘッダー（エリア名・共有）を固定し、コンテンツ部分全体を独立スクロール表示
 * - `regionList` から `area.regionId` に一致するリージョン情報を参照して描画
 * - 中間データ `FISH_LOCATIONS` および `SUB_LOCATIONS` を参照し、当該エリア（`area.id`）で釣れる魚をグループ化して表示
 *   1. 全域で釣れる魚（ヘッドラインなし）
 *   2. 各特定エリア（サブロケーション）とそこで釣れる魚
 * - 釣れる魚一覧の各行を統合作成した FishListItem（variant="inline"）へ置き換え
 * - 全スタイルの参照を `DETAIL_STYLES` および `COMMON_TOKENS` へ完全集約
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { MapPin, Fish, Navigation } from 'lucide-react';
import type { ZoneMaster, FishMaster, RegionMaster } from '@/types/fishtracker';
import { FISH_LOCATIONS, SUB_LOCATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { DetailHeader } from '@/features/fishtracker/common/DetailHeader';
import { FishListItem } from '@/features/fishtracker/fish/FishListItem';

type AreaDetailViewProps = {
	area: ZoneMaster;
	allFishes: FishMaster[];
	regionList: RegionMaster[];
	checkedFishIds?: number[];
	onClose: () => void;
	onBack?: () => void;
	canGoBack?: boolean;
	onToggleCheck?: (fishId: number) => void;
	onClickFishDetail?: (fish: FishMaster) => void;
};

export const AreaDetailView: React.FC<AreaDetailViewProps> = ({
	area,
	allFishes,
	regionList,
	checkedFishIds = [],
	onClose,
	onBack,
	canGoBack = false,
	onToggleCheck,
	onClickFishDetail,
}) => {
	// 当該エリアに属するサブロケーション一覧を取得
	const zoneSubLocations = useMemo(() => {
		if (!area) return [];
		return SUB_LOCATIONS.filter((sub) => sub.zoneId === area.id);
	}, [area]);

	// 「全域で釣れる魚」と「特定エリアごとに釣れる魚」にグループ化して抽出（スキル順ソート）
	const { globalFishes, subLocationGroupedFishes, totalFishCount } = useMemo(() => {
		if (!area) return { globalFishes: [], subLocationGroupedFishes: [], totalFishCount: 0 };

		const areaLocations = FISH_LOCATIONS.filter((loc) => loc.zoneId === area.id);
		const fishMap = new Map(allFishes.map((f) => [f.id, f]));

		const globalFishIds = new Set<number>();
		const subMap = new Map<number, Set<number>>();

		zoneSubLocations.forEach((sub) => {
			subMap.set(sub.id, new Set<number>());
		});

		const allMatchedFishIds = new Set<number>();

		areaLocations.forEach((loc) => {
			const fish = fishMap.get(loc.fishId);
			if (!fish) return;

			allMatchedFishIds.add(fish.id);

			if (!loc.subLocationIds || loc.subLocationIds.length === 0) {
				globalFishIds.add(fish.id);
			} else {
				loc.subLocationIds.forEach((subId) => {
					if (subMap.has(subId)) {
						subMap.get(subId)!.add(fish.id);
					}
				});
			}
		});

		const sortFish = (fishes: FishMaster[]) =>
			fishes.sort((a, b) => (a.maxSkill ?? 0) - (b.maxSkill ?? 0));

		const globalFishes = sortFish(
			Array.from(globalFishIds)
				.map((id) => fishMap.get(id)!)
				.filter(Boolean)
		);

		const subLocationGroupedFishes = zoneSubLocations.map((sub) => {
			const fishIds = subMap.get(sub.id) || new Set();
			const fishes = sortFish(
				Array.from(fishIds)
					.map((id) => fishMap.get(id)!)
					.filter(Boolean)
			);
			return {
				subLocation: sub,
				fishes,
			};
		});

		return {
			globalFishes,
			subLocationGroupedFishes,
			totalFishCount: allMatchedFishIds.size,
		};
	}, [area, allFishes, zoneSubLocations]);

	// チェック済み魚IDの高速判定用 Set
	const checkedSet = useMemo(() => new Set(checkedFishIds), [checkedFishIds]);

	// area.regionId に一致するリージョン情報を検索
	const belongsRegion = useMemo(() => {
		if (area.regionId === undefined) return undefined;
		return regionList.find(
			(r) => String(r.id) === String(area.regionId)
		);
	}, [area.regionId, regionList]);

	// 改行コードで分割した説明文行リスト
	const descriptionLines = useMemo(() => {
		if (!area.description) return [];
		return area.description.split(/\r?\n|\\n/);
	}, [area.description]);

	return (
		<div className={DETAIL_STYLES.panelBase}>
			{/* 1. 共通固定ヘッダー */}
			<DetailHeader
				titleJa={area.ja}
				titleEn={area.en}
				categoryName="エリア"
				icon={<MapPin className={`w-5 h-5 shrink-0 ${COMMON_TOKENS.entity.area.text}`} />}
				canGoBack={canGoBack}
				onBack={onBack}
				onClose={onClose}
			/>

			{/* 2. 一括スクロール可能なコンテンツ領域 */}
			<div className={DETAIL_STYLES.scrollContent}>
				{/* 所属リージョン表示 */}
				{belongsRegion && (
					<div className={DETAIL_STYLES.regionInfo}>
						<span className={DETAIL_STYLES.regionLabel}>リージョン:</span>
						<span className={DETAIL_STYLES.regionNameJa}>
							{belongsRegion.ja}
							<span className={DETAIL_STYLES.regionNameEn}>({belongsRegion.en})</span>
						</span>
					</div>
				)}

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

				{/* 釣れる魚一覧（グループ別表示） */}
				<div>
					<h3 className={`${DETAIL_STYLES.sectionTitle} flex items-center gap-2 mb-3`}>
						<Fish className={`w-4 h-4 shrink-0 ${COMMON_TOKENS.entity.fish.text}`} />
						<span>生息する魚 ({totalFishCount} 種)</span>
					</h3>

					{totalFishCount > 0 ? (
						<div className="space-y-4">
							{/* 1. 全域で釣れる魚（ヘッドラインなし） */}
							{globalFishes.length > 0 && (
								<div className={DETAIL_STYLES.relatedList}>
									{globalFishes.map((fish) => (
										<FishListItem
											key={`global-${fish.id}`}
											fish={fish}
											variant="inline"
											isChecked={checkedSet.has(fish.id)}
											onToggleCheck={onToggleCheck}
											onClickDetail={onClickFishDetail}
										/>
									))}
								</div>
							)}

							{/* 2. 特定エリア（サブロケーション）ごとの魚リスト */}
							{subLocationGroupedFishes.map(({ subLocation, fishes }) => {
								if (fishes.length === 0) return null;
								return (
									<div key={subLocation.id} className="space-y-2">
										<div className="flex items-center gap-1.5 pt-2 text-xs font-semibold text-cyan-400 border-t border-slate-800">
											<Navigation className="w-3.5 h-3.5" />
											<span>{subLocation.ja}</span>
											{subLocation.en && (
												<span className="text-slate-500 font-normal">({subLocation.en})</span>
											)}
										</div>
										<div className={DETAIL_STYLES.relatedList}>
											{fishes.map((fish) => (
												<FishListItem
													key={`sub-${subLocation.id}-${fish.id}`}
													fish={fish}
													variant="inline"
													isChecked={checkedSet.has(fish.id)}
													onToggleCheck={onToggleCheck}
													onClickDetail={onClickFishDetail}
												/>
											))}
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>このエリアで釣れる魚の情報はありません</p>
					)}
				</div>
			</div>
		</div>
	);
};