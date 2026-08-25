/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/FilterBar.tsx
 * [Role] メインナビゲーション・絞り込み条件・検索・プログレス表示コンポーネント
 * 
 * [概要]
 * - メイン表示タブ（魚 / 餌 / エリア）の切替
 * - 魚表示時の状態絞り込み（すべて / 未釣獲 / 釣獲済み）および進捗率（プログレスバー）の描画
 * - 名称検索インプット（魚名 / 餌名 / エリア名の自動切替・テキストクリア機能付き）
 * - 表示モード切替（カード表示 / リスト表示）
 * ============================================================================
 */

import React from 'react';
import { Search, LayoutGrid, List, Fish, Utensils, MapPin, X } from 'lucide-react';
import type { ViewMode, MainTab, CharacterProgress } from '@/types/fishtracker';
import { FILTER_BAR_STYLES } from '@/styles/features/FishTrackerStyle';

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
	const checkedCount = activeCharacter?.checkedFishIds?.length ?? 0;
	const progressPercent =
		totalFishCount > 0 ? Math.round((checkedCount / totalFishCount) * 100) : 0;

	return (
		<div className={FILTER_BAR_STYLES.container}>
			<div className={FILTER_BAR_STYLES.inner}>
				{/* 左側: メイン切り替え（魚 / 餌 / エリア） & ステータスフィルター */}
				<div className={FILTER_BAR_STYLES.leftGroup}>
					{/* 魚/餌/エリア切り替えタブ */}
					<div className={FILTER_BAR_STYLES.tabContainer}>
						<button
							type="button"
							onClick={() => onMainTabChange('fish')}
							className={`${FILTER_BAR_STYLES.tabButtonBase} ${mainTab === 'fish'
									? FILTER_BAR_STYLES.tabActive
									: FILTER_BAR_STYLES.tabInactive
								}`}
							aria-label="魚一覧タブ"
						>
							<Fish className={FILTER_BAR_STYLES.tabIcon} />
							<span>魚</span>
						</button>
						<button
							type="button"
							onClick={() => onMainTabChange('bait')}
							className={`${FILTER_BAR_STYLES.tabButtonBase} ${mainTab === 'bait'
									? FILTER_BAR_STYLES.tabActive
									: FILTER_BAR_STYLES.tabInactive
								}`}
							aria-label="餌一覧タブ"
						>
							<Utensils className={FILTER_BAR_STYLES.tabIcon} />
							<span>餌</span>
						</button>
						<button
							type="button"
							onClick={() => onMainTabChange('area')}
							className={`${FILTER_BAR_STYLES.tabButtonBase} ${mainTab === 'area'
									? FILTER_BAR_STYLES.tabActive
									: FILTER_BAR_STYLES.tabInactive
								}`}
							aria-label="エリア一覧タブ"
						>
							<MapPin className={FILTER_BAR_STYLES.tabIcon} />
							<span>エリア</span>
						</button>
					</div>

					{/* ステータスフィルター（魚表示時のみ有効） */}
					{mainTab === 'fish' && (
						<div className={FILTER_BAR_STYLES.filterContainer}>
							<button
								type="button"
								onClick={() => onStatusFilterChange('all')}
								className={`${FILTER_BAR_STYLES.statusButtonBase} ${statusFilter === 'all'
										? FILTER_BAR_STYLES.statusAllActive
										: FILTER_BAR_STYLES.statusInactive
									}`}
							>
								すべて
							</button>
							<button
								type="button"
								onClick={() => onStatusFilterChange('unchecked')}
								className={`${FILTER_BAR_STYLES.statusButtonBase} ${statusFilter === 'unchecked'
										? FILTER_BAR_STYLES.statusUncheckedActive
										: FILTER_BAR_STYLES.statusInactive
									}`}
							>
								未釣獲
							</button>
							<button
								type="button"
								onClick={() => onStatusFilterChange('checked')}
								className={`${FILTER_BAR_STYLES.statusButtonBase} ${statusFilter === 'checked'
										? FILTER_BAR_STYLES.statusCheckedActive
										: FILTER_BAR_STYLES.statusInactive
									}`}
							>
								釣獲済み
							</button>
						</div>
					)}
				</div>

				{/* 中央: 達成率表示領域（魚タブ選択時のみ表示） */}
				{mainTab === 'fish' ? (
					<div className={FILTER_BAR_STYLES.progressGroup}>
						<div className={FILTER_BAR_STYLES.progressTextContainer}>
							<span>達成率: {progressPercent}%</span>
							<span className={FILTER_BAR_STYLES.progressSubText}>
								({checkedCount} / {totalFishCount} 種)
							</span>
						</div>
						<div className={FILTER_BAR_STYLES.progressBarTrack}>
							<div
								className={FILTER_BAR_STYLES.progressBarFill}
								style={{ width: `${progressPercent}%` }}
							/>
						</div>
					</div>
				) : (
					<div className={FILTER_BAR_STYLES.progressSpacer} />
				)}

				{/* 右側: 検索 & 表示モード切り替え */}
				<div className={FILTER_BAR_STYLES.rightGroup}>
					{/* 検索入力フォーム */}
					<div className={FILTER_BAR_STYLES.searchContainer}>
						<Search className={FILTER_BAR_STYLES.searchIcon} />
						<input
							type="text"
							placeholder={
								mainTab === 'fish'
									? '魚名で検索...'
									: mainTab === 'bait'
										? '餌名で検索...'
										: 'エリア名で検索...'
							}
							value={searchQuery}
							onChange={(e) => onSearchQueryChange(e.target.value)}
							className={`${FILTER_BAR_STYLES.searchInput} ${searchQuery ? FILTER_BAR_STYLES.searchInputHasValue : ''
								}`}
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => onSearchQueryChange('')}
								className={FILTER_BAR_STYLES.searchClearButton}
								aria-label="検索内容をクリア"
							>
								<X className={FILTER_BAR_STYLES.searchClearIcon} />
							</button>
						)}
					</div>

					{/* カード/リスト表示切替ボタン */}
					<div className={FILTER_BAR_STYLES.viewModeContainer}>
						<button
							type="button"
							onClick={() => onViewModeChange('card')}
							className={`${FILTER_BAR_STYLES.viewModeButtonBase} ${viewMode === 'card'
									? FILTER_BAR_STYLES.viewModeActive
									: FILTER_BAR_STYLES.viewModeInactive
								}`}
							title="カード表示"
							aria-label="カード表示に切り替え"
						>
							<LayoutGrid className={FILTER_BAR_STYLES.viewModeIcon} />
						</button>
						<button
							type="button"
							onClick={() => onViewModeChange('list')}
							className={`${FILTER_BAR_STYLES.viewModeButtonBase} ${viewMode === 'list'
									? FILTER_BAR_STYLES.viewModeActive
									: FILTER_BAR_STYLES.viewModeInactive
								}`}
							title="リスト表示"
							aria-label="リスト表示に切り替え"
						>
							<List className={FILTER_BAR_STYLES.viewModeIcon} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};