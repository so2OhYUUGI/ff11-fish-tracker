/**
 * ============================================================================
 * [FilePath] src/components/fish/FishListView.tsx
 * [Role] 魚一覧／詳細ビューのレスポンシブレイアウト制御コンポーネント
 * 
 * [概要]
 * - 魚カード一覧（FishCard / FishListItem）と詳細（FishDetailView）の2カラム／単一表示制御
 * - モバイルおよびデスクトップ（sticky追従）でのレスポンシブ切り替え
 * - 詳細表示領域に画面高に応じた上限サイズ（calc）と独立スクロール領域を設定
 * ============================================================================
 */

import { useState } from 'react';
import { FishCard } from '@/components/fish/FishCard';
import { FishListItem } from '@/components/fish/FishListItem';
import { FishDetailView } from '@/components/fish/FishDetailView';
import type { FishMaster, ViewMode, ZoneMaster } from '@/types/fish';

type Props = {
	fishes: FishMaster[];
	zones: ZoneMaster[];
	checkedFishIds: number[];
	viewMode: ViewMode;
	onToggleCheck: (fishId: number) => void;
};

export const FishListView = ({
	fishes,
	zones,
	checkedFishIds,
	viewMode,
	onToggleCheck,
}: Props) => {
	const [selectedFish, setSelectedFish] = useState<FishMaster | null>(null);

	// チェック操作ハンドラ（詳細画面表示中なら詳細対象もその魚に切り替える）
	const handleToggleCheck = (fishId: number) => {
		onToggleCheck(fishId);

		if (selectedFish !== null) {
			const targetFish = fishes.find((f) => f.id === fishId);
			if (targetFish) {
				setSelectedFish(targetFish);
			}
		}
	};

	if (fishes.length === 0) {
		return (
			<div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-800">
				<p className="text-slate-400 text-sm">該当する魚が見つかりませんでした。</p>
			</div>
		);
	}

	// 選択中のアイテムが存在するかどうか
	const isSelected = selectedFish !== null;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
			{/* 左側：一覧表示領域 */}
			<div
				className={`${isSelected ? 'lg:col-span-7' : 'lg:col-span-12'
					} ${isSelected ? 'hidden lg:block' : 'block'}`}
			>
				{viewMode === 'card' ? (
					<div
						className={`grid grid-cols-1 gap-4 ${isSelected
								? 'sm:grid-cols-2 md:grid-cols-3'
								: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
							}`}
					>
						{fishes.map((fish) => (
							<FishCard
								key={fish.id}
								fish={fish}
								zones={zones}
								isChecked={checkedFishIds.includes(fish.id)}
								isSelected={selectedFish?.id === fish.id}
								onToggleCheck={handleToggleCheck}
								onClickDetail={setSelectedFish}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{fishes.map((fish) => (
							<FishListItem
								key={fish.id}
								fish={fish}
								zones={zones}
								isChecked={checkedFishIds.includes(fish.id)}
								isSelected={selectedFish?.id === fish.id}
								onToggleCheck={handleToggleCheck}
								onClickDetail={setSelectedFish}
							/>
						))}
					</div>
				)}
			</div>

			{/* 右側：詳細表示領域（画面高に合わせた独立スクロール領域を設定） */}
			{isSelected && (
				<div className="lg:col-span-5 lg:sticky lg:top-[160px] w-full max-h-[calc(100vh-180px)] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
					<FishDetailView
						fish={selectedFish}
						zones={zones}
						isChecked={checkedFishIds.includes(selectedFish.id)}
						onToggleCheck={handleToggleCheck}
						onClose={() => setSelectedFish(null)}
					/>
				</div>
			)}
		</div>
	);
};