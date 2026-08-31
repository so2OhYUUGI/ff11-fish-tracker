/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/FilterBar.tsx
 * [Role] フェイスチェッカー用のメインナビゲーション・絞り込み・検索・進捗表示コンポーネント
 * 
 * [概要]
 * - メイン表示タブの切替（未登録ユーザーは「フェイス一覧」「マクロ管理」のみロック、ウィッシュリストは利用可）
 * - フェイス表示時の修得ステータス絞り込み（すべて / 未修得 / 修得済み）および進捗率描画
 * - ウィッシュリスト表示時のスロット切替（文字列IDによる動的レンダリング）
 * - ウィッシュリスト内の新規作成ボタンは未登録ユーザー時にロック
 * - ウィッシュリスト表示時は進捗バーおよび検索インプットを非表示
 * 
 * [依存関係・関連ファイル]
 * - Context  : src/contexts/UserDataContext.tsx
 * - 型定義  : src/types/fishtracker.ts (CharacterProgress参照), src/types/trusttracker.ts (Wishlist参照)
 * - スタイル: src/styles/features/FishTrackerStyle.ts (FILTER_BAR_STYLES共通利用)
 * ============================================================================
 */

import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import { Search, Users, Heart, Terminal, X, Plus, Share2, Lock } from 'lucide-react';
import { useUserDataContext } from '@/contexts/UserDataContext';
import type { CharacterProgress } from '@/types/';
import type { Wishlist } from '@/types/trusttracker';
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
	wishlists?: Wishlist[];
	activeWishlistId?: string;
	onWishlistIdChange?: (id: string) => void;
	onCreateWishlist?: () => void;
};

const SUBTYPE_CONFIG: Record<
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
	wishlists = [],
	activeWishlistId = '',
	onWishlistIdChange,
	onCreateWishlist,
}) => {
	const { isRegistered } = useUserDataContext();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current && inputRef.current.value !== searchQuery) {
			inputRef.current.value = searchQuery;
		}
	}, [searchQuery]);

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
			case 'macro':
				return 'マクロ名・構成名で検索...';
			default:
				return '';
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

	const MAX_MY_WISHLISTS = 3;

	return (
		<div className={FILTER_BAR_STYLES.container}>
			<div className={FILTER_BAR_STYLES.inner}>
				{/* 左側: サブタイプ切り替え & 各機能のフィルター・スロットボタン */}
				<div className={FILTER_BAR_STYLES.leftGroup}>
					<div className={FILTER_BAR_STYLES.tabContainer}>
						{(Object.keys(SUBTYPE_CONFIG) as TrustSubtype[]).map((subKey) => {
							const { label, icon: Icon } = SUBTYPE_CONFIG[subKey];
							const isActive = activeType === subKey;

							// 未登録時に「フェイス一覧」「マクロ管理」タブをロック
							const isLockedTab = !isRegistered && subKey !== 'wishlist';

							return (
								<button
									key={subKey}
									type="button"
									onClick={!isLockedTab ? () => onTypeChange(subKey) : undefined}
									disabled={isLockedTab}
									title={isLockedTab ? 'キャラクター登録を行うと利用できます' : undefined}
									className={`${FILTER_BAR_STYLES.tabButtonBase} ${isLockedTab
											? 'opacity-50 cursor-not-allowed text-slate-500'
											: isActive
												? FILTER_BAR_STYLES.tabActive
												: FILTER_BAR_STYLES.tabInactive
										}`}
									aria-label={`${label}タブ`}
								>
									{isLockedTab ? (
										<Lock className={FILTER_BAR_STYLES.tabIcon} />
									) : (
										<Icon className={FILTER_BAR_STYLES.tabIcon} />
									)}
									<span>{label}</span>
								</button>
							);
						})}
					</div>

					{/* フェイス一覧時の修得ステータスフィルター */}
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

					{/* ウィッシュリスト時のスロット切替 */}
					{activeType === 'wishlist' && (
						<div className={FILTER_BAR_STYLES.filterContainer}>
							{wishlists.map((list) => {
								const isActive = activeWishlistId === list.id;
								const isShared =
									(list as unknown as Record<string, unknown>).isShared ||
									list.id.startsWith('shared-');

								return (
									<button
										key={list.id}
										type="button"
										onClick={() => onWishlistIdChange?.(list.id)}
										className={`${FILTER_BAR_STYLES.statusButtonBase} ${isActive
												? FILTER_BAR_STYLES.statusAllActive
												: FILTER_BAR_STYLES.statusInactive
											}`}
										aria-label={`ウィッシュリスト: ${list.name}`}
									>
										{isShared && <Share2 className="w-3 h-3 mr-1 inline opacity-80" />}
										<span>{list.name}</span>
										<span className="text-[10px] opacity-75 ml-1">
											({list.trustIds?.length ?? 0})
										</span>
									</button>
								);
							})}

							{/* マイリスト上限未満の場合に作成ボタン表示（未登録時は作成のみロック） */}
							{wishlists.filter(
								(l) =>
									!(l as unknown as Record<string, unknown>).isShared &&
									!l.id.startsWith('shared-')
							).length < MAX_MY_WISHLISTS &&
								onCreateWishlist && (
									<button
										type="button"
										onClick={isRegistered ? onCreateWishlist : undefined}
										disabled={!isRegistered}
										title={!isRegistered ? 'キャラクター登録を行うと作成できます' : undefined}
										className={`${FILTER_BAR_STYLES.statusButtonBase} ${!isRegistered
												? 'opacity-50 cursor-not-allowed bg-slate-800/50 text-slate-500 border-slate-700'
												: `${FILTER_BAR_STYLES.statusInactive} border-dashed`
											}`}
										aria-label="新規ウィッシュリスト作成"
									>
										{!isRegistered ? (
											<Lock className="w-3 h-3 mr-1 inline" />
										) : (
											<Plus className="w-3 h-3 mr-1 inline" />
										)}
										<span>作成</span>
									</button>
								)}
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
				{activeType !== 'wishlist' && (
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
				)}
			</div>
		</div>
	);
};