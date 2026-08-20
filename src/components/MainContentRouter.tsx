/**
 * ============================================================================
 * [FilePath] src/components/MainContentRouter.tsx
 * [Role] メイン領域の表示切替・フィルタリング・ルーティングコンポーネント
 * 
 * [概要]
 * - 選択中のタブ（`mainTab`: 'fish' | 'bait' | 'area'）に応じた表示ビューの切替
 * - 魚データ（`FISHES`）に対するフィルタリング（チェック状態：`statusFilter` / 検索文字列：`searchQuery`）の適用
 * - 餌データ（`BAITS`）に対する検索フィルタリングの適用
 * - エリアデータ（`ZONES`）に対する検索フィルタリングの適用
 * - フィルタリング処理の最適化（`useMemo` によるメモ化）
 * 
 * [編集・改修時の注意事項]
 * 1. 【検索仕様】
 *    魚・餌・エリアの検索は日本語名（`ja`）と英語名（`en`）の両方を対象にした部分一致検索を行っています。
 * 2. 【フィルタ条件の追加】
 *    新しいフィルタ（スキル帯、サイズ等）を追加する場合は、`filteredFishes` 内の条件判定ロジックを拡張してください。
 * 3. 【新しいメインタブの追加】
 *    新しいメインタブを追加する場合は、`switch (mainTab)` に case を追加してください。
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { FISHES, ZONES, BAITS } from '@/data/';
import { FishListView } from '@/components/fish/FishListView';
import { BaitListView } from '@/components/bait/BaitListView';
import { AreaListView } from '@/components/area/AreaListView';
import type { MainTab, ViewMode, CharacterProgress } from '@/types/fish';
import type { StatusFilter } from '@/components/FilterBar';

type MainContentRouterProps = {
	mainTab: MainTab;
	statusFilter: StatusFilter;
	searchQuery: string;
	viewMode: ViewMode;
	activeCharacter: CharacterProgress;
	onToggleCheck: (fishId: number) => void;
};

export const MainContentRouter: React.FC<MainContentRouterProps> = ({
	mainTab,
	statusFilter,
	searchQuery,
	viewMode,
	activeCharacter,
	onToggleCheck,
}) => {
	const filteredFishes = useMemo(() => {
		return FISHES.filter((fish) => {
			const isChecked = activeCharacter.checkedFishIds.includes(fish.id);
			if (statusFilter === 'checked' && !isChecked) return false;
			if (statusFilter === 'unchecked' && isChecked) return false;

			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase();
				const matchJa = fish.ja.toLowerCase().includes(query);
				const matchEn = fish.en.toLowerCase().includes(query);
				if (!matchJa && !matchEn) return false;
			}

			return true;
		});
	}, [activeCharacter.checkedFishIds, statusFilter, searchQuery]);

	const filteredBaits = useMemo(() => {
		if (!searchQuery.trim()) return BAITS;
		const query = searchQuery.toLowerCase();
		return BAITS.filter(
			(bait) =>
				bait.ja.toLowerCase().includes(query) ||
				bait.en.toLowerCase().includes(query)
		);
	}, [searchQuery]);

	const filteredAreas = useMemo(() => {
		if (!searchQuery.trim()) return ZONES;
		const query = searchQuery.toLowerCase();
		return ZONES.filter(
			(zone) =>
				zone.ja.toLowerCase().includes(query) ||
				zone.en.toLowerCase().includes(query)
		);
	}, [searchQuery]);

	switch (mainTab) {
		case 'fish':
			return (
				<FishListView
					fishes={filteredFishes}
					zones={ZONES}
					checkedFishIds={activeCharacter.checkedFishIds}
					viewMode={viewMode}
					onToggleCheck={onToggleCheck}
				/>
			);
		case 'bait':
			return (
				<BaitListView
					baits={filteredBaits}
					allFishes={FISHES}
					viewMode={viewMode}
				/>
			);
		case 'area':
			return (
				<AreaListView
					areas={filteredAreas}
					allFishes={FISHES}
					viewMode={viewMode}
				/>
			);
		default:
			return null;
	}
};