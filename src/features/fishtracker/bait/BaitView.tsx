/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/bait/BaitView.tsx
 * [Role] 餌一覧表示および詳細ビュー切り替え用コンテナコンポーネント
 * 
 * [概要]
 * - `useNavigationStack`（`navStack`）の最前面データ（`current`）に基づき、詳細パネルの切り替え・スタック遷移を描画
 * - 事前計算した `fishCountMap` をコンポーネント間で共有し、走査処理を最適化
 * - 表示モード（`viewMode`: 'card' | 'list'）に基づく `BaitCard` / `BaitListItem` の切替描画
 * - モバイル表示時の画面切替（一覧/詳細）およびPC表示時の `sticky` 追従レイアウト制御
 * - 詳細ビュー内の魚達成チェック操作を判定・実行可能に拡張
 * - スタイル記述はすべて `LAYOUT_TOKENS` へ完全集約済み
 * - スタック選択状態（`current`）に応じたSEOメタデータ（`<SEO />`）の動的書き換え
 * ============================================================================
 */

import { useMemo } from 'react';
import { SEO } from '@/components/SEO';
import type { BaitMaster, FishMaster, ViewMode } from '@/types/fish';
import type { useNavigationStack, NavItem } from '@/hooks/useNavigationStack';
import { BaitCard } from './BaitCard';
import { BaitListItem } from './BaitListItem';
import { BaitDetailView } from './BaitDetailView';
import { FishDetailView } from '../fish/FishDetailView';
import { AreaDetailView } from '../area/AreaDetailView';
import { REGIONS, ZONES, FISH_BAIT_RELATIONS } from '@/data';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

type Props = {
	baits: BaitMaster[];
	allFishes: FishMaster[];
	checkedFishIds: number[];
	viewMode: ViewMode;
	onToggleCheck: (fishId: number) => void;
	navStack: ReturnType<typeof useNavigationStack> & {
		selectFromList?: (item: NavItem) => void;
	};
};

export const BaitView = ({
	baits,
	allFishes,
	checkedFishIds,
	viewMode,
	onToggleCheck,
	navStack,
}: Props) => {
	const { current, selectFromList, push, replace, pop, clear, canGoBack } = navStack;

	// 一覧選択時のハンドラ（selectFromList が無ければ replace を使用）
	const handleSelectFromList = selectFromList ?? replace;

	// チェック操作ハンドラ
	const handleToggleCheck = (fishId: number) => {
		onToggleCheck(fishId);
	};

	// 餌IDごとの釣れる魚の総数をあらかじめ一元算出
	const fishCountMap = useMemo(() => {
		const map = new Map<number, number>();
		const baitFishMap = new Map<number, Set<number>>();

		FISH_BAIT_RELATIONS.forEach((rel) => {
			if (!baitFishMap.has(rel.baitId)) {
				baitFishMap.set(rel.baitId, new Set());
			}
			baitFishMap.get(rel.baitId)?.add(rel.fishId);
		});

		baitFishMap.forEach((fishSet, baitId) => {
			map.set(baitId, fishSet.size);
		});

		return map;
	}, []);

	// 詳細表示中のスタックデータに応じたSEO情報動的算出
	const detailSeo = useMemo(() => {
		if (!current) return null;

		if (current.type === 'bait') {
			const bait = current.item;
			return {
				title: `${bait.ja} (${bait.en}) の釣魚データ`,
				description: `FF11の釣りエサ「${bait.ja}」で釣れる対象魚の一覧データ。`,
			};
		}

		if (current.type === 'fish') {
			const fish = current.item;
			const isHarakiri =
				(fish.harakiriItems && fish.harakiriItems.length > 0) ||
				Boolean(fish.harakiriTitle);

			const sizeLabel =
				fish.sizeType === 'large'
					? '大型魚'
					: fish.sizeType === 'small'
						? '小型魚'
						: '不明';

			return {
				title: `${fish.ja} (${fish.en}) - 限界スキル ${fish.maxSkill}`,
				description: `FF11の「${fish.ja}」の釣りデータ。限界スキル: ${fish.maxSkill} / サイズ: ${sizeLabel} / ハラキリ: ${isHarakiri ? '対象' : '対象外'
					}`,
			};
		}

		if (current.type === 'area') {
			const area = current.item;
			return {
				title: `${area.ja} (${area.en}) の釣魚データ`,
				description: `FF11の「${area.ja}」で釣れる魚の一覧および各種攻略情報。`,
			};
		}

		return null;
	}, [current]);

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
		<>
			{/* 詳細表示中の場合は詳細用のSEOメタデータで上書き */}
			{detailSeo && (
				<SEO title={detailSeo.title} description={detailSeo.description} />
			)}

			<div className={LAYOUT_TOKENS.view.mainGrid}>
				{/* 左側：一覧表示領域 */}
				<div className={LAYOUT_TOKENS.view.leftColumn(isSelected)}>
					{viewMode === 'card' ? (
						<div className={LAYOUT_TOKENS.view.cardGrid(isSelected)}>
							{baits.map((bait) => (
								<BaitCard
									key={bait.id}
									bait={bait}
									fishes={allFishes}
									isSelected={selectedBaitId === bait.id}
									onClickDetail={(b) => handleSelectFromList({ type: 'bait', item: b })}
								/>
							))}
						</div>
					) : (
						<div className={LAYOUT_TOKENS.view.listContainer}>
							{baits.map((bait) => (
								<BaitListItem
									key={bait.id}
									bait={bait}
									fishCount={fishCountMap.get(bait.id) || 0}
									isSelected={selectedBaitId === bait.id}
									onClickDetail={(b) => handleSelectFromList({ type: 'bait', item: b })}
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
								checkedFishIds={checkedFishIds}
								onToggleCheck={handleToggleCheck}
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
								allFishes={allFishes}
								regionList={REGIONS}
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
		</>
	);
};