/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/FilterBar.tsx
 * [Role] フェイスチェッカー用のメインナビゲーション・絞り込み・検索・進捗表示コンポーネント
 * 
 * [概要]
 * - メイン表示タブ（フェイス一覧 / ウィッシュリスト / マクロ管理）の切替
 * - フェイス表示時の修得ステータス絞り込み（すべて / 未修得 / 修得済み）および進捗率描画
 * - 名称検索インプット（IME完全対応・テキストクリア機能付き）
 * 
 * [依存関係・関連ファイル]
 * - 型定義  : src/types/fishtracker.ts (CharacterProgress参照)
 * - スタイル: src/styles/features/FishTrackerStyle.ts (FILTER_BAR_STYLES共通利用)
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【アクセシビリティ】 タブ切替ボタンには aria-label 属性を設定すること
 * 2. 【検索制御】 入力キーワードのクリアボタン表示制御およびクリア処理（onSearchQueryChange('')）を維持すること
 * 3. 【数値計算】 checkedTrustIds 配列の要素数と totalTrustCount からプログレス表示率（progressPercent）を正しく算出すること
 * ============================================================================
 */

import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import { Search, Users, Heart, Terminal, X } from 'lucide-react';
import type { CharacterProgress } from '@/types/fishtracker';
import { FILTER_BAR_STYLES } from '@/styles/features/FishTrackerStyle';

export type TrustSubtype = 'trust' | 'wishlist' | 'macro';
export type StatusFilter = 'all' | 'checked' | 'unchecked';

type FilterBarProps = {
	activeType: TrustSubtype;
	onTypeChange: (type: TrustSubtype) => void;
	activeCharacter: CharacterProgress;
	statusFilter: StatusFilter;
	onStatusFilterChange: (status: StatusFilter) => void;
	searchQuery: string;
	onSearchQueryChange: (query: string) => void;
	totalTrustCount: number;
};

export const SUBTYPE_CONFIG: Record<
	TrustSubtype,
	{ label: string; icon: React.ElementType; description: string }
> = {
	trust: {
		label: 'フェイス一覧',
		icon: Users,
		description: '修得済みフェイスの管理と一覧確認が行えます。',
	},
	wishlist: {
		label: 'ウィッシュリスト',
		icon: Heart,
		description: 'これから集めたい目標フェイスの登録・参照が行えます。',
	},
	macro: {
		label: 'マクロ管理',
		icon: Terminal,
		description: '呼び出しマクロや呼び出し構成（パーティ）の管理が行えます。',
	},
};

export const FilterBar: React.FC<FilterBarProps> = ({
	activeType,
	onTypeChange,
	activeCharacter,
	totalTrustCount,
	statusFilter,
	onStatusFilterChange,
	searchQuery,
	onSearchQueryChange,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);

	// 親からの searchQuery 変更（クリアボタンなど）を input 要素へ確実に同期
	useEffect(() => {
		if (inputRef.current && inputRef.current.value !== searchQuery) {
			inputRef.current.value = searchQuery;
		}
	}, [searchQuery]);

	// 修得済み数の算出
	const checkedCount = Array.isArray(activeCharacter?.checkedTrustIds)
		? activeCharacter.checkedTrustIds.length
		: 0;

	const progressPercent = useMemo(
		() => (totalTrustCount > 0 ? Math.round((checkedCount / totalTrustCount) * 100) : 0),
		[checkedCount, totalTrustCount]
	);

	const searchPlaceholder = useMemo(() => {
		switch (activeType) {
			case 'trust':
				return 'フェイス名で検索...';
			case 'wishlist':
				return 'リスト内を検索...';
			case 'macro':
				return 'マクロ名・構成名で検索...';
		}
	}, [activeType]);

	const handleInput = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			const target = e.target as HTMLInputElement;
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
				{/* 左側: サブタイプ切り替え & ステータスフィルター */}
				<div className={FILTER_BAR_STYLES.leftGroup}>
					<div className={FILTER_BAR_STYLES.tabContainer}>
						{(Object.keys(SUBTYPE_CONFIG) as TrustSubtype[]).map((subKey) => {
							const { label, icon: Icon } = SUBTYPE_CONFIG[subKey];
							const isActive = activeType === subKey;

							return (
								<button
									key={subKey}
									type="button"
									onClick={() => onTypeChange(subKey)}
									className={`${FILTER_BAR_STYLES.tabButtonBase} ${isActive ? FILTER_BAR_STYLES.tabActive : FILTER_BAR_STYLES.tabInactive
										}`}
									aria-label={`${label}タブ`}
								>
									<Icon className={FILTER_BAR_STYLES.tabIcon} />
									<span>{label}</span>
								</button>
							);
						})}
					</div>

					{activeType === 'trust' && (
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
								未修得
							</button>
							<button
								type="button"
								onClick={() => onStatusFilterChange('checked')}
								className={`${FILTER_BAR_STYLES.statusButtonBase} ${statusFilter === 'checked'
									? FILTER_BAR_STYLES.statusCheckedActive
									: FILTER_BAR_STYLES.statusInactive
									}`}
							>
								修得済み
							</button>
						</div>
					)}
				</div>

				{/* 中央: 達成率表示領域 */}
				{activeType === 'trust' ? (
					<div className={FILTER_BAR_STYLES.progressGroup}>
						<div className={FILTER_BAR_STYLES.progressTextContainer}>
							<span>達成率: {progressPercent}%</span>
							<span className={FILTER_BAR_STYLES.progressSubText}>
								({checkedCount} / {totalTrustCount} 種)
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

				{/* 右側: 検索インプット */}
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
				</div>
			</div>
		</div>
	);
};