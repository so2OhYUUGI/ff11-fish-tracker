import React from 'react';
import { Search } from 'lucide-react';

export type StatusFilter = 'all' | 'checked' | 'unchecked';

type FilterBarProps = {
	statusFilter: StatusFilter;
	onStatusFilterChange: (status: StatusFilter) => void;
	searchQuery: string;
	onSearchQueryChange: (query: string) => void;
};

export const FilterBar: React.FC<FilterBarProps> = ({
	statusFilter,
	onStatusFilterChange,
	searchQuery,
	onSearchQueryChange,
}) => {
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

				{/* 検索入力フォーム */}
				<div className="relative w-full sm:w-64">
					<Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						placeholder="魚名で検索..."
						value={searchQuery}
						onChange={(e) => onSearchQueryChange(e.target.value)}
						className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
					/>
				</div>

			</div>
		</div>
	);
};