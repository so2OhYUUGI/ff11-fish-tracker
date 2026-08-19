import type { BaitMaster } from '@/types/fish';

type Props = {
	bait: BaitMaster;
	isObtained: boolean;
	onToggleObtained: (id: number) => void;
	onClickDetail: (bait: BaitMaster) => void;
};

export const BaitCard = ({ bait, isObtained, onToggleObtained, onClickDetail }: Props) => {
	return (
		<div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between bg-white cursor-pointer" onClick={() => onClickDetail(bait)}>
			<div className="flex items-start justify-between gap-2">
				{/* チェックボックス：stopPropagationで詳細イベントの誤発火を防止 */}
				<div onClick={(e) => e.stopPropagation()} className="pt-1">
					<input
						type="checkbox"
						checked={isObtained}
						onChange={() => onToggleObtained(bait.id)}
						className="w-5 h-5 rounded cursor-pointer"
					/>
				</div>
				<div className="flex-1">
					<h3 className="font-bold text-lg">{bait.ja}</h3>
					<p className="text-sm text-gray-500">{bait.en}</p>
				</div>
			</div>
			<p className="text-sm text-gray-600 mt-2 line-clamp-2">{bait.description}</p>
		</div>
	);
};