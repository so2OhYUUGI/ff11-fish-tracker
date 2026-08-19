import React, { useMemo } from 'react';
import { FISHES, ZONES, BAITS } from '@/data/';
import { FishListView } from '@/components/fish/FishListView';
import { BaitListView } from '@/components/bait/BaitListView';
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
		default:
			return null;
	}
};