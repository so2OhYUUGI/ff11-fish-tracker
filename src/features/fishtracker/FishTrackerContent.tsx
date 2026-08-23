/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/FishTrackerContent.tsx
 * [Role]     メイン領域の表示切替・フィルタリング・ルーティングコンポーネント
 * 
 * [概要]
 * - 選択中のタブ（`mainTab`: 'fish' | 'bait' | 'area'）に応じた表示ビューの切替
 * - 魚データ（`FISHES`）に対するフィルタリング（チェック状態：`statusFilter` / 検索文字列：`searchQuery`）の適用
 * - 餌データ（`BAITS`）に対する検索フィルタリングの適用
 * - エリアデータ（`ZONES`）に対する検索フィルタリングの適用
 * - ナビゲーションスタック（`navStack`）を受け取り、各一覧ビューへ詳細循環遷移ロジックを伝達
 * - フィルタリング処理の最適化（`useMemo` によるメモ化）
 * 
 * [依存関係・関連ファイル]
 * - データ       : src/data/
 * - ビュー       : FishView, BaitView, AreaView
 * - 型定義       : src/types/fish, FilterBar
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【メモ化維持】 useMemo によるフィルタリング最適化を崩さないこと。
 * 2. 【SEO管理】 SEOメタデータ（SeoHead）は親の FishTrackerContainer (App.tsx) で一元管理しています。
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { FISHES, ZONES, BAITS } from '@/data/';
import { FishView } from './fish/FishView';
import { BaitView } from './bait/BaitView';
import { AreaView } from './area/AreaView';
import type { MainTab, ViewMode, CharacterProgress } from '@/types/fishtracker';
import type { StatusFilter } from '@/features/fishtracker/FilterBar';
import type { useNavigationStack } from '@/hooks/useNavigationStack';

type FishTrackerContentProps = {
	mainTab: MainTab;
	statusFilter: StatusFilter;
	searchQuery: string;
	viewMode: ViewMode;
	activeCharacter: CharacterProgress;
	onToggleCheck: (fishId: number) => void;
	navStack: ReturnType<typeof useNavigationStack>;
};

export const FishTrackerContent: React.FC<FishTrackerContentProps> = ({
	mainTab,
	statusFilter,
	searchQuery,
	viewMode,
	activeCharacter,
	onToggleCheck,
	navStack,
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

	return (
		<>
			{mainTab === 'fish' && (
				<FishView
					fishes={filteredFishes}
					zones={ZONES}
					checkedFishIds={activeCharacter.checkedFishIds}
					viewMode={viewMode}
					onToggleCheck={onToggleCheck}
					navStack={navStack}
				/>
			)}
			{mainTab === 'bait' && (
				<BaitView
					baits={filteredBaits}
					allFishes={FISHES}
					checkedFishIds={activeCharacter.checkedFishIds}
					viewMode={viewMode}
					onToggleCheck={onToggleCheck}
					navStack={navStack}
				/>
			)}
			{mainTab === 'area' && (
				<AreaView
					areas={filteredAreas}
					allFishes={FISHES}
					checkedFishIds={activeCharacter.checkedFishIds}
					viewMode={viewMode}
					onToggleCheck={onToggleCheck}
					navStack={navStack}
				/>
			)}
		</>
	);
};