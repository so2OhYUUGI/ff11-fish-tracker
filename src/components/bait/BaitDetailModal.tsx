import type { BaitMaster, FishMaster } from '@/types/fish';

type Props = {
	bait: BaitMaster | null;
	allFishes: FishMaster[];
	onClose: () => void;
};

export const BaitDetailModal = ({ bait, allFishes, onClose }: Props) => {
	if (!bait) return null;

	// 魚データ側の baitItemIds (IDの配列) から動的に逆引きして検索
	const targetFishes = allFishes.filter((fish) =>
		fish.baitItemIds?.includes(bait.id)
	);

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto text-slate-900"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-start mb-4">
					<div>
						<h2 className="text-xl font-bold">{bait.ja}</h2>
						<p className="text-sm text-gray-500">{bait.en}</p>
					</div>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 font-bold"
					>
						✕
					</button>
				</div>

				<div className="mb-6">
					<h4 className="font-semibold text-sm text-gray-700 mb-1">説明</h4>
					<p className="text-sm bg-gray-50 p-3 rounded">
						{bait.description || '説明なし'}
					</p>
				</div>

				<div>
					<h4 className="font-semibold text-sm text-gray-700 mb-2">
						対象の魚 ({targetFishes.length}種)
					</h4>
					{targetFishes.length > 0 ? (
						<ul className="divide-y border rounded max-h-48 overflow-y-auto">
							{targetFishes.map((fish) => (
								<li key={fish.id} className="p-2 text-sm flex justify-between">
									<span>{fish.ja}</span>
									<span className="text-gray-500">上限: {fish.maxSkill}</span>
								</li>
							))}
						</ul>
					) : (
						<p className="text-sm text-gray-400">対象の魚データがありません</p>
					)}
				</div>
			</div>
		</div>
	);
};