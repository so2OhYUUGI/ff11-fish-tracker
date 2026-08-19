import React from 'react';
import { Check, Info } from 'lucide-react';
import type { FishMaster, ZoneMaster } from '@/types/fish';
import { CARD_STYLES } from '@/styles/cardStyles';

type FishCardProps = {
	fish: FishMaster;
	zones: ZoneMaster[];
	isChecked: boolean;
	isSelected?: boolean;
	onToggleCheck: (id: number) => void;
	onClickDetail: (fish: FishMaster) => void;
};

export const FishCard: React.FC<FishCardProps> = ({
	fish,
	zones,
	isChecked,
	isSelected,
	onToggleCheck,
	onClickDetail,
}) => {
	const fishZoneNames = fish.zoneIds
		.map((zid) => zones.find((z) => z.id === zid)?.ja)
		.filter(Boolean);

	return (
		<div
			onClick={() => onClickDetail(fish)}
			className={`${CARD_STYLES.base} ${isSelected ? CARD_STYLES.selected : CARD_STYLES.default
				}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<h3
							className={`${CARD_STYLES.titleJa} ${isSelected ? 'text-cyan-300' : CARD_STYLES.titleJaDefault
								}`}
						>
							{fish.ja}
						</h3>
						<span className={CARD_STYLES.titleEn}>({fish.en})</span>
					</div>

					{/* アイテム説明文 */}
					{fish.description && (
						<div className={`mb-3 mt-2 ${CARD_STYLES.boxBlock}`}>
							{fish.description.split('\\n').map((line, index) => (
								<React.Fragment key={index}>
									{index > 0 && <br />}
									{line}
								</React.Fragment>
							))}
						</div>
					)}

					{/* タグ領域 */}
					<div className="flex flex-wrap items-center gap-1.5 mt-2">
						<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeDefault}`}>
							上限: {fish.maxSkill}
						</span>
						<span
							className={`${CARD_STYLES.badgeBase} ${fish.sizeType === 'large'
									? CARD_STYLES.badgeLarge
									: CARD_STYLES.badgeSmall
								}`}
						>
							{fish.sizeType === 'large' ? '大型魚' : '小型魚'}
						</span>
						{fish.harakiri && (
							<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeHarakiri}`}>
								ハラキリ
							</span>
						)}
						{fish.ebisu && (
							<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeEbisu}`}>
								恵比寿
							</span>
						)}
						{fish.taikobou && (
							<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeTaikobou}`}>
								太公望
							</span>
						)}
					</div>

					{/* 生息エリア */}
					<div className="mt-3 text-xs text-slate-300 flex items-start gap-1">
						<span className="text-slate-500 shrink-0">生息エリア:</span>
						<span className="line-clamp-2">
							{fishZoneNames.length > 0 ? fishZoneNames.join('、') : '情報なし'}
						</span>
					</div>

					{/* 備考 */}
					{fish.notes && (
						<div className={CARD_STYLES.notesBlock}>
							<Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
							<span>{fish.notes}</span>
						</div>
					)}
				</div>

				{/* チェック状態インジケーター（クリックイベントのバブリングを防止） */}
				<div className="shrink-0 pt-1">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onToggleCheck(fish.id);
						}}
						className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isChecked
								? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
								: 'bg-slate-700 text-slate-500 border border-slate-600 hover:border-slate-400'
							}`}
					>
						<Check
							className={`w-5 h-5 ${isChecked ? 'stroke-[3]' : 'stroke-[2]'}`}
						/>
					</button>
				</div>
			</div>
		</div>
	);
};