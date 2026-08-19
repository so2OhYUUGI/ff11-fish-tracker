import React from 'react';
import { Check } from 'lucide-react';
import type { FishMaster, ZoneMaster } from '@/types/fish';

type FishListItemProps = {
	fish: FishMaster;
	zones: ZoneMaster[];
	isChecked: boolean;
	onToggleCheck: (id: number) => void;
};

export const FishListItem: React.FC<FishListItemProps> = ({
	fish,
	zones,
	isChecked,
	onToggleCheck,
}) => {
	const fishZoneNames = fish.zoneIds
		.map((zid) => zones.find((z) => z.id === zid)?.ja)
		.filter(Boolean);

	return (
		<div
			onClick={() => onToggleCheck(fish.id)}
			className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all duration-150 ${isChecked
					? 'bg-slate-800/40 border-emerald-500/40 opacity-75'
					: 'bg-slate-800 border-slate-700 hover:border-slate-500'
				}`}
		>
			{/* 魚の基本情報 */}
			<div className="flex items-center gap-3 min-w-0 flex-1">
				{/* チェック状態インジケーター */}
				<div
					className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors ${isChecked
							? 'bg-emerald-600 text-white'
							: 'bg-slate-700 text-slate-500 border border-slate-600'
						}`}
				>
					<Check className="w-4 h-4" />
				</div>

				{/* 名前・英語名 */}
				<div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-3">
					<div className="flex items-center gap-2">
						<span className={`font-bold text-sm truncate ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
							{fish.ja}
						</span>
						<span className="text-xs text-slate-400 font-mono hidden sm:inline">({fish.en})</span>
					</div>

					{/* フラグバッジ群 */}
					<div className="flex items-center gap-1 mt-1 sm:mt-0 flex-wrap shrink-0">
						<span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
							上限: {fish.maxSkill}
						</span>
						<span className={`text-[10px] px-1.5 py-0.5 rounded ${fish.sizeType === 'large' ? 'bg-amber-950/80 text-amber-300' : 'bg-blue-950/80 text-blue-300'
							}`}>
							{fish.sizeType === 'large' ? '大型' : '小型'}
						</span>
						{fish.harakiri && (
							<span className="text-[10px] bg-red-950/80 text-red-300 px-1.5 py-0.5 rounded">
								ハラキリ
							</span>
						)}
						{fish.ebisu && (
							<span className="text-[10px] bg-purple-950/80 text-purple-300 px-1.5 py-0.5 rounded">
								恵比寿
							</span>
						)}
						{fish.taikobou && (
							<span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded">
								太公望
							</span>
						)}
					</div>
				</div>
			</div>

			{/* エリア（画面幅が十分なとき表示） */}
			<div className="hidden md:block text-xs text-slate-400 max-w-[200px] truncate text-right">
				{fishZoneNames.length > 0 ? fishZoneNames.join(', ') : '情報なし'}
			</div>
		</div>
	);
};