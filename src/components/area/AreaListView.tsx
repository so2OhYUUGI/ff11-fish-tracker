/**
 * ============================================================================
 * [FilePath] src/components/area/AreaListView.tsx
 * [Role] エリア一覧表示および詳細ビュー切り替え用コンテナコンポーネント
 * 
 * [概要]
 * - エリア（ZoneMaster）を所属リージョン（RegionMaster）ごとにグループ化して表示
 * - リージョン設定のないエリアは一覧から除外
 * - 選択状態（`selectedArea`）に応じた2カラム（一覧＋詳細）レスポンシブレイアウトの制御
 * - 表示モード（`viewMode`: 'card' | 'list'）に基づく `AreaCard` / `AreaListItem` の切替描画
 * - 型不一致（number/string）を安全に変換してグループ化処理を実行
 * ============================================================================
 */

import { useState, useMemo } from 'react';
import type { ZoneMaster, FishMaster, ViewMode, RegionMaster } from '@/types/fish';
import { REGIONS } from '@/data/';
import { AreaCard } from './AreaCard';
import { AreaListItem } from './AreaListItem';
import { AreaDetailView } from './AreaDetailView';

type Props = {
	areas: ZoneMaster[];
	allFishes: FishMaster[];
	viewMode: ViewMode;
};

type RegionGroup = {
	region: RegionMaster;
	areas: ZoneMaster[];
};

export const AreaListView = ({ areas, allFishes, viewMode }: Props) => {
	const [selectedArea, setSelectedArea] = useState<ZoneMaster | null>(null);

	// リージョンごとにエリアをグループ化（リージョン未設定のエリアは除外）
	const groupedAreas = useMemo(() => {
		const groups: RegionGroup[] = [];

		// REGIONS の定義順に該当するエリアを割り当て
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

	const isSelected = selectedArea !== null;

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
											isSelected={selectedArea?.id === area.id}
											onClickDetail={setSelectedArea}
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
											isSelected={selectedArea?.id === area.id}
											onClickDetail={setSelectedArea}
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
				<div className="lg:col-span-5 lg:sticky lg:top-[160px] w-full max-h-[calc(100vh-180px)] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
					<AreaDetailView
						area={selectedArea}
						allFishes={allFishes}
						regionList={REGIONS}
						onClose={() => setSelectedArea(null)}
					/>
				</div>
			)}
		</div>
	);
};