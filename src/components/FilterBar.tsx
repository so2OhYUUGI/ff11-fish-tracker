import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import type { ViewMode } from '@/types/fish';
import type { CharacterProgress } from '@/types/fish';

export type StatusFilter = 'all' | 'checked' | 'unchecked';

type FilterBarProps = {
	activeCharacter: CharacterProgress;
	statusFilter: StatusFilter;
	onStatusFilterChange: (status: StatusFilter) => void;
	searchQuery: string;
	onSearchQueryChange: (query: string) => void;
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
	totalFishCount: number;
};

export const FilterBar: React.FC<FilterBarProps> = ({
	activeCharacter,
	totalFishCount,
	statusFilter,
	onStatusFilterChange,
	searchQuery,
	onSearchQueryChange,
	viewMode,
	onViewModeChange,
}) => {
	const checkedCount = activeCharacter.checkedFishIds.length;
	const progressPercent = totalFishCount > 0
		? Math.round((checkedCount / totalFishCount) * 100)
		: 0;

	return (
		
		<div className="bg-slate-800 border-b border-slate-700 py-3 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

				{/* ステータスフィルター（タブ） */}
				<div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 w-full sm:w-auto">
					<button
						onClick={() => onStatusFilterChange('all')}
						className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'all'
								? 'bg-blue-600 text-white shadow'
								: 'text-slate-400 hover:text-slate-200'
							}`}
					>
						すべて
					</button>
					<button
						onClick={() => onStatusFilterChange('unchecked')}
						className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'unchecked'
								? 'bg-amber-600 text-white shadow'
								: 'text-slate-400 hover:text-slate-200'
							}`}
					>
						未達成
					</button>
					<button
						onClick={() => onStatusFilterChange('checked')}
						className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'checked'
								? 'bg-emerald-600 text-white shadow'
								: 'text-slate-400 hover:text-slate-200'
							}`}
					>
						達成済
					</button>
				</div>

				<div className="flex items-center gap-2 w-full sm:w-auto">
					{/* 検索入力フォーム */}
					<div className="relative flex-1 sm:w-64">
						<Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							placeholder="魚名で検索..."
							value={searchQuery}
							onChange={(e) => onSearchQueryChange(e.target.value)}
							className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
						/>
					</div>

					{/* カード/リスト表示切替ボタン */}
					<div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 shrink-0">
						<button
							onClick={() => onViewModeChange('card')}
							className={`p-1.5 rounded transition-colors ${viewMode === 'card' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-slate-200'
								}`}
							title="カード表示"
						>
							<LayoutGrid className="w-4 h-4" />
						</button>
						<button
							onClick={() => onViewModeChange('list')}
							className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-slate-200'
								}`}
							title="リスト表示"
						>
							<List className="w-4 h-4" />
						</button>
					</div>
				</div>

			</div>
			{/* 進捗バー領域 */}
			< div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center gap-2" >
				<div className="flex justify-between items-center text-xs font-semibold text-slate-300 w-full sm:w-auto sm:min-w-[140px]">
					<span>達成率: {progressPercent}%</span>
					<span className="text-slate-400 font-normal">({checkedCount} / {totalFishCount} 種)</span>
				</div>
				<div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
					<div
						className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
						style={{ width: `${progressPercent}%` }}
					/>
				</div>
			</div >
				</div>
	);
};