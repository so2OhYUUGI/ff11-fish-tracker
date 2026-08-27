/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/FishTrackerContainer.tsx
 * [Role] 釣魚チェッカーのメイン画面用コンテナコンポーネント（共有キャラ対応版）
 * 
 * [調整内容]
 * - setSearchParams のコールバック内で new URLSearchParams(prev) を生成し参照の同一性による更新スキップを防止
 * - FilterBar および Header へ渡すハンドラー関数を useCallback でメモ化
 * ============================================================================
 */

import { useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

import { useUserData } from '@/hooks/useUserData';
import { FISHES } from '@/data/';

import { Header, type DisplayCharacterProgress } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/common/AdBanner';
import { SeoHead } from '@/components/common/SeoHead';
import { FilterBar, type StatusFilter } from '@/features/fishtracker/FilterBar';
import { FishTrackerContent } from '@/features/fishtracker/FishTrackerContent';
import { useTrackerSeo } from '@/features/fishtracker/hooks/useTrackerSeo';
import { useTrackerNavigation } from '@/features/fishtracker/hooks/useTrackerNavigation';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import type { MainTab, ViewMode } from '@/types/fishtracker';

type FishTrackerContainerProps = {
	userData: ReturnType<typeof useUserData>['userData'];
	displayCharacters?: DisplayCharacterProgress[];
	activeCharacter?: DisplayCharacterProgress;
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
	displayCharacters,
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
	const location = useLocation();
	const { type, slug } = useParams<{ type?: string; slug?: string }>();
	const [searchParams, setSearchParams] = useSearchParams();

	const validTabs: MainTab[] = ['fish', 'bait', 'area'];
	const mainTab = validTabs.includes(type as MainTab) ? (type as MainTab) : 'fish';

	const statusFilter = (searchParams.get('status') as StatusFilter) || 'all';
	const searchQuery = searchParams.get('q') || '';

	// 画面表示用の全キャラクターリスト（未指定時はローカルデータを使用）
	const characterList = displayCharacters || userData.characters;

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
			// 共有キャラ閲覧時または登録済みの場合はタブ切替を許可
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
			// 1. 共有キャラクター選択時は編集不可
			if (effectiveActiveCharacter?.isShared) {
				toast.info('共有キャラクターの釣獲状況は変更できません（閲覧専用）');
				return;
			}

			// 2. 未登録かつ自身のキャラがない場合
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
		<div className={LAYOUT_TOKENS.page.appWrapper}>
			<SeoHead
				title={pageTitle}
				description={pageDescription}
				path={location.pathname}
			/>

			<Toaster position="bottom-right" theme="dark" />

			<div className={LAYOUT_TOKENS.header.stickyWrapper}>
				<Header
					characters={characterList}
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