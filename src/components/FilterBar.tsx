/**
 * ============================================================================
 * [FilePath] src/components/FilterBar.tsx
 * [Role] メインナビゲーション・絞り込み条件・検索・プログレス表示コンポーネント
 * 
 * [概要]
 * - メイン表示タブ（魚 / 餌）の切替
 * - 魚表示時の状態絞り込み（すべて / 未達成 / 達成済）および進捗率（プログレスバー）の描画
 * - 名称検索インプット（魚名 / 餌名の自動切替）
 * - 表示モード切替（カード表示 / リスト表示）
 * 
 * [編集・改修時の注意事項]
 * 1. 【吸着レイアウト（Sticky）】
 *    本コンポーネントは `App.tsx` 内で `sticky top-[75px]` として配置されます。
 *    上下幅（padding）等の調整を行う場合は、`App.tsx` 側の位置設定との整合性を考慮してください。
 * 2. 【条件付きレンダリング】
 *    ステータスフィルターおよび達成率表示領域は `mainTab === 'fish'` の場合のみ描画されます。
 * 3. 【プログレス表示】
 *    `totalFishCount` が 0 の場合は 0% 計算のゼロ除算防止ロジックを含んでいます。
 * ============================================================================
 */

import React from 'react';
import { Search, LayoutGrid, List, Fish, Utensils } from 'lucide-react';
import type { ViewMode, MainTab, CharacterProgress } from '@/types/fish';

export type StatusFilter = 'all' | 'checked' | 'unchecked';

type FilterBarProps = {
	mainTab: MainTab;
	onMainTabChange: (tab: MainTab) => void;
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
	mainTab,
	onMainTabChange,
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
	const progressPercent =
		totalFishCount > 0 ? Math.round((checkedCount / totalFishCount) * 100) : 0;

	return (
		<div className="bg-slate-800 border-b border-slate-700 py-3 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
				{/* 左側: メイン切り替え（魚 / 餌） & ステータスフィルター */}
				<div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
					{/* 魚/餌切り替えタブ */}
					<div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
						<button
							onClick={() => onMainTabChange('fish')}
							className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mainTab === 'fish'
								? 'bg-blue-600 text-white shadow'
								: 'text-slate-400 hover:text-slate-200'
								}`}
						>
							<Fish className="w-3.5 h-3.5" />
							<span>魚</span>
						</button>
						<button
							onClick={() => onMainTabChange('bait')}
							className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mainTab === 'bait'
								? 'bg-blue-600 text-white shadow'
								: 'text-slate-400 hover:text-slate-200'
								}`}
						>
							<Utensils className="w-3.5 h-3.5" />
							<span>餌</span>
						</button>
					</div>

					{/* ステータスフィルター（魚表示時のみ有効） */}
					{mainTab === 'fish' && (
						<div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 flex-1 sm:flex-none">
							<button
								onClick={() => onStatusFilterChange('all')}
								className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'all'
									? 'bg-slate-700 text-white shadow'
									: 'text-slate-400 hover:text-slate-200'
									}`}
							>
								すべて
							</button>
							<button
								onClick={() => onStatusFilterChange('unchecked')}
								className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'unchecked'
									? 'bg-amber-600 text-white shadow'
									: 'text-slate-400 hover:text-slate-200'
									}`}
							>
								未達成
							</button>
							<button
								onClick={() => onStatusFilterChange('checked')}
								className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'checked'
									? 'bg-emerald-600 text-white shadow'
									: 'text-slate-400 hover:text-slate-200'
									}`}
							>
								達成済
							</button>
						</div>
					)}
				</div>

				{/* 中央: 達成率表示領域（魚タブ選択時のみ表示） */}
				{mainTab === 'fish' ? (
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:flex-1 lg:max-w-xs px-2">
						<div className="flex justify-between items-center text-xs font-semibold text-slate-300 whitespace-nowrap gap-2">
							<span>達成率: {progressPercent}%</span>
							<span className="text-slate-400 font-normal">
								({checkedCount} / {totalFishCount} 種)
							</span>
						</div>
						<div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
							<div
								className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
								style={{ width: `${progressPercent}%` }}
							/>
						</div>
					</div>
				) : (
					<div className="hidden lg:block lg:flex-1" />
				)}

				{/* 右側: 検索 & 表示モード切り替え */}
				<div className="flex items-center gap-2 w-full lg:w-auto">
					{/* 検索入力フォーム */}
					<div className="relative flex-1 sm:w-64">
						<Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							placeholder={mainTab === 'fish' ? '魚名で検索...' : '餌名で検索...'}
							value={searchQuery}
							onChange={(e) => onSearchQueryChange(e.target.value)}
							className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
						/>
					</div>

					{/* カード/リスト表示切替ボタン */}
					<div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 shrink-0">
						<button
							onClick={() => onViewModeChange('card')}
							className={`p-1.5 rounded transition-colors ${viewMode === 'card'
								? 'bg-slate-700 text-blue-400'
								: 'text-slate-400 hover:text-slate-200'
								}`}
							title="カード表示"
						>
							<LayoutGrid className="w-4 h-4" />
						</button>
						<button
							onClick={() => onViewModeChange('list')}
							className={`p-1.5 rounded transition-colors ${viewMode === 'list'
								? 'bg-slate-700 text-blue-400'
								: 'text-slate-400 hover:text-slate-200'
								}`}
							title="リスト表示"
						>
							<List className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};