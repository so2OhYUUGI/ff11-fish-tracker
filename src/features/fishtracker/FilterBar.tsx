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
 * 
 * [依存関係・関連ファイル]
 * - 型定義  : src/types/fishtracker.ts
 * - スタイル: src/styles/features/FishTrackerStyle.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【アクセシビリティ】 タブ切替・表示モード切替ボタンには aria-label および title 属性を設定すること
 * 2. 【検索制御】 入力キーワードのクリアボタン表示制御およびクリア処理（onSearchQueryChange('')）を維持すること
 * 3. 【数値計算】 checkedFishIds 配列の要素数と totalFishCount からプログレス表示率（progressPercent）を正しく算出すること
 * ============================================================================
 */

import React, { useCallback, useMemo } from 'react';
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

const TAB_CONFIG: Array<{ id: MainTab; label: string; icon: React.ElementType }> = [
	{ id: 'fish', label: '魚', icon: Fish },
	{ id: 'bait', label: '餌', icon: Utensils },
	{ id: 'area', label: 'エリア', icon: MapPin },
];

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
	const checkedCount = Array.isArray(activeCharacter?.checkedFishIds)
		? activeCharacter.checkedFishIds.length
		: 0;

	const progressPercent = useMemo(
		() => (totalFishCount > 0 ? Math.round((checkedCount / totalFishCount) * 100) : 0),
		[checkedCount, totalFishCount]
	);

	const searchPlaceholder = useMemo(() => {
		switch (mainTab) {
			case 'fish':
				return '魚名で検索...';
			case 'bait':
				return '餌名で検索...';
			case 'area':
				return 'エリア名で検索...';
		}
	}, [mainTab]);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onSearchQueryChange(e.target.value);
		},
		[onSearchQueryChange]
	);

	const handleSearchClear = useCallback(() => {
		onSearchQueryChange('');
	}, [onSearchQueryChange]);

	return (
		<div className={FILTER_BAR_STYLES.container}>
			<div className={FILTER_BAR_STYLES.inner}>
				{/* 左側: メイン切り替え & ステータスフィルター */}
				<div className={FILTER_BAR_STYLES.leftGroup}>
					<div className={FILTER_BAR_STYLES.tabContainer}>
						{TAB_CONFIG.map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								type="button"
								onClick={() => onMainTabChange(id)}
								className={`${FILTER_BAR_STYLES.tabButtonBase} ${mainTab === id
										? FILTER_BAR_STYLES.tabActive
										: FILTER_BAR_STYLES.tabInactive
									}`}
								aria-label={`${label}一覧タブ`}
							>
								<Icon className={FILTER_BAR_STYLES.tabIcon} />
								<span>{label}</span>
							</button>
						))}
					</div>

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

				{/* 中央: 達成率表示領域 */}
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
					<div className={FILTER_BAR_STYLES.searchContainer}>
						<Search className={FILTER_BAR_STYLES.searchIcon} />
						<input
							type="text"
							placeholder={searchPlaceholder}
							value={searchQuery}
							onChange={handleSearchChange}
							className={`${FILTER_BAR_STYLES.searchInput} ${searchQuery ? FILTER_BAR_STYLES.searchInputHasValue : ''
								}`}
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={handleSearchClear}
								className={FILTER_BAR_STYLES.searchClearButton}
								aria-label="検索内容をクリア"
							>
								<X className={FILTER_BAR_STYLES.searchClearIcon} />
							</button>
						)}
					</div>

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