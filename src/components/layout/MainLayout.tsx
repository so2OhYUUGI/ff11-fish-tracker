/**
 * ============================================================================
 * [FilePath] src/components/layout/MainLayout.tsx
 * [Role] アプリケーション全体の共通レイアウトコンポーネント
 * 
 * [概要]
 * - Header, Footer, AdBanner, Toaster などの全画面共通UI枠組みを提供
 * - React Router の Outlet を使用し、配下のルートコンポーネントをメイン領域内に描画
 * ============================================================================
 */

import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

import { Header, type DisplayCharacterProgress } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/common/AdBanner';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

type MainLayoutProps = {
	characters: DisplayCharacterProgress[];
	activeCharacter?: DisplayCharacterProgress;
	onSelectCharacter: (characterId: string) => void;
	onOpenSettings: () => void;
	onOpenMasterEditor: () => void;
};

export function MainLayout({
	characters,
	activeCharacter,
	onSelectCharacter,
	onOpenSettings,
	onOpenMasterEditor,
}: MainLayoutProps) {
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

	return (
		<div className={LAYOUT_TOKENS.page.appWrapper}>
			<Toaster position="bottom-right" theme="dark" />

			<Header
				characters={characters}
				activeCharacter={effectiveActiveCharacter}
				onSelectCharacter={onSelectCharacter}
				onOpenSettings={onOpenSettings}
				onOpenMasterEditor={onOpenMasterEditor}
			/>

			<AdBanner slotId="top-banner" />

			<main className={LAYOUT_TOKENS.page.mainContainer}>
				<Outlet />
			</main>

			<AdBanner slotId="bottom-banner" />

			<Footer />
		</div>
	);
}