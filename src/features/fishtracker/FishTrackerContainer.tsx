/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/FishTrackerContainer.tsx
 * [Role] 釣魚チェッカーのメイン画面用コンテナコンポーネント（共有キャラ対応版）
 * 
 * [概要]
 * - UserDataContext から状態および操作関数を取得し、Props 伝播（バケツリレー）を廃止
 * - タブ切り替え（handleMainTabChange）時の URL クエリパラメータ（location.search）保持
 * - checkedFishIds の数値化・正規化ロジックの最適化と型安全性の向上
 * - 閲覧専用状態および未登録ガード判定のロジックを整理
 * 
 * [依存関係・関連ファイル]
 * - データ      : src/data/
 * - Context     : src/contexts/UserDataContext.tsx
 * - フック      : src/features/fishtracker/hooks/useTrackerSeo.ts, src/features/fishtracker/hooks/useTrackerNavigation.ts
 * - コンポーネント: src/components/common/SeoHead.tsx, src/features/fishtracker/FilterBar.tsx, src/features/fishtracker/FishTrackerContent.tsx
 * - トークン    : src/styles/tokens/layoutTokens.ts
 * - 型定義      : src/types/fishtracker.ts, src/components/layout/Header.tsx
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【ID正規化処理】 effectiveActiveCharacter 内での checkedFishIds の数値化・フィルタリング（Number.isInteger）は括り出しを正確に行い、NaN や不整合データの混入を確実に防ぐこと
 * 2. 【共有キャラガード】 effectiveActiveCharacter.isShared が true の場合は、チェック操作（handleToggleCheck）時にトースト通知を出して処理を中断すること
 * 3. 【クエリ保持】 タブ切り替え時は location.search を引き継ぎ、絞り込み状態や検索キーワードを維持すること
 * ============================================================================
 */

import { useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { FISHES } from '@/data/';
import type { DisplayCharacterProgress } from './hooks/useTrackerNavigation';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { SeoHead } from '@/components/common/SeoHead';
import { FilterBar, type StatusFilter } from '@/features/fishtracker/FilterBar';
import { FishTrackerContent } from '@/features/fishtracker/FishTrackerContent';
import { useTrackerSeo } from '@/features/fishtracker/hooks/useTrackerSeo';
import { useTrackerNavigation } from '@/features/fishtracker/hooks/useTrackerNavigation';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import type { MainTab } from '@/types/fishtracker';

export function FishTrackerContainer() {
	const navigate = useNavigate();
	const location = useLocation();
	const { type, slug } = useParams<{ type?: string; slug?: string }>();
	const [searchParams, setSearchParams] = useSearchParams();

	const {
		activeCharacter,
		isRegistered,
		viewMode,
		setViewMode,
		toggleFishCheck,
		setRegistrationMessage: onRequestRegistration,
	} = useUserDataContext();

	const validTabs: MainTab[] = ['fish', 'bait', 'area'];
	const mainTab = validTabs.includes(type as MainTab) ? (type as MainTab) : 'fish';

	const statusFilter = (searchParams.get('status') as StatusFilter) || 'all';
	const searchQuery = searchParams.get('q') || '';

	// activeCharacter 内の checkedFishIds を数値配列へ安全に正規化
	const effectiveActiveCharacter: DisplayCharacterProgress = useMemo(() => {
		if (!activeCharacter) {
			return {
				id: 'guest',
				name: 'ゲスト',
				checkedFishIds: [],
				createdAt: 0,
				updatedAt: 0,
			};
		}

		const rawIds = Array.isArray(activeCharacter.checkedFishIds)
			? activeCharacter.checkedFishIds
			: [];

		const normalizedIds = rawIds
			.map((id) => (typeof id === 'number' ? id : Number(id)))
			.filter((id) => Number.isInteger(id));

		return {
			...activeCharacter,
			checkedFishIds: normalizedIds,
		};
	}, [activeCharacter]);

	// SEOおよびナビゲーション管理フック
	const { pageTitle, pageDescription } = useTrackerSeo(type, slug);
	const { effectiveNavStack } = useTrackerNavigation({
		type,
		slug,
		mainTab,
		isRegistered,
		activeCharacter: effectiveActiveCharacter,
		onRequestRegistration,
	});

	const { clear: clearNavStack } = effectiveNavStack;

	// タブ切り替え処理（クエリパラメータを保持して遷移）
	const handleMainTabChange = useCallback(
		(tab: MainTab) => {
			const canAccess = isRegistered || !!effectiveActiveCharacter.isShared;
			if (!canAccess) {
				onRequestRegistration('キャラクターを登録すると機能を利用できます');
				return;
			}
			clearNavStack();
			navigate(`/fishtracker/${tab}${location.search}`);
		},
		[isRegistered, effectiveActiveCharacter.isShared, onRequestRegistration, clearNavStack, navigate, location.search]
	);

	const handleStatusFilterChange = useCallback(
		(status: StatusFilter) => {
			setSearchParams(
				(prev) => {
					const nextParams = new URLSearchParams(prev);
					if (status === 'all') {
						nextParams.delete('status');
					} else {
						nextParams.set('status', status);
					}
					return nextParams;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	const handleSearchQueryChange = useCallback(
		(query: string) => {
			setSearchParams(
				(prev) => {
					const nextParams = new URLSearchParams(prev);
					if (query.trim()) {
						nextParams.set('q', query.trim());
					} else {
						nextParams.delete('q');
					}
					return nextParams;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	const handleToggleCheck = useCallback(
		(fishId: number) => {
			// 共有キャラの閲覧時はチェック操作不可
			if (effectiveActiveCharacter.isShared) {
				toast.info('共有キャラクターの釣獲状況は変更できません（閲覧専用）');
				return;
			}

			// 未登録かつ非共有時のガード
			if (!isRegistered || !activeCharacter) {
				onRequestRegistration('キャラクターを登録すると釣獲状況を記録できます');
				return;
			}

			const isCurrentlyChecked = effectiveActiveCharacter.checkedFishIds.includes(fishId);
			const targetFish = FISHES.find((f) => f.id === fishId);

			toggleFishCheck(fishId);

			if (isCurrentlyChecked && targetFish) {
				toast(`「${targetFish.ja}」のチェックを外しました`, {
					action: {
						label: '元に戻す',
						onClick: () => toggleFishCheck(fishId),
					},
					duration: 4000,
				});
			}
		},
		[isRegistered, activeCharacter, effectiveActiveCharacter, toggleFishCheck, onRequestRegistration]
	);

	return (
		<>
			<SeoHead
				title={pageTitle}
				description={pageDescription}
				path={location.pathname}
			/>

			<div className={LAYOUT_TOKENS.header.stickyFilterBar}>
				<FilterBar
					mainTab={mainTab}
					activeCharacter={effectiveActiveCharacter}
					onMainTabChange={handleMainTabChange}
					statusFilter={statusFilter}
					onStatusFilterChange={handleStatusFilterChange}
					searchQuery={searchQuery}
					onSearchQueryChange={handleSearchQueryChange}
					viewMode={viewMode}
					onViewModeChange={setViewMode}
					totalFishCount={FISHES.length}
				/>
			</div>

			<FishTrackerContent
				mainTab={mainTab}
				statusFilter={statusFilter}
				searchQuery={searchQuery}
				viewMode={viewMode}
				activeCharacter={effectiveActiveCharacter}
				onToggleCheck={handleToggleCheck}
				navStack={effectiveNavStack}
			/>
		</>
	);
}