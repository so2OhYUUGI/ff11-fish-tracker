/**
 * ============================================================================
 * [FilePath] src/components/bait/BaitListView.tsx
 * [Role] 餌一覧表示および詳細ビュー切り替え用コンテナコンポーネント
 * 
 * [概要]
 * - 選択状態（`selectedBait`）に応じた2カラム（一覧＋詳細）レスポンシブレイアウトの制御
 * - 表示モード（`viewMode`: 'card' | 'list'）に基づく `BaitCard` / `BaitListItem` の切替描画
 * - モバイル表示時の画面切替（一覧/詳細）およびPC表示時の `sticky` 追従レイアウト制御
 * 
 * [編集・改修時の注意事項]
 * 1. 【レスポンシブレイアウト】
 *    詳細表示選択時（`isSelected === true`）、モバイル環境（`lg` 未満）では一覧を非表示 (`hidden`) にし、
 *    `BaitDetailView` のみを全幅で表示するレスポンシブ仕様になっています。
 * ============================================================================
 */

import { useState } from 'react';
import type { BaitMaster, FishMaster, ViewMode } from '@/types/fish';
import { BaitCard } from './BaitCard';
import { BaitListItem } from './BaitListItem';
import { BaitDetailView } from './BaitDetailView';

type Props = {
	baits: BaitMaster[];
	allFishes: FishMaster[];
	viewMode: ViewMode;
};

export const BaitListView = ({ baits, allFishes, viewMode }: Props) => {
	const [selectedBait, setSelectedBait] = useState<BaitMaster | null>(null);

	// 選択中のアイテムが存在するかどうか
	const isSelected = selectedBait !== null;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
			{/* 
        左側：一覧表示領域
        - 未選択時: lg:col-span-12（全幅）
        - 選択中: lg:col-span-7（7列）
        - モバイル時: 詳細選択中なら非表示（hidden）
      */}
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
						{baits.map((bait) => (
							<BaitCard
								key={bait.id}
								bait={bait}
								onClickDetail={setSelectedBait}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{baits.map((bait) => (
							<BaitListItem
								key={bait.id}
								bait={bait}
								isSelected={selectedBait?.id === bait.id}
								onClickDetail={setSelectedBait}
							/>
						))}
					</div>
				)}
			</div>

			{/* 
        右側：詳細表示領域
        - 選択中のみ表示（isSelected === true）
        - PC画面（lg）: 5列を使用し sticky で追従
      */}
			{isSelected && (
				<div className="lg:col-span-5 lg:sticky lg:top-[160px] w-full">
					<BaitDetailView
						bait={selectedBait}
						allFishes={allFishes}
						onClose={() => setSelectedBait(null)}
					/>
				</div>
			)}
		</div>
	);
};