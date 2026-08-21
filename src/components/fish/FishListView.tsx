/**
 * ============================================================================
 * [FilePath] src/components/fish/FishListView.tsx
 * [Role] 魚一覧／詳細ビューのレスポンシブレイアウト制御コンポーネント
 * 
 * [概要]
 * - 魚カード一覧（FishCard / FishListItem）と各種詳細ビュー（Fish/Area/Bait）の2カラム／単一表示制御
 * - `useNavigationStack`（`navStack`）の最前面データ（`current`）に基づき、詳細パネルの切り替え・スタック遷移を描画
 * - モバイルおよびデスクトップ（sticky追従）でのレスポンシブ切り替え
 * - 詳細表示領域に画面高に応じた上限サイズ（calc）と独立スクロール領域を設定
 * ============================================================================
 */

import { FishCard } from '@/components/fish/FishCard';
import { FishListItem } from '@/components/fish/FishListItem';
import { FishDetailView } from '@/components/fish/FishDetailView';
import { AreaDetailView } from '@/components/area/AreaDetailView';
import { BaitDetailView } from '@/components/bait/BaitDetailView';
import { BAITS, ZONES } from '@/data';
import type { FishMaster, ViewMode, ZoneMaster } from '@/types/fish';
import type { useNavigationStack } from '@/hooks/useNavigationStack';

type Props = {
	fishes: FishMaster[];
	zones: ZoneMaster[];
	checkedFishIds: number[];
	viewMode: ViewMode;
	onToggleCheck: (fishId: number) => void;
	navStack: ReturnType<typeof useNavigationStack>;
};

export const FishListView = ({
	fishes,
	zones,
	checkedFishIds,
	viewMode,
	onToggleCheck,
	navStack,
}: Props) => {
	const { current, push, pop, clear, canGoBack } = navStack;

	// チェック操作ハンドラ
	const handleToggleCheck = (fishId: number) => {
		onToggleCheck(fishId);
	};

	// 閉じるボタン押下時の制御（スタックが残っていれば1つ戻り、無ければクリア）
	const handleCloseDetail = () => {
		if (canGoBack) {
			pop();
		} else {
			clear();
		}
	};

	if (fishes.length === 0) {
		return (
			<div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-800">
				<p className="text-slate-400 text-sm">該当する魚が見つかりませんでした。</p>
			</div>
		);
	}

	// 詳細領域が表示中かどうか
	const isSelected = current !== null;

	// 現在選択中の魚（スタックの最前面が魚の場合）
	const selectedFishId = current?.type === 'fish' ? current.item.id : null;

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
								isSelected={selectedFishId === fish.id}
								onToggleCheck={handleToggleCheck}
								onClickDetail={(f) => push({ type: 'fish', item: f })}
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
								isSelected={selectedFishId === fish.id}
								onToggleCheck={handleToggleCheck}
								onClickDetail={(f) => push({ type: 'fish', item: f })}
							/>
						))}
					</div>
				)}
			</div>

			{/* 右側：詳細表示領域（スタックの型に応じて動的切り替え） */}
			{isSelected && (
				<div className="lg:col-span-5 lg:sticky lg:top-[160px] w-full max-h-[calc(100vh-180px)] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
					{current.type === 'fish' && (
						<FishDetailView
							fish={current.item}
							zones={zones}
							isChecked={checkedFishIds.includes(current.item.id)}
							onToggleCheck={handleToggleCheck}
							onClose={handleCloseDetail}
							onClickAreaDetail={(area) => push({ type: 'area', item: area })}
							onClickBaitDetail={(bait) => push({ type: 'bait', item: bait })}
						/>
					)}

					{current.type === 'area' && (
						<AreaDetailView
							area={current.item}
							allFishes={fishes}
							regionList={[]}
							onClose={handleCloseDetail}
							onClickFishDetail={(fish) => push({ type: 'fish', item: fish })}
						/>
					)}

					{current.type === 'bait' && (
						<BaitDetailView
							bait={current.item}
							allFishes={fishes}
							onClose={handleCloseDetail}
							onClickFishDetail={(fish) => push({ type: 'fish', item: fish })}
						/>
					)}
				</div>
			)}
		</div>
	);
};