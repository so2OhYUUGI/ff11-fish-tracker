/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/fish/FishView.tsx
 * [Role] 魚一覧／詳細ビューのレスポンシブレイアウト制御コンポーネント
 * 
 * [概要]
 * - 魚カード一覧（FishCard / FishListItem）と各種詳細ビュー（Fish/Area/Bait）の2カラム／単一表示制御
 * - `useNavigationStack`（`navStack`）の最前面データ（`current`）に基づき、詳細パネルの切り替え・スタック遷移を描画
 * - モバイルおよびデスクトップ（sticky追従）でのレスポンシブ切り替え
 * - 詳細表示領域に画面高に応じた上限サイズ（calc）と独立スクロール領域を設定
 * 
 * [調整内容]
 * - スクロールロック制御を宣言的な処理へ変更し、フラグ管理を廃止
 * - リスト選択ハンドラーを useCallback でメモ化
 * ============================================================================
 */

import { useEffect, useMemo, useCallback } from 'react';
import { FishCard } from './FishCard';
import { FishListItem } from './FishListItem';
import { FishDetailView } from './FishDetailView';
import { AreaDetailView } from '../area/AreaDetailView';
import { BaitDetailView } from '../bait/BaitDetailView';
import type { FishMaster, ViewMode, ZoneMaster } from '@/types/fishtracker';
import type { useNavigationStack, NavItem } from '@/hooks/useNavigationStack';
import { FISHES, REGIONS } from '@/data';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

type Props = {
	fishes: FishMaster[];
	zones: ZoneMaster[];
	checkedFishIds: number[];
	viewMode: ViewMode;
	onToggleCheck: (fishId: number) => void;
	navStack: ReturnType<typeof useNavigationStack> & {
		selectFromList?: (item: NavItem) => void;
	};
};

export const FishView = ({
	fishes,
	zones,
	checkedFishIds,
	viewMode,
	onToggleCheck,
	navStack,
}: Props) => {
	const { current, selectFromList, replace, push, pop, clear, canGoBack } = navStack;

	const handleSelectFromList = selectFromList ?? replace;

	const checkedSet = useMemo(
		() => new Set(checkedFishIds),
		[checkedFishIds]
	);

	const isSelected = current !== null;

	const handleSelectFish = useCallback(
		(fish: FishMaster) => {
			handleSelectFromList({ type: 'fish', item: fish });
		},
		[handleSelectFromList]
	);

	useEffect(() => {
		const handleScrollLock = () => {
			const isMobile = window.innerWidth < 1024;
			if (isSelected && isMobile) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		};

		handleScrollLock();
		window.addEventListener('resize', handleScrollLock);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('resize', handleScrollLock);
		};
	}, [isSelected]);

	if (fishes.length === 0) {
		return (
			<div className={LAYOUT_TOKENS.view.emptyContainer}>
				<p className={LAYOUT_TOKENS.view.emptyText}>該当する魚が見つかりませんでした。</p>
			</div>
		);
	}

	const selectedFishId = current?.type === 'fish' ? current.item.id : null;

	return (
		<div className={LAYOUT_TOKENS.view.mainGrid}>
			{/* 左側：一覧表示領域 */}
			<div className={LAYOUT_TOKENS.view.leftColumn(isSelected)}>
				{viewMode === 'card' ? (
					<div className={LAYOUT_TOKENS.view.cardGrid(isSelected)}>
						{fishes.map((fish) => (
							<FishCard
								key={fish.id}
								fish={fish}
								zones={zones}
								isChecked={checkedSet.has(fish.id)}
								isSelected={selectedFishId === fish.id}
								onToggleCheck={onToggleCheck}
								onClickDetail={handleSelectFish}
							/>
						))}
					</div>
				) : (
					<div className={LAYOUT_TOKENS.view.listContainer}>
						{fishes.map((fish) => (
							<FishListItem
								key={fish.id}
								fish={fish}
								zones={zones}
								isChecked={checkedSet.has(fish.id)}
								isSelected={selectedFishId === fish.id}
								onToggleCheck={onToggleCheck}
								onClickDetail={handleSelectFish}
							/>
						))}
					</div>
				)}
			</div>

			{/* 右側：詳細表示領域 */}
			{isSelected && (
				<div className={LAYOUT_TOKENS.sidebar.stickyContainer}>
					{current.type === 'fish' && (
						<FishDetailView
							fish={current.item}
							zones={zones}
							isChecked={checkedSet.has(current.item.id)}
							onToggleCheck={onToggleCheck}
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
							allFishes={FISHES}
							regionList={REGIONS}
							checkedFishIds={checkedFishIds}
							onToggleCheck={onToggleCheck}
							onClose={clear}
							onBack={pop}
							canGoBack={canGoBack}
							onClickFishDetail={(fish) => push({ type: 'fish', item: fish })}
						/>
					)}

					{current.type === 'bait' && (
						<BaitDetailView
							bait={current.item}
							allFishes={FISHES}
							checkedFishIds={checkedFishIds}
							onToggleCheck={onToggleCheck}
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