/**
 * ============================================================================
 * [FilePath] src/components/area/AreaListView.tsx
 * [Role] エリア一覧表示および詳細ビュー切り替え用コンテナコンポーネント
 * 
 * [概要]
 * - 選択状態（`selectedArea`）に応じた2カラム（一覧＋詳細）レスポンシブレイアウトの制御
 * - 表示モード（`viewMode`: 'card' | 'list'）に基づく `AreaCard` / `AreaListItem` の切替描画
 * - モバイル表示時の画面切替（一覧/詳細）およびPC表示時の `sticky` 追従レイアウト制御
 * 
 * [編集・改修時の注意事項]
 * 1. 【レスポンシブレイアウト】
 *    詳細表示選択時（`isSelected === true`）、モバイル環境（`lg` 未満）では一覧を非表示 (`hidden`) にし、
 *    `AreaDetailView` のみを全幅で表示するレスポンシブ仕様になっています。
 * ============================================================================
 */

import { useState } from 'react';
import type { ZoneMaster, FishMaster, ViewMode } from '@/types/fish';
import { REGIONS } from '@/data/';
import { AreaCard } from './AreaCard';
import { AreaListItem } from './AreaListItem';
import { AreaDetailView } from './AreaDetailView';

type Props = {
	areas: ZoneMaster[];
	allFishes: FishMaster[];
	viewMode: ViewMode;
};

export const AreaListView = ({ areas, allFishes, viewMode }: Props) => {
	const [selectedArea, setSelectedArea] = useState<ZoneMaster | null>(null);

	// 選択中のアイテムが存在するかどうか
	const isSelected = selectedArea !== null;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
			{/* 左側：一覧表示領域 */}
			<div
				className={`${isSelected ? 'lg:col-span-7' : 'lg:col-span-12'
					} ${isSelected ? 'hidden lg:block' : 'block'}`}
			>
				{viewMode === 'card' ? (
					<div
						className={`grid grid-cols-1 gap-3 ${isSelected
							? 'sm:grid-cols-2 md:grid-cols-3'
							: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
							}`}
					>
						{areas.map((area) => (
							<AreaCard
								key={area.id}
								area={area}
								isSelected={selectedArea?.id === area.id}
								onClickDetail={setSelectedArea}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{areas.map((area) => (
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

			{/* 右側：詳細表示領域 */}
			{isSelected && (
				<div className="lg:col-span-5 lg:sticky lg:top-[160px] w-full">
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