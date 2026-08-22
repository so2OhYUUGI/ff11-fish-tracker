/**
 * ============================================================================
 * [FilePath] src/components/bait/BaitListView.tsx
 * [Role] 餌一覧表示および詳細ビュー切り替え用コンテナコンポーネント
 * 
 * [概要]
 * - `useNavigationStack`（`navStack`）の最前面データ（`current`）に基づき、詳細パネルの切り替え・スタック遷移を描画
 * - 表示モード（`viewMode`: 'card' | 'list'）に基づく `BaitCard` / `BaitListItem` の切替描画
 * - モバイル表示時の画面切替（一覧/詳細）およびPC表示時の `sticky` 追従レイアウト制御
 * - スタイル記述はすべて `LAYOUT_TOKENS` へ完全集約済み
 * ============================================================================
 */

import type { BaitMaster, FishMaster, ViewMode } from '@/types/fish';
import type { useNavigationStack } from '@/hooks/useNavigationStack';
import { BaitCard } from './BaitCard';
import { BaitListItem } from './BaitListItem';
import { BaitDetailView } from './BaitDetailView';
import { FishDetailView } from '@/components/fish/FishDetailView';
import { AreaDetailView } from '@/components/area/AreaDetailView';
import { REGIONS, ZONES } from '@/data';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

type Props = {
	baits: BaitMaster[];
	allFishes: FishMaster[];
	viewMode: ViewMode;
	navStack: ReturnType<typeof useNavigationStack>;
};

export const BaitListView = ({
	baits,
	allFishes,
	viewMode,
	navStack,
}: Props) => {
	const { current, push, replace, pop, clear, canGoBack } = navStack;

	if (baits.length === 0) {
		return (
			<div className={LAYOUT_TOKENS.view.emptyContainer}>
				<p className={LAYOUT_TOKENS.view.emptyText}>該当する餌が見つかりませんでした。</p>
			</div>
		);
	}

	// 選択中のアイテムが存在するかどうか
	const isSelected = current !== null;

	// 現在選択中の餌（スタックの最前面が餌の場合）
	const selectedBaitId = current?.type === 'bait' ? current.item.id : null;

	return (
		<div className={LAYOUT_TOKENS.view.mainGrid}>
			{/* 左側：一覧表示領域 */}
			<div className={LAYOUT_TOKENS.view.leftColumn(isSelected)}>
				{viewMode === 'card' ? (
					<div className={LAYOUT_TOKENS.view.cardGrid(isSelected)}>
						{baits.map((bait) => (
							<BaitCard
								key={bait.id}
								bait={bait}
								isSelected={selectedBaitId === bait.id}
								onClickDetail={(b) => replace({ type: 'bait', item: b })}
							/>
						))}
					</div>
				) : (
					<div className={LAYOUT_TOKENS.view.listContainer}>
						{baits.map((bait) => (
							<BaitListItem
								key={bait.id}
								bait={bait}
								isSelected={selectedBaitId === bait.id}
								onClickDetail={(b) => replace({ type: 'bait', item: b })}
							/>
						))}
					</div>
				)}
			</div>

			{/* 右側：詳細表示領域（スタックに応じて切替） */}
			{isSelected && (
				<div className={LAYOUT_TOKENS.sidebar.stickyContainer}>
					{current.type === 'bait' && (
						<BaitDetailView
							bait={current.item}
							allFishes={allFishes}
							onClose={clear}
							onBack={pop}
							canGoBack={canGoBack}
							onClickFishDetail={(fish) => push({ type: 'fish', item: fish })}
						/>
					)}

					{current.type === 'fish' && (
						<FishDetailView
							fish={current.item}
							zones={ZONES}
							isChecked={false}
							onToggleCheck={() => { }}
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
							allFishes={allFishes}
							regionList={REGIONS}
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