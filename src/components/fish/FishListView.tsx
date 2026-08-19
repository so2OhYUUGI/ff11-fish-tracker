import { FishCard } from '@/components/fish/FishCard';
import { FishListItem } from '@/components/fish/FishListItem';
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
	if (fishes.length === 0) {
		return (
			<div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-800">
				<p className="text-slate-400 text-sm">該当する魚が見つかりませんでした。</p>
			</div>
		);
	}

	if (viewMode === 'card') {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{fishes.map((fish) => (
					<FishCard
						key={fish.id}
						fish={fish}
						zones={zones}
						isChecked={checkedFishIds.includes(fish.id)}
						onToggleCheck={onToggleCheck}
					/>
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{fishes.map((fish) => (
				<FishListItem
					key={fish.id}
					fish={fish}
					zones={zones}
					isChecked={checkedFishIds.includes(fish.id)}
					onToggleCheck={onToggleCheck}
				/>
			))}
		</div>
	);
};