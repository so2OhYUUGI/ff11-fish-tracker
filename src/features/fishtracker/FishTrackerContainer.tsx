/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/FishTrackerContainer.tsx
 * [Role] 釣魚チェッカーのメイン画面用コンテナコンポーネント（共有キャラ対応版）
 * 
 * [調整内容]
 * - FilterBar 周囲に stickyWrapper を再配置し、スクロール時の追従位置を補正
 * ============================================================================
 */

import { useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { FISHES } from '@/data/';
import type { DisplayCharacterProgress } from '@/components/layout/Header';
import { SeoHead } from '@/components/common/SeoHead';
import { FilterBar, type StatusFilter } from '@/features/fishtracker/FilterBar';
import { FishTrackerContent } from '@/features/fishtracker/FishTrackerContent';
import { useTrackerSeo } from '@/features/fishtracker/hooks/useTrackerSeo';
import { useTrackerNavigation } from '@/features/fishtracker/hooks/useTrackerNavigation';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import type { MainTab, ViewMode } from '@/types/fishtracker';

type FishTrackerContainerProps = {
	activeCharacter?: DisplayCharacterProgress;
	isRegistered: boolean;
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
	toggleFishCheck: (fishId: number) => void;
	onRequestRegistration: (message: string) => void;
};

export function FishTrackerContainer({
	activeCharacter,
	isRegistered,
	viewMode,
	setViewMode,
	toggleFishCheck,
	onRequestRegistration,
}: FishTrackerContainerProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const { type, slug } = useParams<{ type?: string; slug?: string }>();
	const [searchParams, setSearchParams] = useSearchParams();

	const validTabs: MainTab[] = ['fish', 'bait', 'area'];
	const mainTab = validTabs.includes(type as MainTab) ? (type as MainTab) : 'fish';

	const statusFilter = (searchParams.get('status') as StatusFilter) || 'all';
	const searchQuery = searchParams.get('q') || '';

	// activeCharacter 内の checkedFishIds を確実に number[] へ正規化
	const effectiveActiveCharacter: DisplayCharacterProgress = useMemo(() => {
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

	// カスタムフックによるSEO管理とナビゲーション制御の分離
	const { pageTitle, pageDescription } = useTrackerSeo(type, slug);
	const { effectiveNavStack } = useTrackerNavigation({
		type,
		slug,
		mainTab,
		isRegistered,
		activeCharacter: effectiveActiveCharacter,
		onRequestRegistration,
	});

	const handleMainTabChange = useCallback(
		(tab: MainTab) => {
			if (!isRegistered && !effectiveActiveCharacter?.isShared) {
				onRequestRegistration('キャラクターを登録すると機能を利用できます');
				return;
			}
			effectiveNavStack.clear();
			navigate(`/fishtracker/${tab}`);
		},
		[isRegistered, effectiveActiveCharacter, onRequestRegistration, effectiveNavStack, navigate]
	);

	const handleStatusFilterChange = useCallback(
		(status: StatusFilter) => {
			setSearchParams(
				(prev) => {
					const nextParams = new URLSearchParams(prev);
					nextParams.set('status', status);
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
					if (query) {
						nextParams.set('q', query);
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
			if (effectiveActiveCharacter?.isShared) {
				toast.info('共有キャラクターの釣獲状況は変更できません（閲覧専用）');
				return;
			}

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

			<div className={LAYOUT_TOKENS.header.stickyWrapper}>
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