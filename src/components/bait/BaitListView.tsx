import { useState } from 'react';
import type { BaitMaster, FishMaster } from '@/types/fish';
import { BaitCard } from './BaitCard';
import { BaitListItem } from './BaitListItem';
import { BaitDetailModal } from './BaitDetailModal';

type Props = {
	baits: BaitMaster[];
	allFishes: FishMaster[];
	viewMode: 'card' | 'list';
	obtainedBaitIds: number[];
	onToggleObtained: (id: number) => void;
};

export const BaitListView = ({
	baits,
	allFishes,
	viewMode,
	obtainedBaitIds,
	onToggleObtained,
}: Props) => {
	const [selectedBait, setSelectedBait] = useState<BaitMaster | null>(null);

	return (
		<div>
			{ viewMode === 'card' ? (
				<div className= "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" >
				{
					baits.map((bait) => (
						<BaitCard
              key= { bait.id }
              bait = { bait }
              isObtained = { obtainedBaitIds.includes(bait.id) }
              onToggleObtained = { onToggleObtained }
              onClickDetail = { setSelectedBait }
						/>
          ))
				}
		</div>
      ) : (
		<div className= "border rounded-lg overflow-hidden" >
		{
			baits.map((bait) => (
				<BaitListItem
              key= { bait.id }
              bait = { bait }
              isObtained = { obtainedBaitIds.includes(bait.id) }
              onToggleObtained = { onToggleObtained }
              onClickDetail = { setSelectedBait }
				/>
          ))
		}
		</div>
      )}

{/* 詳細モーダル */ }
<BaitDetailModal
        bait={ selectedBait }
allFishes = { allFishes }
onClose = {() => setSelectedBait(null)}
      />
	</div>
  );
};