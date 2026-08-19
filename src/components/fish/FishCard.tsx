import React from 'react';
import { Check, Info } from 'lucide-react';
import type { FishMaster, ZoneMaster } from '@/types/fish';

type FishCardProps = {
	fish: FishMaster;
	zones: ZoneMaster[];
	isChecked: boolean;
	onToggleCheck: (id: number) => void;
};

// ↓ ここを 「export const FishCard: React.FC<FishCardProps> = ...」に指定します
export const FishCard: React.FC<FishCardProps> = ({
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
			className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-200 select-none ${isChecked
					? 'bg-slate-800/60 border-emerald-500/50 shadow-sm opacity-80 hover:opacity-100'
					: 'bg-slate-800 border-slate-700 hover:border-slate-500 shadow-md'
				}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<h3 className={`font-bold text-base ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
							{fish.ja}
						</h3>
						<span className="text-xs text-slate-400 font-mono">({fish.en})</span>
					</div>

					{/* アイテム説明文 */}
					{fish.description && (
						<div className="bg-slate-900/60 p-2.5 rounded border border-slate-700/50 text-xs text-slate-300 mb-3 leading-relaxed">
							{fish.description.split('\\n').map((line, index) => (
								<React.Fragment key={index}>
									{index > 0 && <br />}
									{line}
								</React.Fragment>
							))}
						</div>
					)}
					
					<div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs">
						<span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-medium">
							上限: {fish.maxSkill}
						</span>
						<span className={`px-2 py-0.5 rounded font-medium ${fish.sizeType === 'large' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-blue-950/80 text-blue-300 border border-blue-800'
							}`}>
							{fish.sizeType === 'large' ? '大型魚' : '小型魚'}
						</span>
						{fish.harakiri && (
							<span className="bg-red-950/80 text-red-300 border border-red-800 px-2 py-0.5 rounded font-medium">
								ハラキリ
							</span>
						)}
						{fish.ebisu && (
							<span className="bg-purple-950/80 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-medium">
								恵比寿
							</span>
						)}
						{fish.taikobou && (
							<span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-medium">
								太公望
							</span>
						)}
					</div>

					<div className="mt-3 text-xs text-slate-300 flex items-start gap-1">
						<span className="text-slate-500 shrink-0">生息エリア:</span>
						<span className="line-clamp-2">
							{fishZoneNames.length > 0 ? fishZoneNames.join('、') : '情報なし'}
						</span>
					</div>

					{fish.notes && (
						<div className="mt-2 text-xs text-slate-400 flex items-start gap-1 bg-slate-900/50 p-2 rounded border border-slate-700/50">
							<Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
							<span>{fish.notes}</span>
						</div>
					)}
				</div>

				<div className="shrink-0 pt-1">
					<div
						className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isChecked
								? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
								: 'bg-slate-700 text-slate-500 border border-slate-600'
							}`}
					>
						<Check className={`w-5 h-5 ${isChecked ? 'stroke-[3]' : 'stroke-[2]'}`} />
					</div>
				</div>
			</div>
		</div>
	);
};