import type { BaitMaster } from '@/types/fish';

type Props = {
	bait: BaitMaster;
	isObtained: boolean;
	onToggleObtained: (id: number) => void;
	onClickDetail: (bait: BaitMaster) => void;
};

export const BaitListItem = ({ bait, isObtained, onToggleObtained, onClickDetail }: Props) => {
	return (
		<div
      onClick= {() => onClickDetail(bait)}
className = "flex items-center gap-4 p-3 border-b hover:bg-gray-50 cursor-pointer bg-white"
	>
	{/* 独立したチェックボックス列 */ }
	< div onClick = {(e) => e.stopPropagation()} className = "flex items-center" >
		<input
          type="checkbox"
checked = { isObtained }
onChange = {() => onToggleObtained(bait.id)}
className = "w-5 h-5 rounded cursor-pointer"
	/>
	</div>
	< div className = "flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 items-center" >
		<div className="font-bold" > { bait.ja } </div>
			< div className = "text-sm text-gray-500" > { bait.en } </div>
				< div className = "text-sm text-gray-600 truncate" > { bait.description } </div>
					</div>
					</div>
  );
};