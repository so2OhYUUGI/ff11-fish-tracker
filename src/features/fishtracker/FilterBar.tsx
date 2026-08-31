/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/FilterBar.tsx
 * [Role] メインナビゲーション・絞り込み条件・検索・プログレス表示コンポーネント
 * 
 * [概要]
 * - メイン表示タブ（魚 / 餌 / エリア）の切替
 * - 魚表示時の状態絞り込み（すべて / 未釣獲 / 釣獲済み）および進捗率（プログレスバー）の描画
 * - 進捗共有ボタン（ShareProgressButton）による釣魚進捗の外部共有機能
 * - 名称検索インプット（魚名 / 餌名 / エリア名の自動切替・テキストクリア機能付き・IME完全対応）
 * - 表示モード切替（カード表示 / リスト表示）
 * 
 * [依存関係・関連ファイル]
 * - コンポーネント: src/components/common/ShareProgressButton.tsx
 * - 型定義      : src/types/fishtracker.ts
 * - スタイル    : src/styles/features/FishTrackerStyle.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【アクセシビリティ】 タブ切替・表示モード切替ボタンには aria-label および title 属性を設定すること
 * 2. 【検索制御】 入力キーワードのクリアボタン表示制御およびクリア処理（onSearchQueryChange('')）を維持すること
 * 3. 【数値計算】 checkedFishIds 配列の要素数と totalFishCount からプログレス表示率（progressPercent）を正しく算出すること
 * 4. 【データ安全性】 ShareProgressButton へ渡す activeCharacter の checkedFishIds が数値配列であることを保証すること
 * ============================================================================
 */

import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import { Search, LayoutGrid, List, Fish, Utensils, MapPin, X } from 'lucide-react';
import type { ViewMode, MainTab, CharacterProgress } from '@/types/';
import { FILTER_BAR_STYLES } from '@/styles/features/FishTrackerStyle';
import { ShareProgressButton } from '@/components/common/ShareProgressButton';

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
	const inputRef = useRef<HTMLInputElement>(null);

	// 親からの searchQuery 変更（クリアボタンなど）を input 要素へ確実に同期する
	useEffect(() => {
		if (inputRef.current && inputRef.current.value !== searchQuery) {
			inputRef.current.value = searchQuery;
		}
	}, [searchQuery]);

	// ShareProgressButton へ渡す安全な形式の activeCharacter
	const safeActiveCharacter = useMemo(() => {
		const rawChar = activeCharacter || {
			id: 'guest',
			name: 'ゲスト',
			checkedFishIds: [],
			createdAt: 0,
			updatedAt: 0,
		};

		return {
			...rawChar,
			checkedFishIds: Array.isArray(rawChar.checkedFishIds)
				? rawChar.checkedFishIds.map((id) => Number(id)).filter((id) => !isNaN(id))
				: [],
		};
	}, [activeCharacter]);

	const checkedCount = safeActiveCharacter.checkedFishIds.length;

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

	const handleInput = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			const target = e.target as HTMLInputElement;
			// IME変換中（isComposing）は親への伝搬を抑止し、未確定文字の消失を防ぐ
			if ((e.nativeEvent as InputEvent).isComposing) {
				return;
			}
			onSearchQueryChange(target.value);
		},
		[onSearchQueryChange]
	);

	const handleCompositionEnd = useCallback(
		(e: React.CompositionEvent<HTMLInputElement>) => {
			onSearchQueryChange(e.currentTarget.value);
		},
		[onSearchQueryChange]
	);

	const handleSearchClear = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.value = '';
		}
		onSearchQueryChange('');
	}, [onSearchQueryChange]);

	return (
		<div className={FILTER_BAR_STYLES.container}>
			<div className={FILTER_BAR_STYLES.inner}>
				{/* 左側領域: 1段目全体（左にタブ/フィルター、右端に共有ボタン） */}
				<div className={`${FILTER_BAR_STYLES.leftGroup} !justify-between w-full`}>
					<div className="flex items-center gap-2 flex-wrap">
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

					{/* 1段目の最右端に共有ボタンを配置 */}
					{mainTab === 'fish' && (
						<ShareProgressButton activeCharacter={safeActiveCharacter} />
					)}
				</div>

				{/* 中央: 達成率表示領域（元コード通りの完全長バー） */}
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
							ref={inputRef}
							type="text"
							placeholder={searchPlaceholder}
							defaultValue={searchQuery}
							onInput={handleInput}
							onCompositionEnd={handleCompositionEnd}
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