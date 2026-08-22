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

import { FishCard } from '../fish/FishCard';
import { FishListItem } from '../fish/FishListItem';
import { FishDetailView } from '../fish/FishDetailView';
import { AreaDetailView } from '../area/AreaDetailView';
import { BaitDetailView } from '../bait/BaitDetailView';
import type { FishMaster, ViewMode, ZoneMaster } from '@/types/fish';
import type { useNavigationStack } from '@/hooks/useNavigationStack';
import { REGIONS } from '@/data';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

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
	const { current, push, replace, pop, clear, canGoBack } = navStack;

	// チェック操作ハンドラ
	const handleToggleCheck = (fishId: number) => {
		onToggleCheck(fishId);
	};

	if (fishes.length === 0) {
		return (
			<div className={`text-center py-12 ${COMMON_TOKENS.box.dark}`}>
				<p className={`${COMMON_TOKENS.color.textMuted} text-sm`}>該当する魚が見つかりませんでした。</p>
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
								onClickDetail={(f) => replace({ type: 'fish', item: f })}
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
								onClickDetail={(f) => replace({ type: 'fish', item: f })}
							/>
						))}
					</div>
				)}
			</div>

			{/* 右側：詳細表示領域（スタックの型に応じて動的切り替え） */}
			{isSelected && (
				<div className={LAYOUT_TOKENS.sidebar.stickyContainer}>
					{current.type === 'fish' && (
						<FishDetailView
							fish={current.item}
							zones={zones}
							isChecked={checkedFishIds.includes(current.item.id)}
							onToggleCheck={handleToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={canGoBack}
							onClickAreaDetail={(area) => push({ type: 'area', item: area })}
							onClickBaitDetail={(bait) => push({ type: 'bait', item: bait })}
						/>
					)}

					{current.type === 'area' && (
						<AreaDetailView
							area={current.item}
							allFishes={fishes}
							regionList={REGIONS}
							onClose={clear}
							onBack={pop}
							canGoBack={canGoBack}
							onClickFishDetail={(fish) => push({ type: 'fish', item: fish })}
						/>
					)}

					{current.type === 'bait' && (
						<BaitDetailView
							bait={current.item}
							allFishes={fishes}
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