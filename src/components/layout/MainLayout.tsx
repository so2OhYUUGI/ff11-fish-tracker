/**
 * ============================================================================
 * [FilePath] src/components/layout/MainLayout.tsx
 * [Role] アプリケーション全体の共通レイアウトコンポーネント
 * 
 * [概要]
 * - Header, Footer, AdBanner, Toaster, Outlet を配置する基盤レイアウト
 * - キャラクター情報等のProps伝播を廃止し、Header側でContextを参照する設計へ移行
 * 
 * [依存関係・関連ファイル]
 * - コンポーネント: src/components/layout/Header.tsx, src/components/layout/Footer.tsx, src/components/common/AdBanner.tsx
 * - トークン    : src/styles/tokens/layoutTokens.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レイアウト構造】 Sticky Header, 広告枠(Top/Bottom), Toaster, Main領域の構造を維持すること
 * 2. 【Prop Drilling排除】 キャラクター情報の伝播を行わず、必要な表示はHeader側で取得させること
 * ============================================================================
 */

import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/common/AdBanner';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

type MainLayoutProps = {
	onOpenSettings: () => void;
	onOpenMasterEditor?: () => void;
};

export function MainLayout({
	onOpenSettings,
	onOpenMasterEditor,
}: MainLayoutProps) {
	return (
		<div className={LAYOUT_TOKENS.page.appWrapper}>
			<Toaster position="bottom-right" theme="dark" />

			<div className={LAYOUT_TOKENS.header.stickyWrapper}>
				<Header
					onOpenSettings={onOpenSettings}
					onOpenMasterEditor={onOpenMasterEditor}
				/>
			</div>

			<AdBanner slotId="top-banner" />

			<main className={LAYOUT_TOKENS.page.mainLayoutContainer}>
				<Outlet />
			</main>

			<AdBanner slotId="bottom-banner" />

			<Footer />
		</div>
	);
}