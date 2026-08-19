import type { BaitMaster } from '@/types/fish';
import { LIST_STYLES } from '@/styles/listStyles';

type Props = {
	bait: BaitMaster;
	isSelected?: boolean;
	onClickDetail: (bait: BaitMaster) => void;
};

export const BaitListItem = ({ bait, isSelected, onClickDetail }: Props) => {
	return (
		<div
			onClick={() => onClickDetail(bait)}
			className={`${LIST_STYLES.base} ${isSelected ? LIST_STYLES.selected : LIST_STYLES.default
				}`}
		>
			<div className="flex items-center gap-3 min-w-0 flex-1">
				<div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-3">
					<div className="flex items-center gap-2">
						<span
							className={`${LIST_STYLES.titleJa} ${isSelected ? 'text-cyan-300' : LIST_STYLES.titleJaDefault
								}`}
						>
							{bait.ja}
						</span>
						<span className={LIST_STYLES.titleEn}>({bait.en})</span>
					</div>
				</div>
			</div>

			{bait.description && (
				<div className={LIST_STYLES.subText}>{
					bait.description.split('\\n').map((line) => (
						line
					))}</div>
			)}
		</div>
	);
};