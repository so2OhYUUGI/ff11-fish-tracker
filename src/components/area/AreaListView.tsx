/**
 * ============================================================================
 * [FilePath] src/components/area/AreaListView.tsx
 * [Role] エリア一覧表示および詳細ビュー切り替え用コンテナコンポーネント
 * 
 * [概要]
 * - エリア（ZoneMaster）を所属リージョン（RegionMaster）ごとにグループ化して表示
 * - `useNavigationStack`（`navStack`）の最前面データ（`current`）に基づき、詳細パネルの切り替え・スタック遷移を描達
 * - 選択状態（`current !== null`）に応じた2カラム（一覧＋詳細）レスポンシブレイアウトの制御
 * - 表示モード（`viewMode`: 'card' | 'list'）に基づく `AreaCard` / `AreaListItem` の切替描画
 * - 詳細表示領域に画面高に応じた上限サイズ（calc）と独立スクロール領域を設定
 * ============================================================================
 */

import { useMemo } from 'react';
import type { ZoneMaster, FishMaster, ViewMode, RegionMaster } from '@/types/fish';
import type { useNavigationStack } from '@/hooks/useNavigationStack';
import { REGIONS, ZONES } from '@/data/';
import { AreaCard } from './AreaCard';
import { AreaListItem } from './AreaListItem';
import { AreaDetailView } from './AreaDetailView';
import { FishDetailView } from '@/components/fish/FishDetailView';
import { BaitDetailView } from '@/components/bait/BaitDetailView';

type Props = {
	areas: ZoneMaster[];
	allFishes: FishMaster[];
	viewMode: ViewMode;
	navStack: ReturnType<typeof useNavigationStack>;
};

type RegionGroup = {
	region: RegionMaster;
	areas: ZoneMaster[];
};

export const AreaListView = ({
	areas,
	allFishes,
	viewMode,
	navStack,
}: Props) => {
	const { current, push, pop, clear, canGoBack } = navStack;

	// 閉じるボタン押下時の制御（スタックが残っていれば1つ戻り、無ければクリア）
	const handleCloseDetail = () => {
		if (canGoBack) {
			pop();
		} else {
			clear();
		}
	};

	// リージョンごとにエリアをグループ化（リージョン未設定のエリアは除外）
	const groupedAreas = useMemo(() => {
		const groups: RegionGroup[] = [];

		REGIONS.forEach((region) => {
			const regionAreas = areas.filter(
				(a) => a.regionId !== undefined && String(a.regionId) === String(region.id)
			);

			if (regionAreas.length > 0) {
				groups.push({
					region,
					areas: regionAreas,
				});
			}
		});

		return groups;
	}, [areas]);

	const isSelected = current !== null;

	// 現在選択中のエリア（スタックの最前面がエリアの場合）
	const selectedAreaId = current?.type === 'area' ? current.item.id : null;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
			{/* 左側：一覧表示領域 */}
			<div
				className={`${isSelected ? 'lg:col-span-7' : 'lg:col-span-12'
					} ${isSelected ? 'hidden lg:block' : 'block'}`}
			>
				<div className="flex flex-col gap-6">
					{groupedAreas.map((group) => (
						<div key={group.region.id} className="flex flex-col gap-2">
							{/* リージョン見出し */}
							<div className="flex items-center gap-2 border-b border-slate-700/80 pb-1.5 px-1">
								<span className="text-sm font-bold text-cyan-400">
									{group.region.ja}
								</span>
								<span className="text-xs text-slate-400 font-mono">
									({group.region.en})
								</span>
								<span className="text-xs text-slate-500 ml-auto font-mono">
									{group.areas.length} 件
								</span>
							</div>

							{/* カード表示モード */}
							{viewMode === 'card' ? (
								<div
									className={`grid grid-cols-1 gap-3 ${isSelected
										? 'sm:grid-cols-2 md:grid-cols-3'
										: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
										}`}
								>
									{group.areas.map((area) => (
										<AreaCard
											key={area.id}
											area={area}
											isSelected={selectedAreaId === area.id}
											onClickDetail={(a) => push({ type: 'area', item: a })}
										/>
									))}
								</div>
							) : (
								/* リスト表示モード */
								<div className="flex flex-col gap-2">
									{group.areas.map((area) => (
										<AreaListItem
											key={area.id}
											area={area}
											isSelected={selectedAreaId === area.id}
											onClickDetail={(a) => push({ type: 'area', item: a })}
										/>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* 右側：詳細表示領域（スタックの型に応じて動的にコンテンツを切り替え） */}
			{isSelected && (
				<div className="lg:col-span-5 lg:sticky lg:top-[160px] w-full max-h-[calc(100vh-180px)] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
					{current.type === 'area' && (
						<AreaDetailView
							area={current.item}
							allFishes={allFishes}
							regionList={REGIONS}
							onClose={handleCloseDetail}
							onClickFishDetail={(fish) => push({ type: 'fish', item: fish })}
						/>
					)}

					{current.type === 'fish' && (
						<FishDetailView
							fish={current.item}
							zones={ZONES}
							isChecked={false}
							onToggleCheck={() => { }}
							onClose={handleCloseDetail}
							onClickAreaDetail={(area) => push({ type: 'area', item: area })}
							onClickBaitDetail={(bait) => push({ type: 'bait', item: bait })}
						/>
					)}

					{current.type === 'bait' && (
						<BaitDetailView
							bait={current.item}
							allFishes={allFishes}
							onClose={handleCloseDetail}
							onClickFishDetail={(fish) => push({ type: 'fish', item: fish })}
						/>
					)}
				</div>
			)}
		</div>
	);
};