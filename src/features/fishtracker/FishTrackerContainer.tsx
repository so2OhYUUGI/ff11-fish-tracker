/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/FishTrackerContainer.tsx
 * [Role] 釣魚チェッカーのメイン画面用コンテナコンポーネント（リファクタリング版）
 * ============================================================================
 */

import { useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

import { useUserData } from '@/hooks/useUserData';
import { FISHES } from '@/data/';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/common/AdBanner';
import { SeoHead } from '@/components/common/SeoHead';
import { FilterBar, type StatusFilter } from '@/features/fishtracker/FilterBar';
import { FishTrackerContent } from '@/features/fishtracker/FishTrackerContent';
import { useTrackerSeo } from '@/features/fishtracker/hooks/useTrackerSeo';
import { useTrackerNavigation } from '@/features/fishtracker/hooks/useTrackerNavigation';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import type { MainTab, ViewMode, CharacterProgress } from '@/types/fishtracker';

type FishTrackerContainerProps = {
	userData: ReturnType<typeof useUserData>['userData'];
	activeCharacter: CharacterProgress | undefined;
	isRegistered: boolean;
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
	setActiveCharacter: (characterId: string) => void;
	toggleFishCheck: (fishId: number) => void;
	onOpenSettings: () => void;
	onOpenMasterEditor: () => void;
	onRequestRegistration: (message: string) => void;
};

export function FishTrackerContainer({
	userData,
	activeCharacter,
	isRegistered,
	viewMode,
	setViewMode,
	setActiveCharacter,
	toggleFishCheck,
	onOpenSettings,
	onOpenMasterEditor,
	onRequestRegistration,
}: FishTrackerContainerProps) {
	const navigate = useNavigate();
	const { type, slug } = useParams<{ type?: string; slug?: string }>();
	const [searchParams, setSearchParams] = useSearchParams();

	const validTabs: MainTab[] = ['fish', 'bait', 'area'];
	const mainTab = validTabs.includes(type as MainTab) ? (type as MainTab) : 'fish';

	const statusFilter = (searchParams.get('status') as StatusFilter) || 'all';
	const searchQuery = searchParams.get('q') || '';

	// カスタムフックによるSEO管理とナビゲーション制御の分離
	const { pageTitle, pageDescription } = useTrackerSeo(type, slug);
	const { effectiveNavStack } = useTrackerNavigation({
		type,
		slug,
		mainTab,
		isRegistered,
		activeCharacter,
		onRequestRegistration,
	});

	const handleMainTabChange = (tab: MainTab) => {
		if (!isRegistered || !activeCharacter) {
			onRequestRegistration('キャラクターを登録すると機能を利用できます');
			return;
		}
		effectiveNavStack.clear();
		navigate(`/fishtracker/${tab}`);
	};

	const handleStatusFilterChange = (status: StatusFilter) => {
		setSearchParams((prev) => {
			prev.set('status', status);
			return prev;
		});
	};

	const handleSearchQueryChange = (query: string) => {
		setSearchParams((prev) => {
			if (query) {
				prev.set('q', query);
			} else {
				prev.delete('q');
			}
			return prev;
		});
	};

	const handleToggleCheck = useCallback(
		(fishId: number) => {
			if (!isRegistered || !activeCharacter) {
				onRequestRegistration('キャラクターを登録すると釣獲状況を記録できます');
				return;
			}

			const isCurrentlyChecked = activeCharacter.checkedFishIds.includes(fishId);
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
		[isRegistered, activeCharacter, toggleFishCheck, onRequestRegistration]
	);

	const effectiveActiveCharacter: CharacterProgress = activeCharacter || {
		id: 'guest',
		name: 'ゲスト',
		checkedFishIds: [],
		createdAt: 0,
		updatedAt: 0,
	};

	return (
		<div className={LAYOUT_TOKENS.page.appWrapper}>
			<SeoHead
				title={pageTitle}
				description={pageDescription}
				path={window.location.pathname}
			/>

			<Toaster position="bottom-right" theme="dark" />

			<div className={LAYOUT_TOKENS.header.stickyWrapper}>
				<Header
					characters={userData.characters}
					activeCharacter={effectiveActiveCharacter}
					onSelectCharacter={setActiveCharacter}
					onOpenSettings={onOpenSettings}
					onOpenMasterEditor={onOpenMasterEditor}
				/>
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

			<AdBanner slotId="top-banner" />

			<main className={LAYOUT_TOKENS.page.mainContainer}>
				<FishTrackerContent
					mainTab={mainTab}
					statusFilter={statusFilter}
					searchQuery={searchQuery}
					viewMode={viewMode}
					activeCharacter={effectiveActiveCharacter}
					onToggleCheck={handleToggleCheck}
					navStack={effectiveNavStack}
				/>
			</main>

			<AdBanner slotId="bottom-banner" />

			<Footer />
		</div>
	);
}