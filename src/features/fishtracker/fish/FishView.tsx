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
 * [依存関係・関連ファイル]
 * - スタイル     : src/styles/tokens/commonTokens, layoutTokens
 * - 型定義       : src/types/fish (FishMaster, ZoneMaster, ViewMode 等), useNavigationStack (NavItem)
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レイアウト維持】 2カラム/1カラムの切り替えロジックおよびレスポンシブ用のCSSクラス指定を変更しないこと。
 * ============================================================================
 */

import { useMemo } from 'react';
import { FishCard } from './FishCard';
import { FishListItem } from '../fish/FishListItem';
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

	// 一覧選択時のハンドラ（selectFromList が無ければ replace を使用）
	const handleSelectFromList = selectFromList ?? replace;

	// チェック済み魚IDの高速判定用 Set
	const checkedSet = useMemo(() => new Set(checkedFishIds), [checkedFishIds]);

	// チェック操作ハンドラ
	const handleToggleCheck = (fishId: number) => {
		onToggleCheck(fishId);
	};

	if (fishes.length === 0) {
		return (
			<div className={LAYOUT_TOKENS.view.emptyContainer}>
				<p className={LAYOUT_TOKENS.view.emptyText}>該当する魚が見つかりませんでした。</p>
			</div>
		);
	}

	// 詳細領域が表示中かどうか
	const isSelected = current !== null;

	// 現在選択中の魚（スタックの最前面が魚の場合）
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
								onToggleCheck={handleToggleCheck}
								onClickDetail={(f) => handleSelectFromList({ type: 'fish', item: f })}
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
								onToggleCheck={handleToggleCheck}
								onClickDetail={(f) => handleSelectFromList({ type: 'fish', item: f })}
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
							isChecked={checkedSet.has(current.item.id)}
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
							allFishes={FISHES}
							regionList={REGIONS}
							checkedFishIds={checkedFishIds}
							onToggleCheck={handleToggleCheck}
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
	);
};